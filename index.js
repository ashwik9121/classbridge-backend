const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // allow all origins
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Translate endpoint
app.post('/api/translate', async (req, res) => {
  const { text, to } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const response = await axios.post(
      'https://libretranslate.de/translate', // reliable endpoint
      { q: text, source: 'auto', target: to || 'en', format: 'text' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json({ translatedText: response.data.translatedText });
  } catch (err) {
    console.error(err.message);
    res.json({ translatedText: text + ' (translation failed)' });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
