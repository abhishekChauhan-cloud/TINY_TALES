// Tiny Tales — Frontend Client Application
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const promptInput = document.getElementById('promptInput');
  const charCount = document.getElementById('charCount');
  const promptError = document.getElementById('promptError');
  const genreCards = document.querySelectorAll('.option-card');
  const moodPills = document.querySelectorAll('.mood-pill');
  const generateBtn = document.getElementById('generateBtn');
  const chipButtons = document.querySelectorAll('.chip-btn');
  const modeBadge = document.getElementById('modeBadge');
  const modeText = document.getElementById('modeText');

  // Display State Containers
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const errorMessage = document.getElementById('errorMessage');
  const retryBtn = document.getElementById('retryBtn');
  const storyCard = document.getElementById('storyCard');

  // Story Elements
  const genreBadge = document.getElementById('genreBadge');
  const moodBadge = document.getElementById('moodBadge');
  const wordCountBadge = document.getElementById('wordCountBadge');
  const storyTitle = document.getElementById('storyTitle');
  const storyBody = document.getElementById('storyBody');
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyToast = document.getElementById('copyToast');
  const remixBtn = document.getElementById('remixBtn');
  const readAloudBtn = document.getElementById('readAloudBtn');
  const readAloudText = document.getElementById('readAloudText');
  const loadingPhrase = document.getElementById('loadingPhrase');

  // App State
  let currentGenre = 'Fantasy';
  let currentMood = 'Cozy';
  let variationSeed = 0;
  let isGenerating = false;
  let lastStoryData = null;
  let isSpeaking = false;
  let loadingInterval = null;

  const loadingPhrases = [
    'Weaving your tale...',
    'Sprinkling stardust on the pages...',
    'Brewing a pot of imagination...',
    'Inviting the characters in...',
    'Binding the tiny chapters...',
    'Adding the final golden touches...'
  ];

  // Icons Mapping
  const genreIcons = {
    Fantasy: '🪄',
    Mystery: '🔍',
    Adventure: '🧭',
    Comedy: '🎭',
    'Sci-Fi': '🚀',
    Bedtime: '🌙'
  };

  const moodIcons = {
    Cozy: '☕',
    Funny: '🎈',
    Exciting: '⚡',
    Spooky: '🕯️',
    Hopeful: '🌻'
  };

  // 1. Initial Backend Status Check
  async function checkServerStatus() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        if (data.demoMode) {
          modeBadge.className = 'mode-badge demo';
          modeText.textContent = '✨ Demo Mode (Instant & Offline)';
          modeBadge.title = 'Running in Demo Mode with rich built-in stories. Add GEMINI_API_KEY to .env for live AI!';
        } else {
          modeBadge.className = 'mode-badge ai';
          modeText.textContent = `🤖 ${data.provider.toUpperCase()} AI Connected`;
          modeBadge.title = `Generating stories live using ${data.provider.toUpperCase()}`;
        }
      }
    } catch (err) {
      console.warn('Could not connect to API status endpoint:', err);
      modeBadge.className = 'mode-badge demo';
      modeText.textContent = '✨ Demo Mode (Ready)';
    }
  }
  checkServerStatus();

  // 2. Character Counter & Input Event
  promptInput.addEventListener('input', () => {
    const len = promptInput.value.length;
    charCount.textContent = `${len}/300`;
    if (len > 0) {
      hidePromptError();
    }
  });

  // Ctrl/Cmd + Enter to trigger generation
  promptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  });

  // 3. Quick Spark Inspiration Chips
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      promptInput.value = prompt;
      charCount.textContent = `${prompt.length}/300`;
      hidePromptError();
      promptInput.focus();
      // Brief button tap animation
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });

  // 4. Genre Selection
  genreCards.forEach(card => {
    card.addEventListener('click', () => {
      genreCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');
      currentGenre = card.getAttribute('data-genre');
    });
  });

  // 5. Mood Selection
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      moodPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      currentMood = pill.getAttribute('data-mood');
    });
  });

  // Validation Helpers
  function showPromptError(message) {
    promptInput.classList.add('has-error');
    if (message) {
      promptError.querySelector('span').textContent = message;
    }
    promptError.style.display = 'flex';
    promptInput.focus();
  }

  function hidePromptError() {
    promptInput.classList.remove('has-error');
    promptError.style.display = 'none';
  }

  // 6. View States Switcher
  function setViewState(state) {
    emptyState.style.display = state === 'empty' ? 'flex' : 'none';
    loadingState.style.display = state === 'loading' ? 'flex' : 'none';
    errorState.style.display = state === 'error' ? 'flex' : 'none';
    storyCard.style.display = state === 'story' ? 'flex' : 'none';

    if (state === 'loading') {
      let phraseIdx = 0;
      loadingPhrase.textContent = loadingPhrases[0];
      clearInterval(loadingInterval);
      loadingInterval = setInterval(() => {
        phraseIdx = (phraseIdx + 1) % loadingPhrases.length;
        loadingPhrase.textContent = loadingPhrases[phraseIdx];
      }, 1600);
    } else {
      clearInterval(loadingInterval);
    }
  }

  // 7. Generate Story Action
  async function handleGenerate(isRemix = false) {
    if (isGenerating) return;

    const rawPrompt = promptInput.value.trim();
    if (!rawPrompt) {
      showPromptError('Please describe an idea, character, or object first!');
      return;
    }

    if (isRemix) {
      variationSeed += 1;
    } else {
      variationSeed = 0;
    }

    // Stop ongoing narration if any
    stopSpeech();

    isGenerating = true;
    generateBtn.disabled = true;
    remixBtn.disabled = true;
    setViewState('loading');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawPrompt,
          genre: currentGenre,
          mood: currentMood,
          variation: variationSeed
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to craft story. Please try again.');
      }

      displayStory(data);
    } catch (err) {
      console.error('Generation error:', err);
      errorMessage.textContent = err.message || 'Something unexpected happened. Please check your connection and try again.';
      setViewState('error');
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
      remixBtn.disabled = false;
    }
  }

  // 8. Render Generated Story
  function displayStory(data) {
    lastStoryData = data;

    // Badges
    const gIcon = genreIcons[data.genre] || '🪄';
    const mIcon = moodIcons[data.mood] || '☕';
    genreBadge.textContent = `${gIcon} ${data.genre}`;
    moodBadge.textContent = `${mIcon} ${data.mood}`;
    wordCountBadge.textContent = `${data.wordCount} words`;

    // Title
    storyTitle.textContent = data.title || 'A Lovely Little Story';

    // Body
    storyBody.innerHTML = '';
    const paragraphs = data.paragraphs && data.paragraphs.length > 0 
      ? data.paragraphs 
      : data.story.split(/\r?\n\r?\n/).filter(p => p.trim().length > 0);

    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.textContent = pText.trim();
      storyBody.appendChild(p);
    });

    setViewState('story');

    // Scroll slightly into view on mobile
    if (window.innerWidth <= 768) {
      storyCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 9. Copy Story to Clipboard
  copyBtn.addEventListener('click', async () => {
    if (!lastStoryData) return;

    const formattedText = `✨ ${lastStoryData.title} ✨\nGenre: ${lastStoryData.genre} | Mood: ${lastStoryData.mood}\n\n${lastStoryData.story}\n\n— Created with Tiny Tales`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formattedText);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = formattedText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback
      copyBtn.classList.add('copied');
      copyBtnText.textContent = 'Copied!';
      showToast('✨ Story copied to clipboard!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtnText.textContent = 'Copy story';
      }, 2500);
    } catch (err) {
      console.error('Failed to copy story:', err);
      showToast('⚠️ Could not copy automatically.');
    }
  });

  function showToast(msg) {
    copyToast.textContent = msg;
    copyToast.classList.add('show');
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 2800);
  }

  // 10. Remix / Try Another Version
  remixBtn.addEventListener('click', () => {
    handleGenerate(true);
  });

  // 11. Retry Button (on Error)
  retryBtn.addEventListener('click', () => {
    handleGenerate(false);
  });

  // 12. Primary Button Trigger
  generateBtn.addEventListener('click', () => {
    handleGenerate(false);
  });

  // 13. Bonus: Read Aloud (Web Speech API)
  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    readAloudBtn.classList.remove('playing');
    readAloudText.textContent = 'Listen';
  }

  readAloudBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech narration is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!lastStoryData) return;

    const fullNarration = `${lastStoryData.title}. ${lastStoryData.story}`;
    const utterance = new SpeechSynthesisUtterance(fullNarration);
    utterance.rate = 0.92; // Gentle, cozy reading pace
    utterance.pitch = 1.0;

    // Pick a pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const pleasantVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Alex')));
    if (pleasantVoice) {
      utterance.voice = pleasantVoice;
    }

    utterance.onend = () => {
      stopSpeech();
    };

    utterance.onerror = () => {
      stopSpeech();
    };

    isSpeaking = true;
    readAloudBtn.classList.add('playing');
    readAloudText.textContent = 'Pause';
    window.speechSynthesis.speak(utterance);
  });
});
