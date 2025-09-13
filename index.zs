const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// -------------------
// Transcription API
// -------------------
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const audioFile = req.file.path;

    // For demo, we just return "Simulated transcription"
    // You can replace this with OpenAI Whisper or any speech-to-text API
    const simulatedText = "This is a simulated transcription of your audio.";
    
    // Delete uploaded file after processing
    fs.unlinkSync(audioFile);

    res.json({ text: simulatedText });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

// -------------------
// Translation API (LibreTranslate)
// -------------------
async function translateText(text, targetLang) {
  try {
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",       // default source language
      target: targetLang, // user selected
      format: "text"
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback to original text
  }
}

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const translated = await translateText(text, targetLang);
    res.json({ translatedText: translated });
  } catch (error) {
    console.error("Translation endpoint error:", error);
    res.status(500).json({ error: "Failed to translate text" });
  }
});

// -------------------
// Start Server
// -------------------
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
