import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.post('/translate', async (req, res) => {
    const { text, target_lang = 'FR' } = req.body;
    if (!text || !DEEPL_API_KEY) {
        return res.status(400).json({ error: 'Texte ou clé API manquante.' });
    }

    // Première requête pour détecter la langue
    try {
        const detectResponse = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(text)}&target_lang=EN`
        });
        const detectData = await detectResponse.json();
        const sourceLanguage = detectData.translations[0].detected_source_language;

        // Si la langue source est la même que la langue cible, pas besoin de traduire
        if (sourceLanguage === target_lang) {
            return res.json({
                translation: text,
                source_lang: sourceLanguage,
                message: 'Texte déjà dans la langue cible'
            });
        }

        // Deuxième requête pour la traduction réelle
        const response = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(text)}&target_lang=${target_lang}`
        });
        const data = await response.json();
        if (data.translations && data.translations[0]) {
            res.json({ translation: data.translations[0].text, source_lang: data.translations[0].detected_source_language });
        } else {
            res.status(500).json({ error: 'Erreur DeepL', details: data });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API de traduction démarrée sur le port ${PORT}`);
});
