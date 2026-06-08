const express = require("express");
const multer = require("multer");
const documentController = require("../controllers/documentController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp folder to store files

router.post("/analyze", upload.single("document"), documentController.analyzeDocument);

module.exports = router;
