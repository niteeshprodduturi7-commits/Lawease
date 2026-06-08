# test_pdf.py
import sys
import fitz

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    try:
        txt = []
        for page in doc:
            txt.append(page.get_text("text"))
        return "\n\n".join(txt)
    finally:
        doc.close()

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "long_legal_document.pdf"
    try:
        text = extract_text_from_pdf(path)
        print(f"Extracted {len(text)} characters, token estimate: approx {len(text)//4}")
        print(text[:4000])
    except Exception as e:
        print("Error:", e)
