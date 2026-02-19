<div align="center">

# 💬 Explain It To My Client

**Turn dev-speak into human-speak.**

A tiny web app that translates technical jargon into plain language your clients will actually understand.

[**Try it live →**](#getting-started) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

*"Migrating Supabase storage buckets and restructuring relational schema"*

⬇️

*"We are reorganizing how your data and images are stored so your website runs faster and is easier to manage."*

---

</div>

## 🤔 Why?

Every developer has been there — you finish a complex task and need to explain it to a non-technical client. You write something like *"Refactored the ORM layer and added database indexing"* and get back *"…what?"*

**Explain It To My Client** bridges that gap. Paste your technical description, pick a tone, and get a client-ready explanation in seconds — powered by AI.

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Translation** | Powered by Gemini or OpenRouter (200+ models including GPT-4o, Claude, Llama, etc.) |
| 🎛️ **3 Tone Modes** | **Simple** (anyone can understand), **Executive** (business value focus), **Friendly** (warm & conversational) |
| 📋 **One-Click Copy** | Copy the translated text straight to your clipboard |
| 🔗 **Shareable Links** | Generate a URL that restores the exact input, output, and tone — paste it in Slack or email |
| 🔒 **Privacy First** | API keys stored in your browser only — never sent to any server except the AI provider |
| ⌨️ **Keyboard Shortcut** | `Ctrl+Enter` to translate instantly |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- An API key from **one** of these providers:
  - 🟢 **Gemini** (free) — [Get key →](https://aistudio.google.com/apikey)
  - 🟠 **OpenRouter** (free & paid models) — [Get key →](https://openrouter.ai/keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/explain-it-to-my-client.git
cd explain-it-to-my-client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app opens at **http://localhost:3000**.

### First Run

1. You'll see the **Settings modal** on first launch
2. Choose your AI provider (Gemini or OpenRouter)
3. Paste your API key and hit **Save & Start**
4. Start translating! 🎉

## 📖 Usage

### Basic Flow

1. **Paste** your technical task description into the input box
2. **Select a tone:**
   - 🧒 **Simple** — Explains like you're talking to someone with zero tech knowledge
   - 💼 **Executive** — Focuses on business impact, costs, and outcomes
   - 😊 **Friendly** — Warm and conversational, like a colleague over coffee
3. **Click Translate** (or press `Ctrl+Enter`)
4. **Copy** the result or **Share** a link

### Using OpenRouter Models

OpenRouter gives you access to 200+ AI models. The app includes curated presets:

| Tier | Models |
|---|---|
| **Free** | Gemini 2.0 Flash, DeepSeek V3, Llama 4 Maverick, Qwen3 235B |
| **Budget** | Gemini 2.0 Flash, Claude 3.5 Haiku, GPT-4o Mini |
| **Premium** | GPT-4o, Claude Sonnet 4, Gemini 2.5 Pro |

**Want a different model?** Select *"✏️ Custom model…"* from the dropdown and type any [OpenRouter model ID](https://openrouter.ai/models), e.g.:
```
mistralai/mistral-large
cohere/command-r-plus
```

### Sharing Results

Click the **Share** button to copy a URL like:
```
https://yoursite.com/#eyJpIjoiTWlncmF0aW5nIFN1cGFi...
```
Anyone who opens that link will see the exact input, output, and tone — no API key needed to view.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Build** | [Vite](https://vitejs.dev/) |
| **Frontend** | Vanilla HTML, CSS, JavaScript (zero runtime dependencies) |
| **AI** | [Gemini API](https://ai.google.dev/) / [OpenRouter API](https://openrouter.ai/) |
| **Styling** | Custom CSS with glassmorphism, dark mode, Inter font |

## 📁 Project Structure

```
explain-it-to-my-client/
├── index.html          # Page structure (modal, input, output, skeleton)
├── style.css           # Design system (dark mode, glass cards, animations)
├── main.js             # App logic (API calls, tone prompts, share/copy)
├── vite.config.js      # Vite config (port 3000)
├── package.json        # Project metadata
└── public/
    └── favicon.svg     # Speech-bubble icon
```

## 🏗️ Building for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy it anywhere that serves static files — Vercel, Netlify, GitHub Pages, Cloudflare Pages, or just an S3 bucket.

### Deploy to Vercel (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/explain-it-to-my-client)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/explain-it-to-my-client)

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repo
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Add more AI providers (Anthropic direct, OpenAI direct, Ollama for local models)
- [ ] Translation history (stored in localStorage)
- [ ] Dark/light theme toggle
- [ ] Batch mode — translate multiple tasks at once
- [ ] Browser extension
- [ ] i18n — translate the UI itself into other languages

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — Free-tier AI API
- [OpenRouter](https://openrouter.ai/) — Universal AI gateway
- [Inter](https://rsms.me/inter/) — Beautiful open-source typeface
- [Vite](https://vitejs.dev/) — Lightning-fast build tooling

---

<div align="center">

**Built with ☕ by developers, for developers who talk to clients.**

⭐ Star this repo if it saved you from jargon fog!

</div>
