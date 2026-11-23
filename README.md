# 📖 Tiny Tales

> **“A little prompt. A lovely little story.”**

Tiny Tales is a welcoming, beginner-friendly web application that helps people create charming, original short stories they can read in about one minute (approximately 120–180 words).

Whether you want a cozy fantasy about a shy button-collecting dragon, an exciting sci-fi escape across nebula clouds, or a soothing bedtime whisper, Tiny Tales brings your ideas to life with gentle storybook warmth.

---

## ✨ Features

- **Intuitive Creation Studio:**
  - Freeform prompt input with character counter and quick inspiration sparks.
  - **6 Distinct Genres:** 🪄 Fantasy, 🔍 Mystery, 🧭 Adventure, 🎭 Comedy, 🚀 Sci-Fi, and 🌙 Bedtime.
  - **5 Evocative Moods:** ☕ Cozy, 🎈 Funny, ⚡ Exciting, 🕯️ Spooky, and 🌻 Hopeful.
  - Helpful input validation preventing accidental empty submissions.
- **Comfortable Reading Experience:**
  - Story card with warm ivory surface, bookmark ribbon, estimated read time (~1 min), and word counter.
  - Beautiful storybook typography with elegant drop caps and clear contrast.
  - **Copy Story** button with animated clipboard feedback.
  - **Try Another Version** button to re-roll a new narrative angle from the same prompt.
  - **Read Aloud** feature utilizing browser speech synthesis for hands-free listening.
- **Warm & Responsive Visual Design:**
  - Soft cream/ivory background (`#FAF7F2`) with deep navy/plum text (`#1F1938`) for effortless readability.
  - Coral/warm orange primary buttons (`#FF6B52`) and pastel accents (lavender, peach, sky blue).
  - Fully responsive layout: side-by-side desktop studio and touch-friendly vertical stack on mobile.
- **Reliable Server Architecture:**
  - Built with native Node.js (zero external dependencies required!).
  - Secure server-side API key handling (keys are never exposed to the client).
  - **Dual Operation Modes:**
    - **Offline Demo Mode:** Works out of the box with zero configuration! Delivers high-quality context-aware stories across all genres and moods.
    - **Live AI Mode:** Provide a `GEMINI_API_KEY` (or `OPENAI_API_KEY`) in your `.env` to generate limitless live AI stories.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) version 18 or higher (Node 20+ recommended).

### Running the App

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:/Users/ASUS/OneDrive/Desktop/GenAI
   ```

2. **(Optional) Configure AI Keys:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Google Gemini or OpenAI key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > *Note: If you leave `GEMINI_API_KEY` blank, Tiny Tales will run automatically in its rich, built-in **Demo Mode**.*

3. **Start the server:**
   ```bash
   node server.js
   ```
   or
   ```bash
   npm start
   ```

4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
GenAI/
├── public/
│   ├── index.html       # Semantic HTML5 app markup with accessibility attributes
│   ├── styles.css       # Warm storybook theme, fluid layout, responsive media queries
│   └── app.js           # Client interactions, state management, copy, narration
├── server.js            # Native Node.js HTTP server, API endpoints, AI & demo engine
├── .env.example         # Template for environment variables
├── .env                 # Local environment settings (kept secret)
├── package.json         # Project metadata and run scripts
└── README.md            # App documentation and quick start guide
```

---

## 🔒 Security & Privacy

- All API keys reside strictly on the backend inside environment variables and are never bundled or transmitted to the client.
- Content generation instructions instruct the models to produce safe, family-friendly stories suitable for all ages.
