const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');

const upload = multer();
const app = express();

// Allow requests from all origins (simplest way to fix CORS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Translate endpoint
app.post('/api/translate', async (req, res) => {
  const { text, to } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const response = await axios.post(
      'https://libretranslate.com/translate',
      {
        q: text,
        source: 'auto',
        target: to || 'en',
        format: 'text'
      },
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ translatedText: response.data.translatedText });
  } catch (err) {
    console.error(err);
    res.json({ translatedText: text + ' (translation failed)' });
  }
});

app.listen(PORT, () => console.log(`Backend running on Render at port ${PORT}`));
