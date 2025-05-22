// server.mjs

import 'dotenv/config'; // Load environment variables from .env

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // For Node.js >= v18, you can use global fetch instead

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Environment Variables
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

if (!GITHUB_API_KEY) {
  console.warn('⚠️  GITHUB_API_KEY is missing in your .env file!');
}

// Route: POST /api/github-model
app.post('/api/github-model', async (req, res) => {
  const { prompt } = req.body;

  // Basic validation
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a non-empty string.' });
  }

  try {
    const response = await fetch('https://models.github.ai/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || 'GitHub AI API Error',
        details: data,
      });
    }

    // Handle different potential response formats
    const output = Array.isArray(data)
      ? data[0]?.generated_text || ''
      : data.generated_text || data.text || '';

    return res.status(200).json({ response: output });

  } catch (error) {
    console.error('🔥 Error fetching from GitHub AI:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
