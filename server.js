// Tiny Tales — Server
// Built with native Node.js (Zero external dependencies needed!)
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { generateDemoStory, countWords } = require('./story_engine');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const eqIdx = trimmed.indexOf('=');
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (err) {
      console.warn('Could not read .env file:', err.message);
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types dictionary for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// -----------------------------------------------------------------------------
// Live AI Generation (Google Gemini or OpenAI API)
// -----------------------------------------------------------------------------
async function generateAiStory(prompt, genre, mood, variation = 0) {
  // If GEMINI_API_KEY is present
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    const apiKey = process.env.GEMINI_API_KEY.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are the master storyteller for "Tiny Tales", a warm, beginner-friendly web app.
Your task is to write a delightful, original, self-contained short story that can be read in about one minute (strictly between 120 and 180 words).

Guidelines:
- Appropriate and safe for a general audience (all ages).
- Do not copy existing copyrighted characters or famous books.
- Blend the user's prompt, chosen genre (${genre}), and chosen mood (${mood}) seamlessly.
- Variation index: ${variation} (offer a fresh creative angle if this is a remix).
- Format your response strictly as valid JSON with two fields: "title" and "story".
- The "story" should have 2 or 3 cozy paragraphs separated by double newlines (\\n\\n).`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUser prompt: "${prompt}"\nGenre: ${genre}\nMood: ${mood}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 600,
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error("Empty response from Gemini AI.");

    let parsed;
    try {
      parsed = JSON.parse(candidate);
    } catch {
      parsed = {
        title: `${genre} Tale: ${prompt.slice(0, 24)}...`,
        story: candidate.trim()
      };
    }

    const wordCount = countWords(parsed.story);
    const paragraphs = parsed.story.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);

    return {
      title: parsed.title || "A Lovely Little Story",
      story: parsed.story,
      paragraphs,
      wordCount,
      readingTimeMinutes: 1,
      genre,
      mood,
      mode: 'live-gemini'
    };
  }

  // If OPENAI_API_KEY is present
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
    const apiKey = process.env.OPENAI_API_KEY.trim();
    const url = 'https://api.openai.com/v1/chat/completions';

    const systemPrompt = `You are the master storyteller for "Tiny Tales". Write an original, heartwarming short story of exactly 120-180 words suitable for reading in one minute.
Return ONLY valid JSON with keys "title" and "story". The story should have 2 to 3 paragraphs separated by \\n\\n.
Genre: ${genre}, Mood: ${mood}. Safe for all ages.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Story prompt: ${prompt}` }
        ],
        temperature: 0.85
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    const wordCount = countWords(parsed.story);
    const paragraphs = parsed.story.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);

    return {
      title: parsed.title || "A Lovely Little Story",
      story: parsed.story,
      paragraphs,
      wordCount,
      readingTimeMinutes: 1,
      genre,
      mood,
      mode: 'live-openai'
    };
  }

  // If no live key is configured, fallback to Demo Engine
  return generateDemoStory(prompt, genre, mood, variation);
}

// -----------------------------------------------------------------------------
// HTTP Server & Routing
// -----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API Status Endpoint
  if (req.method === 'GET' && pathname === '/api/status') {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
    const activeProvider = hasGemini ? 'gemini' : (hasOpenAI ? 'openai' : 'demo');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      demoMode: !hasGemini && !hasOpenAI,
      provider: activeProvider,
      message: activeProvider === 'demo' 
        ? 'Tiny Tales is running in offline Demo Mode (Instant, crafted stories).'
        : `Connected to ${activeProvider.toUpperCase()} for live AI generation.`
    }));
    return;
  }

  // 2. API Story Generation Endpoint
  if (req.method === 'POST' && pathname === '/api/generate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Guard against payloads > 100KB
      if (body.length > 100000) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        let payload = {};
        if (body.trim()) {
          try {
            payload = JSON.parse(body);
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Malformed JSON payload in request." }));
            return;
          }
        }

        const prompt = payload.prompt;
        const genre = payload.genre || 'Fantasy';
        const mood = payload.mood || 'Cozy';
        const variation = payload.variation || 0;

        // Validation: Empty prompt check
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: "Please enter an idea, character, place, or object first! Tiny Tales needs a spark of imagination to craft your story."
          }));
          return;
        }

        let result;
        const hasKey = Boolean((process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) || 
                               (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()));

        if (payload.forceDemo || !hasKey) {
          result = generateDemoStory(prompt, genre, mood, variation);
        } else {
          try {
            result = await generateAiStory(prompt, genre, mood, variation);
          } catch (aiErr) {
            console.error("AI service error, falling back to Demo Mode:", aiErr.message);
            result = generateDemoStory(prompt, genre, mood, variation);
            result.warning = `AI generation was temporarily unavailable (${aiErr.message}). Served via Tiny Tales Demo Mode.`;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("Internal generation error:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: "An unexpected error occurred while weaving your story. Please try again in a moment."
        }));
      }
    });
    return;
  }

  // 3. Static File Serving (from public/)
  if (req.method === 'GET') {
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // Guard against directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (readErr, content) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
          }
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  📖 Tiny Tales Web App is running!`);
  console.log(`  🔗 Local URL: http://localhost:${PORT}`);
  console.log(`  Mode: ${process.env.GEMINI_API_KEY ? 'Google Gemini AI' : (process.env.OPENAI_API_KEY ? 'OpenAI AI' : 'Offline Demo Engine (Instant)')}`);
  console.log(`======================================================\n`);
});

module.exports = server;
