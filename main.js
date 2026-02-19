// ===== DOM Elements =====
const apiModal = document.getElementById('apiModal');
const geminiKeyInput = document.getElementById('geminiKeyInput');
const openrouterKeyInput = document.getElementById('openrouterKeyInput');
const modelSelect = document.getElementById('modelSelect');
const customModelInput = document.getElementById('customModelInput');
const providerToggle = document.getElementById('providerToggle');
const geminiConfig = document.getElementById('geminiConfig');
const openrouterConfig = document.getElementById('openrouterConfig');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const settingsBtn = document.getElementById('settingsBtn');
const techInput = document.getElementById('techInput');
const charCount = document.getElementById('charCount');
const tonePills = document.getElementById('tonePills');
const translateBtn = document.getElementById('translateBtn');
const outputCard = document.getElementById('outputCard');
const outputText = document.getElementById('outputText');
const skeletonCard = document.getElementById('skeletonCard');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');

// ===== State =====
let selectedTone = 'simple';
let isTranslating = false;

// ===== Tone Prompts =====
const TONE_PROMPTS = {
  simple: `You are a translator that converts technical developer jargon into extremely simple, plain language that anyone can understand — like explaining to someone with zero tech knowledge.

Rules:
- Use short sentences. Avoid any technical words.
- Use everyday analogies (moving boxes, organizing a closet, etc.)
- Maximum 2-3 sentences.
- Do NOT use bullet points or headers.
- Do NOT mention any technical terms — rephrase everything.
- Start directly with the explanation, no preamble.`,

  executive: `You are a translator that converts technical developer tasks into concise executive-level summaries focused on business value and outcomes.

Rules:
- Focus on WHY this matters: cost savings, speed, reliability, user experience.
- Use professional but non-technical language.
- Maximum 2-3 sentences.
- Do NOT use bullet points or headers.
- Do NOT use developer jargon — translate to business impact.
- Start directly with the explanation, no preamble.`,

  friendly: `You are a translator that converts technical developer jargon into warm, friendly, conversational language — like a helpful colleague explaining over coffee.

Rules:
- Be approachable and reassuring. Light, casual tone.
- Use "we" and "your" to make it personal.
- Maximum 2-3 sentences.
- Do NOT use bullet points or headers.
- Do NOT use technical terms — rephrase everything simply.
- Start directly with the explanation, no preamble.`
};

// ===== Config Management =====
function getConfig() {
  try {
    return JSON.parse(localStorage.getItem('eitmc_config') || '{}');
  } catch {
    return {};
  }
}

function setConfig(updates) {
  const config = { ...getConfig(), ...updates };
  localStorage.setItem('eitmc_config', JSON.stringify(config));
  return config;
}

function getProvider() {
  return getConfig().provider || 'gemini';
}

function getApiKey() {
  const config = getConfig();
  if (config.provider === 'openrouter') return config.openrouter_key || '';
  return config.gemini_key || '';
}

function getModel() {
  return getConfig().openrouter_model || 'google/gemini-2.0-flash-exp:free';
}

function hasValidConfig() {
  return !!getApiKey();
}

// ===== Modal =====
function showModal() {
  const config = getConfig();
  const provider = config.provider || 'gemini';

  // Set provider toggle
  providerToggle.querySelectorAll('.provider-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === provider);
  });

  // Show correct config panel
  geminiConfig.style.display = provider === 'gemini' ? '' : 'none';
  openrouterConfig.style.display = provider === 'openrouter' ? '' : 'none';

  // Fill inputs
  geminiKeyInput.value = config.gemini_key || '';
  openrouterKeyInput.value = config.openrouter_key || '';

  // Restore model selection — check if saved model is a preset or custom
  const savedModel = config.openrouter_model || 'google/gemini-2.0-flash-exp:free';
  const isPreset = [...modelSelect.options].some(o => o.value === savedModel && o.value !== '__custom__');
  if (isPreset) {
    modelSelect.value = savedModel;
    customModelInput.style.display = 'none';
    customModelInput.value = '';
  } else {
    modelSelect.value = '__custom__';
    customModelInput.style.display = '';
    customModelInput.value = savedModel;
  }

  apiModal.classList.remove('hidden');

  setTimeout(() => {
    (provider === 'gemini' ? geminiKeyInput : openrouterKeyInput).focus();
  }, 100);
}

function hideModal() {
  apiModal.classList.add('hidden');
}

// Provider toggle in modal
providerToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.provider-btn');
  if (!btn) return;

  const provider = btn.dataset.provider;
  providerToggle.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  geminiConfig.style.display = provider === 'gemini' ? '' : 'none';
  openrouterConfig.style.display = provider === 'openrouter' ? '' : 'none';

  setTimeout(() => {
    (provider === 'gemini' ? geminiKeyInput : openrouterKeyInput).focus();
  }, 50);
});

// Toggle custom model input visibility
modelSelect.addEventListener('change', () => {
  customModelInput.style.display = modelSelect.value === '__custom__' ? '' : 'none';
  if (modelSelect.value === '__custom__') {
    setTimeout(() => customModelInput.focus(), 50);
  }
});

// ===== Toast =====
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== API Calls =====

