const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load .env manually (no dotenv dependency)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

app.use(express.json());
app.use(express.static(__dirname));

// ─── AI SUMMARIZER ENDPOINT ──────────────────────────────────
const SUMMARIZE_MODELS = ['deepseek/deepseek-v4-flash:free', 'deepseek/deepseek-v4-flash'];
const SUMMARIZE_RETRIES = 2;

async function callOpenRouter(apiKey, model, articleText) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://themetallicstandard.com',
      'X-Title': 'The Metallic Standard'
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.3,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are a professional news editor. Summarize the provided news article text into exactly 3 punchy, engaging, and objective bullet points.'
        },
        {
          role: 'user',
          content: `Summarize this article into exactly 3 bullet points:\n\n${articleText}`
        }
      ]
    })
  });
  return response;
}

app.post('/api/summarize', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { articleText } = req.body;

  if (!articleText || typeof articleText !== 'string' || articleText.trim().length < 50) {
    return res.status(400).json({ error: 'Please provide valid article text to summarize.' });
  }

  for (const model of SUMMARIZE_MODELS) {
    for (let attempt = 0; attempt <= SUMMARIZE_RETRIES; attempt++) {
      try {
        const response = await callOpenRouter(apiKey, model, articleText);

        if (response.status === 429) {
          const delay = (attempt + 1) * 2000;
          console.warn(`Rate limited on ${model}, retry ${attempt + 1}/${SUMMARIZE_RETRIES} in ${delay}ms`);
          if (attempt < SUMMARIZE_RETRIES) {
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          break;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('OpenRouter API error:', response.status, errorData);
          if (attempt < SUMMARIZE_RETRIES) {
            await new Promise(r => setTimeout(r, (attempt + 1) * 1500));
            continue;
          }
          break;
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
          return res.json({ summary: data.choices[0].message.content.trim() });
        } else {
          console.error('Unexpected API response:', data);
          break;
        }
      } catch (err) {
        console.error('Summarize endpoint error:', err);
        if (attempt < SUMMARIZE_RETRIES) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 1500));
          continue;
        }
      }
    }
  }

  res.status(503).json({ error: 'AI service is temporarily busy. Please try again in a moment.' });
});

// ─── CATCH-ALL: SERVE INDEX FOR HTML ROUTES ─────────────────
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Export for Vercel serverless
module.exports = app;

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`The Metallic Standard running at http://localhost:${PORT}`);
  });
}
