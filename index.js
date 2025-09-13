// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');

const upload = multer();
const app = express();

// Replace with your Vercel frontend URL
const FRONTEND_URL = 'https://classbridge-frontend-dg3p-5hy9j8jrf-ashwik9121s-projects.vercel.app';

// Middleware
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic port for Render
const PORT = process.env.PORT || 4000;

// Health check endpoint
app.get('/api/health', (req, res) => {
    console.log('Health check ping received');
    res.json({ ok: true });
});

// Translate endpoint
app.post('/api/translate', upload.none(), async (req, res) => {
    const { text, to } = req.body;

    if (!text) {
        console.log('Translation request failed: text missing');
        return res.status(400).json({ error: 'Text is required' });
    }

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

        console.log(`Translation successful: "${text}" → "${response.data.translatedText}"`);
        return res.json({ translatedText: response.data.translatedText });

    } catch (error) {
        console.error('Translation error:', error.message);
        return res.json({ translatedText: text + ' (translation failed)' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ClassBridge backend running on Render at port ${PORT}`);
});

