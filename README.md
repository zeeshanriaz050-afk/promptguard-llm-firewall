# 🛡️ PromptGuard LLM Firewall

> Automated LLM Red-Teaming & Prompt Security Testing Sandbox

PromptGuard is a developer security tool designed to simulate prompt injection and jailbreak attacks against AI system prompts, produce OWASP LLM Top 10-compliant vulnerability audits, and generate hardened, production-ready system prompts.

---

## ✨ Features

- **🎯 Automated Red-Teaming:** Simulates direct, indirect, and multi-turn prompt injection and jailbreak techniques.
- **🛡️ Hardened Prompt Generation:** Automatically remaps and hardens vulnerable system instructions to resist adversarial exploits.
- **📋 OWASP LLM Top 10 Audits:** Maps vulnerabilities against recognized LLM security standards (LLM01: Prompt Injection, LLM02: Sensitive Information Disclosure, etc.).
- **⚡ Developer Sandbox:** Real-time feedback loop built for fast iteration using TypeScript, Node.js, Vite, and Gemini API.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Gemini API Key** (or compatible LLM provider credentials)

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/zeeshanriaz050-afk/promptguard-llm-firewall.git](https://github.com/zeeshanriaz050-afk/promptguard-llm-firewall.git)
cd promptguard-llm-firewall

# Install dependencies
npm install
3. Environment Configuration
Copy the example environment file and set up your API key:

Bash
cp .env.example .env
Edit .env:

Code snippet
GEMINI_API_KEY=your_api_key_here
PORT=3000
4. Running the Application
Bash
# Start backend server and Vite frontend concurrently
npm run dev
📁 Repository Structure
Plaintext
.
├── src/             # Frontend application components & logic
├── server.ts        # Express backend server for firewall analysis & API proxying
├── index.html       # Vite HTML entry point
├── tsconfig.json    # TypeScript compiler configuration
└── vite.config.ts   # Vite bundler configuration
