
# Content Reliability Assessment Browser Extension 

## 📖 Overview

This project is a browser extension designed to help users systematically assess the reliability of online content. It automates a **Multi-Layered Framework** that evaluates content based on provenance, argumentation, and forensic integrity.

**Current Status:** The **Proof of Concept (POC)** is complete. The system currently performs robust **text-only analysis**, utilizing **Large Language Models (LLMs)** to classify content (Factual, Opinion, Fiction) and assess its logical coherence and rhetorical style.

## 🎯 Core Features (POC Complete)

The following features have been implemented and validated:

*   **LLM-Driven Analysis**: A functioning analytical engine powered by Gemini (Cloud) or Mistral (Local/Ollama).
*   **Content Classifier**: Successfully categorizes text into Factual, Opinion, or Fiction.
*   **Scoring Engine**: Applies specific reliability criteria from our rubrics to generate a quantitative score.
*   **User Interface**: A fully integrated browser extension popup that displays color-coded reliability ratings (Blue/Green/Purple) and detailed breakdowns.

## ⚙️ Tech Stack & Configuration

The extension supports a dual-mode backend for flexibility and privacy:

| Mode | Engine | Requirement | Use Case |
| :---: | :---: | :---: | :---: |
| **Cloud** | **Google Gemini** | User API Key | High performance, requires internet connection. |
| **Local** | **Mistral** | [Ollama](https://ollama.com/) | Privacy-focused, offline capability, runs locally. |

## 🚀 Getting Started

### Installation

1. **Build the extension:**
   ```bash
   npm install
   npm run build:chrome    # For Chrome/Edge
   npm run build:firefox   # For Firefox
   ```

2. **Load in your browser:**
   - **Chrome/Edge:** Load `dist-chrome` folder as an unpacked extension (Developer mode)
   - **Firefox:** Load `dist-firefox` folder as a temporary add-on

3. **Configure your AI model:**
   - Click the extension icon and open Settings
   - Choose between Cloud (Gemini) or Local (Mistral/Ollama)

### Option 1: Cloud Mode with Gemini (Easiest)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter your API key in the extension settings
3. Select "Gemini" as your model
4. Start analyzing pages

### Option 2: Local Mode with Ollama (Privacy-Focused)

Run AI models completely locally without sending any data to external servers.

**Quick Setup (Windows):**
```bash
# Install Ollama
winget install Ollama.Ollama

# Pull the Mistral model
ollama pull mistral

# Configure CORS (PowerShell as Administrator)
[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'Machine')
```

Then restart Ollama and select "Mistral (Local - Ollama)" in extension settings.

**📖 Full Setup Guide:** See [docs/OLLAMA_SETUP_WINDOWS.md](docs/OLLAMA_SETUP_WINDOWS.md) for complete instructions, troubleshooting, and alternative models.

**Benefits of local models:**
- ✅ Complete privacy - data never leaves your computer
- ✅ No API key required
- ✅ Works offline after initial download
- ✅ No usage limits or costs

## 📚 Documentation & Frameworks

This tool is built upon rigorous information literacy frameworks. We highly recommend contributors read the core documentation located in the docs/ directory:

| Document | Description |
| :---: | :---: |
| **The Core Framework** | The theoretical basis for the entire project, covering provenance and forensics. |
| **Factual Rubric** | Scoring criteria for evidentiary integrity and citation quality. |
| **Opinion Rubric** | Criteria for assessing logic, rhetorical style, and transparency. |
| **Fiction Rubric** | Guidelines for transparency in satire and creative writing. |
| **[Ollama Setup Guide](docs/OLLAMA_SETUP_WINDOWS.md)** | Complete guide for setting up local Mistral model on Windows. |
| **[Privacy Policy](docs/privacy_policy.md)** | How we handle your data, third-party services, and your privacy rights. |

## 🗺️ Roadmap: Towards the Full Framework

With the text-only POC complete, development now shifts to the full implementation of the *Multi-Layered Framework* (specifically Part I and Part III). The goal is to evolve the system from a single analyzer into a **Multi-Agent Orchestrator**.

### ✅ Completed: Phase 1 (POC)

*   [x] Internal text analysis (Logic, Rhetoric, Cognitive Style).
*   [x] Content Classification (Factual/Opinion/Fiction).
*   [x] Basic UI and LLM integration.

### 🚧 Current Focus: Phase 2 - Provenance & Lateral Reading

*Implementing Part I of the Framework: "Foundational Frameworks for Source and Provenance Evaluation"*

*   [ ] **Lateral Reading Agent**: Automate the "SIFT" method (Stop, Investigate, Find, Trace).
*   [ ] **Authority Verification**: Integrate APIs (e.g., Google Scholar, Media Bias Fact Check) to verify author credentials and publisher reputation.
*   [ ] **Citation Analysis**: Automated checking of links and references to detect "reference rot" or misrepresentation.

### 🔮 Future: Phase 3 - Multimedia Forensics

*Implementing Part III of the Framework: "Advanced Multimedia and Synthetic Content Forensics"*

*   [ ] **Metadata Analysis**: Extraction of EXIF and other file headers.
*   [ ] **Synthetic Media Detection**: Integration of deepfake detection models for images and video.
*   [ ] **C2PA Verification**: Implementation of a scanner for Content Credentials and digital watermarks.

### 🧩 Final Stage: Phase 4 - The Orchestrator

*Implementing Section 4.2: "Operationalizing the Framework"*

*   [ ] **Decomposition Engine**: Breaking down a URL/Page into text, image, and metadata components.
*   [ ] **Agent Synthesis**: Merging outputs from Provenance, Argumentation (Text), and Forensic agents into a single, cohesive reliability report.

## 🤝 Contributing

We are looking for contributors to help us tackle the new roadmap phases:

1.  **Full-Stack Developers**: To build the "Lateral Reading" agent that can perform live web searches and scrape results.
2.  **AI/ML Engineers**: To assist with integrating computer vision models for Phase 3 (Multimedia Forensics).
3.  **Prompt Engineers**: To refine the "Argumentation Agent" and ensure it works in harmony with the new agents.

### How to Collaborate

1.  Read the **Multi-Layered Framework V3** to understand the full vision.
2.  Fork the repository.
3.  Create a feature branch (`git checkout -b feature/LateralReading`).
4.  Commit your changes.
5.  Open a Pull Request.

## ⚖️ License
![AGLP v3 license logo](https://www.gnu.org/graphics/agplv3-155x51.png)
Distributed under the GNU Affero General Public License v3.0 (AGPL v3). See [LICENSE](https://www.gnu.org/licenses/agpl-3.0.en.html) for more information.

```
