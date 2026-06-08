import io
import os
import time
from shutil import which
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import PyPDF2
import fitz  # PyMuPDF
import pytesseract
from PIL import Image

from google import genai
from google.genai import types
from google.genai.errors import APIError

# ------------------ SETUP ------------------
load_dotenv()


def resolve_tesseract_path():
    custom_path = os.getenv("TESSERACT_PATH")
    if custom_path and os.path.exists(custom_path):
        return custom_path

    for candidate in [
        "/opt/homebrew/bin/tesseract",
        "/usr/local/bin/tesseract",
        "/usr/bin/tesseract",
        r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
    ]:
        if os.path.exists(candidate):
            return candidate

    auto_detected = which("tesseract")
    return auto_detected if auto_detected and os.path.exists(auto_detected) else None


TESSERACT_PATH = resolve_tesseract_path()
if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
else:
    print("[summarizer] Warning: Tesseract binary not found. OCR fallback will be unavailable.")


GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured. Set it in your environment or .env file.")

client = genai.Client(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

# ------------------ SYSTEM PROMPTS ------------------
SYSTEM_INSTRUCTION_CLASSIFY = (
    "You are a Document Classifier AI. "
    "Determine whether the content is a formal legal document "
    "(contract, agreement, deed, court document, etc). "
    "Respond with ONLY 'LEGAL' or 'NON-LEGAL'."
)

SYSTEM_INSTRUCTION_LEGAL = (
    "You are a Senior Paralegal AI. "
    "Ignore stamps, headers, footers, noise, and non-English text. "
    "Focus on core English legal content. "
    "Produce a concise, **point-wise (bullet-style) summary**. "
    "Each point should be short, clear, self-contained, and include only key facts."
)

class SummarizerError(Exception):
    """Raised when we need to return a friendly error to the client."""

# ------------------ GEMINI HELPER ------------------
def gemini_generate(contents, config, retries=3):
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=contents,
                config=config
            )
            return response.text.strip()
        except APIError as e:
            status = getattr(e, "status_code", None)
            if status == 429 or "RESOURCE_EXHAUSTED" in str(e).upper():
                raise SummarizerError(
                    "Gemini quota exhausted. Please retry later or update billing."
                ) from e
            if attempt == retries - 1:
                raise e
            time.sleep(3)

# ------------------ CLASSIFICATION ------------------
def run_gemini_classification(content_parts):
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION_CLASSIFY,
        temperature=0.0,
        max_output_tokens=5
    )
    contents = ["Analyze the document:"] + content_parts
    result = gemini_generate(contents, config)
    return result.upper() == "LEGAL"

# ------------------ SUMMARIZATION ------------------
def summarize_with_gemini(content_parts, language=None):
    instruction = SYSTEM_INSTRUCTION_LEGAL
    if language:
        instruction += f"\nProvide the final summary in {language}."

    config = types.GenerateContentConfig(
        system_instruction=instruction,
        temperature=0.3,
        max_output_tokens=2048
    )
    # Ask explicitly for bullet points
    contents = ["Summarize the document in **bullet points**:"] + content_parts
    return gemini_generate(contents, config)

# ------------------ TEXT EXTRACTION ------------------
def extract_pdf_text(file_bytes, chunk_size=1000):
    text_chunks = []

    # Try normal text extraction
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text = page.extract_text()
            if text and text.strip():
                for i in range(0, len(text), chunk_size):
                    text_chunks.append(text[i:i+chunk_size])
    except:
        pass

    # OCR fallback for scanned PDFs
    if not text_chunks:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                pix = page.get_pixmap(dpi=300)
                image = Image.open(io.BytesIO(pix.tobytes("png")))
                text = pytesseract.image_to_string(image, lang="eng")
                if text.strip():
                    for i in range(0, len(text), chunk_size):
                        text_chunks.append(text[i:i+chunk_size])
            doc.close()
        except Exception as e:
            pass

    return text_chunks

def extract_txt_text(file_bytes, chunk_size=1000):
    text_chunks = []
    try:
        text = file_bytes.decode("utf-8")
        for i in range(0, len(text), chunk_size):
            text_chunks.append(text[i:i+chunk_size])
    except Exception as e:
        pass
    return text_chunks

# ------------------ ROUTES ------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "model": GEMINI_MODEL})

@app.route("/summarize", methods=["POST"])
def summarize_endpoint():
    if "document" not in request.files:
        return jsonify({"error": "Upload a file using form field 'document'"}), 400

    file = request.files["document"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file_bytes = file.read()
    if not file_bytes:
        return jsonify({"error": "File is empty"}), 400

    filename = file.filename.lower()
    content_parts = []

    # PDF
    if filename.endswith(".pdf"):
        content_parts = extract_pdf_text(file_bytes)
    # TXT
    elif filename.endswith(".txt"):
        content_parts = extract_txt_text(file_bytes)
    else:
        return jsonify({"error": "Unsupported file type. Only PDF or TXT allowed."}), 400

    if not content_parts:
        return jsonify({"error": "No readable text found in document"}), 400

    # Classification
    if not run_gemini_classification(content_parts):
        return jsonify({
            "summary": "Document classified as NON-LEGAL",
            "error": "Only legal documents are supported"
        }), 403

    language = (request.form.get("language") or "").strip()

    try:
        summary = summarize_with_gemini(content_parts, language if language else None)
        return jsonify({"summary": summary})
    except SummarizerError as err:
        return jsonify({"error": str(err)}), 503

# ------------------ RUN ------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
