// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");

// exports.analyzeDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("Received File:", req.file.originalname);

//     // Prepare file for sending
//     const filePath = path.join(__dirname, "..", req.file.path);
//     const fileStream = fs.createReadStream(filePath);

//     // Send file to Flask API
//     const flaskResponse = await axios.post("http://127.0.0.1:5001/summarize", fileStream, {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     });

//     // Delete the uploaded file after processing
//     fs.unlinkSync(filePath);

//     // Send Flask API's response to frontend
//     res.json({ summary: flaskResponse.data.summary });

//   } catch (error) {
//     console.error("Error analyzing document:", error);
//     res.status(500).json({ error: "Error analyzing document" });
//   }
// };
// documentController.js 2
// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const FormData = require("form-data");

// /**
//  * Assumes you used multer like:
//  *   const multer = require("multer");
//  *   const upload = multer({ dest: "uploads/" });
//  *   router.post("/analyze", upload.single("file"), analyzeDocument);
//  */
// exports.analyzeDocument = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const filePath = path.resolve(req.file.path); // temp file created by multer
//   const originalName = req.file.originalname;

//   try {
//     // Prepare multipart form with a named field "document" (Flask expects this)
//     const form = new FormData();
//     form.append("document", fs.createReadStream(filePath), {
//       filename: originalName,
//       contentType: req.file.mimetype || "application/octet-stream",
//     });

//     const flaskURL = process.env.SUMMARY_API_URL || "http://127.0.0.1:5001/summarize";

//     const response = await axios.post(flaskURL, form, {
//       headers: form.getHeaders(),
//       // Give big PDFs time to process
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity,
//       timeout: 120000,
//       validateStatus: () => true, // we'll handle non-200s below
//     });

//     // Forward Flask errors verbatim
//     if (response.status !== 200) {
//       return res.status(response.status).json({
//         error: response.data?.error || "Upstream summarizer error",
//       });
//     }

//     return res.json({ summary: response.data.summary });
//   } catch (err) {
//     console.error("Error analyzing document:", err);
//     return res.status(500).json({ error: "Error analyzing document" });
//   } finally {
//     // Always clean up temp file
//     try { fs.unlinkSync(filePath); } catch {}
//   }
// }; 3

// documentController.js
// documentController.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

exports.analyzeDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Get the temporary file path from multer
  const filePath = path.resolve(req.file.path);
  const originalName = req.file.originalname;

  try {
    // 1. Prepare form data with the file stream
    const form = new FormData();
    // Use the field name 'document' as expected by the Flask API
    form.append("document", fs.createReadStream(filePath), {
      filename: originalName,
      // Use req.file.mimetype or default to application/pdf
      contentType: req.file.mimetype || "application/pdf", 
    });

    const flaskURL = process.env.SUMMARY_API_URL || "http://127.0.0.1:5001/summarize";

    // 2. Send request to Flask API
    const response = await axios.post(flaskURL, form, {
      headers: form.getHeaders(), // Important for multipart/form-data
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 5 * 60 * 1000, // 5 minutes for large documents
      validateStatus: () => true, // Allows catching non-200 responses
    });

    // 3. Handle and forward response
    if (response.status !== 200) {
      return res.status(response.status).json({
        error: response.data?.error || "Upstream summarizer error",
      });
    }

    return res.json({ summary: response.data.summary });
  } catch (err) {
    console.error("Error analyzing document:", err);
    // If axios failed to connect at all
    return res.status(500).json({ error: "Error analyzing document: Could not connect to summarization service." });
  } finally {
    // 4. Clean up the temporary file
    try { fs.unlinkSync(filePath); } catch {}
  }
};