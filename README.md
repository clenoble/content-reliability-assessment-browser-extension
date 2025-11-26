
# Content Reliability Assessment Extension 

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

## 📚 Documentation & Frameworks

This tool is built upon rigorous information literacy frameworks. We highly recommend contributors read the core documentation located in the docs/ directory:

| Document | Description |
| :---: | :---: |
| **The Core Framework** | The theoretical basis for the entire project, covering provenance and forensics. |
| **Factual Rubric** | Scoring criteria for evidentiary integrity and citation quality. |
| **Opinion Rubric** | Criteria for assessing logic, rhetorical style, and transparency. |
| **Fiction Rubric** | Guidelines for transparency in satire and creative writing. |

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

Distributed under the GNU Affero General Public License v3.0 (AGPL v3). See LICENSE for more information.

```