async function callGemini(input, tone, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: TONE_PROMPTS[tone] }]
      },
      contents: [{
        parts: [{ text: `Translate this technical task into plain language:\n\n"${input}"` }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 400 || response.status === 403) {
      throw new Error('Invalid Gemini API key. Check your key in ⚙️ settings.');
    }
    throw new Error(err?.error?.message || `Gemini API error (${response.status})`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');
  return text.trim();
}

async function callOpenRouter(input, tone, apiKey, model) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Explain It To My Client',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: TONE_PROMPTS[tone] },
        { role: 'user', content: `Translate this technical task into plain language:\n\n"${input}"` }
      ],
      temperature: 0.7,
      max_tokens: 256,
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid OpenRouter API key. Check your key in ⚙️ settings.');
    }
    throw new Error(err?.error?.message || `OpenRouter error (${response.status})`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from OpenRouter');
  return text.trim();
}

async function translateText(input, tone) {
  const apiKey = getApiKey();
  if (!apiKey) {
    showModal();
    throw new Error('No API key configured');
  }

  const provider = getProvider();

  if (provider === 'openrouter') {
    return callOpenRouter(input, tone, apiKey, getModel());
  } else {
    return callGemini(input, tone, apiKey);
  }
}

// ===== Shareable Link =====
function encodeShareData(input, output, tone) {
  const data = JSON.stringify({ i: input, o: output, t: tone });
  return btoa(unescape(encodeURIComponent(data)));
}

function decodeShareData(hash) {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const data = decodeShareData(hash);
  if (!data) return;

  techInput.value = data.i || '';
  charCount.textContent = `${techInput.value.length} / 2000`;

  if (data.t && TONE_PROMPTS[data.t]) {
    selectedTone = data.t;
    document.querySelectorAll('.tone-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.tone === selectedTone);
    });
  }

  if (data.o) {
    outputText.textContent = data.o;
    outputCard.style.display = '';
    skeletonCard.style.display = 'none';
  }
}

// ===== UI Event Handlers =====

// Char count
techInput.addEventListener('input', () => {
  charCount.textContent = `${techInput.value.length} / 2000`;
});

// Tone selector
tonePills.addEventListener('click', (e) => {
  const pill = e.target.closest('.tone-pill');
  if (!pill) return;
  selectedTone = pill.dataset.tone;
  document.querySelectorAll('.tone-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});

// Translate
translateBtn.addEventListener('click', async () => {
  const input = techInput.value.trim();
  if (!input) {
    showToast('✏️  Paste a technical task first');
    techInput.focus();
    return;
  }

  if (!hasValidConfig()) {
    showModal();
    return;
  }

  if (isTranslating) return;
  isTranslating = true;

  // Show loading state
  translateBtn.querySelector('.btn-label').textContent = 'Translating...';
  translateBtn.querySelector('.btn-arrow').style.display = 'none';
  translateBtn.querySelector('.spinner').style.display = '';
  translateBtn.disabled = true;
  outputCard.style.display = 'none';
  skeletonCard.style.display = '';

  try {
    const result = await translateText(input, selectedTone);
    outputText.textContent = result;
    outputCard.style.display = '';
    skeletonCard.style.display = 'none';

    // Update URL hash
    const hash = encodeShareData(input, result, selectedTone);
    history.replaceState(null, '', `#${hash}`);
  } catch (err) {
    skeletonCard.style.display = 'none';
    showToast(`❌  ${err.message}`);
  } finally {
    translateBtn.querySelector('.btn-label').textContent = 'Translate';
    translateBtn.querySelector('.btn-arrow').style.display = '';
    translateBtn.querySelector('.spinner').style.display = 'none';
    translateBtn.disabled = false;
    isTranslating = false;
  }
});

// Copy
copyBtn.addEventListener('click', () => {
  const text = outputText.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('📋  Copied to clipboard!'));
});

// Share
shareBtn.addEventListener('click', () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => showToast('🔗  Shareable link copied!'));
});

// Settings
settingsBtn.addEventListener('click', showModal);

// Save settings
saveKeyBtn.addEventListener('click', () => {
  const activeProvider = providerToggle.querySelector('.provider-btn.active').dataset.provider;

  if (activeProvider === 'gemini') {
    const key = geminiKeyInput.value.trim();
    if (!key) { showToast('⚠️  Please enter a Gemini API key'); return; }
    setConfig({ provider: 'gemini', gemini_key: key });
  } else {
    const key = openrouterKeyInput.value.trim();
    if (!key) { showToast('⚠️  Please enter an OpenRouter API key'); return; }
    const model = modelSelect.value === '__custom__'
      ? customModelInput.value.trim()
      : modelSelect.value;
    if (!model) { showToast('⚠️  Please enter a model ID'); return; }
    setConfig({ provider: 'openrouter', openrouter_key: key, openrouter_model: model });
  }

  hideModal();
  showToast('✅  Settings saved!');
});

// Close modal on overlay click
apiModal.addEventListener('click', (e) => {
  if (e.target === apiModal && hasValidConfig()) hideModal();
});

// Enter key in modal inputs
geminiKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveKeyBtn.click();
});
openrouterKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveKeyBtn.click();
});

// Ctrl+Enter to translate
techInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') translateBtn.click();
});

// ===== Migrate old config =====
function migrateOldConfig() {
  const oldKey = localStorage.getItem('gemini_api_key');
  if (oldKey) {
    setConfig({ provider: 'gemini', gemini_key: oldKey });
    localStorage.removeItem('gemini_api_key');
  }
}

// ===== Init =====
function init() {
  migrateOldConfig();

  if (!hasValidConfig()) {
    showModal();
  } else {
    hideModal();
  }
  loadFromHash();
}

init();
