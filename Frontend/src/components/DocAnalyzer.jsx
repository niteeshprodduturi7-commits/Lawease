import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import axios from "axios";

const SUMMARY_API_URL =
  process.env.REACT_APP_SUMMARY_API_URL || "http://localhost:5002/summarize";

function DocAnalyzer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [canSendToChatbot, setCanSendToChatbot] = useState(false);
  const navigate = useNavigate();

  // Handle File Selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("⚠️ Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    // send the desired output language (e.g. English, Spanish)
    formData.append("language", language);

    setLoading(true);
    setSummary("");
    setCanSendToChatbot(false);

    try {
      const response = await axios.post(SUMMARY_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const generatedSummary = response.data.summary || "";
      setSummary(generatedSummary);
      setCanSendToChatbot(Boolean(generatedSummary.trim()));
    } catch (error) {
      console.error("❌ Error analyzing document:", error);
      const serverError = error.response?.data?.error;
      setSummary(
        serverError ||
          "⚠️ Error analyzing document. Please make sure the summarizer service is running."
      );
      setCanSendToChatbot(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChatbot = () => {
    if (!canSendToChatbot || !summary) return;
    navigate("/chatbot", {
      state: { initialMessage: summary.trim() },
    });
  };

  return (
    <section className="doc-analyzer">
      <div className="doc-analyzer__header">
        <h1 className="doc-analyzer__title"><span>Document Suite</span>Document Analyzer</h1>
        <p className="lead">Upload a document to generate a crisp legal summary. Supported formats: <strong>PDF, DOCX, TXT</strong>.</p>
      </div>

      <div className="doc-analyzer__grid">
        <form className="doc-panel" onSubmit={handleSubmit}>
          <label>Output Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
            <option>Kannada</option>
          </select>

          <label>Select document</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" className="input" />

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        <div className="doc-summary">
          <div className="doc-summary__heading">
            <span>Summary</span>
            <button
              type="button"
              aria-label="Discuss summary in chatbot"
              className="doc-summary__chat-launch"
              onClick={handleSendToChatbot}
              disabled={!canSendToChatbot}
              title={canSendToChatbot ? "Send to chatbot" : "Generate a summary first"}
              style={{
                marginLeft: "auto",
                border: "none",
                background: canSendToChatbot ? "#0d6efd" : "#9aa7c7",
                color: "#fff",
                borderRadius: "999px",
                padding: "0.35rem 0.5rem",
                cursor: canSendToChatbot ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.85rem"
              }}
            >
              <FaComments />
              <span style={{ fontWeight: 600 }}>Chat</span>
            </button>
          </div>
          {summary ? (
            <div className="doc-summary__body">
              {summary.split('\n').map((line, idx) => {
                const text = line.trim();
                return text ? <p key={idx}>{text}</p> : null;
              })}
            </div>
          ) : (
            <div className="doc-summary__placeholder">No summary yet — upload a document to begin.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DocAnalyzer;