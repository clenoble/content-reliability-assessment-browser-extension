# Privacy Policy for Text Reliability Assessment

**Last Updated:** January 27, 2025  
**Effective Date:** January 27, 2025

## Introduction

Text Reliability Assessment ("the Extension", "we", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our browser extension.

**Developer:** Céline Lenoble  
**Contact Email:** crabe@fastmail.com  
**Extension Version:** 1.1

## Our Commitment to Privacy

Text Reliability Assessment is designed with privacy as a core principle. We do not collect, store, or transmit any personal information or user data to our servers. We do not have servers that collect user data. All data processing happens locally in your browser or is sent directly to AI service providers that you explicitly choose and configure.

## What Data We Access

### 1. Webpage Text Content

**What We Access:**
- Text content from webpages you choose to analyze
- Only when you explicitly click the "Analyze Page Text" button

**How We Use It:**
- Text is extracted from the active webpage using the `activeTab` permission
- Text is sent to your chosen AI provider (Google Gemini or local Ollama) for analysis
- Text is temporarily stored in your browser's local storage during processing
- Text is deleted immediately after analysis is complete

**Important:**
- We never access webpage content automatically or in the background
- Analysis only occurs when you explicitly initiate it
- We do not retain, store, or transmit webpage content to our own servers
- We do not have access to the webpage content - it goes directly from your browser to your chosen AI provider

### 2. Page Metadata

**What We Access:**
- Page URL and title of the webpage being analyzed
- Tab information to identify which page you want to analyze

**How We Use It:**
- To display context about which page is being analyzed
- To validate that the page is a standard webpage (http/https protocol)
- This information is not stored, transmitted, or retained after use

## Data Storage

### Local Storage (On Your Device)

We store the following data locally in your browser using Chrome's storage APIs:

#### 1. User Settings (`chrome.storage.sync`)
- **Selected AI Model:** Your choice between Gemini (cloud) or Mistral (local)
- **Gemini API Key:** If you choose to use Google Gemini, your API key is stored locally
- **Purpose:** To remember your preferences across browser sessions
- **Syncing:** These settings sync across devices where you're signed into Chrome (Chrome's native sync feature)

#### 2. Temporary Analysis Data (`chrome.storage.local`)
- **Extracted Text:** Temporarily stored during analysis processing
- **Analysis Results:** Stored briefly to display results in the UI
- **Error Messages:** If text extraction fails, error information is stored temporarily
- **Duration:** This data is automatically cleared after analysis is complete or when you close the extension

**Important:**
- All storage is local to your browser
- We cannot access this data
- You can clear this data at any time through Chrome's extension settings

## Third-Party Data Sharing

### When You Use Google Gemini (Cloud Option)

**If you choose to use Google Gemini:**

**What Data is Shared:**
- Webpage text content that you choose to analyze
- Your Gemini API key (which you provide)

**Who It's Shared With:**
- Google LLC (generativelanguage.googleapis.com)

**Purpose:**
- To perform AI-powered text classification and reliability assessment

**How It's Shared:**
- Sent directly from your browser to Google's servers via HTTPS
- We do not act as an intermediary - data goes directly from your browser to Google

**Google's Privacy Policy:**
- Google's use of this data is governed by their own privacy policy and API terms
- See: https://policies.google.com/privacy
- API Terms: https://ai.google.dev/gemini-api/terms

**Your API Key:**
- You must obtain your own API key from Google AI Studio
- Your API key is stored locally in your browser only
- We never receive, store, or have access to your API key
- Your API key is only transmitted to Google's servers for authentication

### When You Use Mistral/Ollama (Local Option)

**If you choose to use local Ollama:**

**What Data is Shared:**
- Webpage text content that you choose to analyze

**Who It's Shared With:**
- Your own local Ollama server running on your computer (localhost:11434)

**Purpose:**
- To perform AI-powered text classification and reliability assessment entirely on your device

**Important:**
- No data leaves your computer when using this option
- Analysis is completely private and offline
- No API key required
- No internet connection needed for analysis (after initial model download)

## Data We Do NOT Collect

We explicitly DO NOT collect, store, or transmit:

- ❌ Browsing history
- ❌ Personal information (name, email, address, etc.)
- ❌ Financial information
- ❌ Authentication credentials or passwords
- ❌ Device information or system data
- ❌ Location data
- ❌ Cookies or tracking data
- ❌ Analytics or usage statistics
- ❌ Any data for advertising purposes
- ❌ Any data to our own servers (we don't have data collection servers)

## How We Use Your Data

The Extension uses data solely for the following purposes:

1. **Text Analysis:** To classify webpage text as Factual, Opinion, or Fiction and generate reliability scores
2. **Settings Management:** To remember your AI model preference and API key configuration
3. **User Interface:** To display analysis results and status messages

**We do not use your data for:**
- Marketing or advertising
- Selling or sharing with third parties (except your chosen AI provider as described above)
- Building user profiles
- Tracking your behavior
- Any purpose other than providing the core Extension functionality

## Data Retention

- **Webpage Text:** Deleted immediately after analysis is complete
- **Analysis Results:** Retained in browser memory until you close the extension or analyze new content
- **User Settings:** Retained until you uninstall the extension or manually clear them
- **API Keys:** Retained until you change or delete them in settings

## Your Data Rights and Controls

### You Have Full Control:

1. **Choose Your AI Provider:**
   - Select between cloud-based (Gemini) or local (Ollama) processing
   - Switch at any time in extension settings

2. **Manage Your API Key:**
   - Add, change, or remove your Gemini API key at any time
   - Access via Extension settings page

3. **Control When Analysis Occurs:**
   - Analysis only happens when you click "Analyze Page Text"
   - No automatic or background analysis

4. **Clear Your Data:**
   - Clear stored settings: Chrome Settings → Extensions → Text Reliability Assessment → Remove
   - Clear local storage: Uninstall and reinstall the extension
   - Clear synced settings: Change settings before uninstalling, or clear Chrome sync data

5. **Revoke Permissions:**
   - Disable or uninstall the extension at any time through Chrome's extension management

### Data Deletion

To completely remove all data associated with the Extension:

1. Navigate to Chrome Settings → Extensions
2. Find "Text Reliability Assessment"
3. Click "Remove"
4. All local data will be automatically deleted
5. If you used Google Gemini, contact Google regarding API usage logs (governed by Google's retention policies)

## Security Measures

We implement the following security measures:

### Technical Safeguards:
- **Content Security Policy (CSP):** Enforced to prevent code injection and XSS attacks
- **Local Storage Only:** Sensitive data (API keys) never leaves your device except to authenticate with your chosen provider
- **HTTPS Communication:** All API communications use encrypted HTTPS connections
- **No Remote Code Execution:** All extension code is static and reviewed by Chrome Web Store
- **Minimal Permissions:** We only request permissions essential for core functionality
- **No Persistent Scripts:** Content scripts only run when you explicitly trigger analysis

### Chrome's Security:
- The Extension is distributed through Chrome Web Store and subject to Google's review process
- Chrome's extension sandbox isolates the Extension from other browser components
- Chrome's permission system allows you to review and control Extension capabilities

## Third-Party Services

### Google Gemini API (Optional)

**Service Provider:** Google LLC  
**Privacy Policy:** https://policies.google.com/privacy  
**API Terms:** https://ai.google.dev/gemini-api/terms  
**What We Share:** Webpage text you choose to analyze  
**Purpose:** AI-powered text classification  
**Your Control:** Only used if you select Gemini and provide your own API key

### Ollama (Optional, Self-Hosted)

**Service Provider:** You (self-hosted on localhost)  
**Privacy Policy:** N/A (local processing)  
**What We Share:** Webpage text you choose to analyze (stays on your device)  
**Purpose:** AI-powered text classification  
**Your Control:** Only used if you select Ollama and have it running locally

### External CDN Resources (UI Only)

For user interface styling, we load:
- Tailwind CSS from cdn.jsdelivr.net
- Google Fonts from fonts.googleapis.com and fonts.gstatic.com

**Important:** These resources are only used for visual styling and do not transmit any user data.

## Children's Privacy

The Extension is not directed to children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect data from children. If you are a parent or guardian and believe your child has used the Extension, please contact us at crabe@fastmail.com.

## International Data Transfers

### If Using Google Gemini:
- Data may be transferred to and processed in countries where Google operates servers
- These transfers are subject to Google's privacy policies and legal frameworks
- See Google's privacy policy for details on international data transfers

### If Using Local Ollama:
- No international data transfer occurs
- All processing happens on your local device

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect:
- Changes in our data practices
- Changes in legal requirements
- Updates to Extension functionality
- User feedback and privacy enhancements

**How We Notify You:**
- Material changes will be announced through Extension updates
- The "Last Updated" date at the top of this policy will be changed
- Significant changes may be communicated through the Extension's UI or update notes

**Your Continued Use:**
- Continued use of the Extension after changes constitutes acceptance of the updated policy
- We encourage you to review this policy periodically

## Legal Basis for Processing (GDPR)

For users in the European Economic Area (EEA), UK, or Switzerland:

**Legal Bases:**
1. **Consent:** You provide explicit consent by choosing to analyze webpage content and configuring AI provider settings
2. **Legitimate Interest:** We have a legitimate interest in providing text reliability analysis functionality
3. **Contract Performance:** Processing is necessary to provide the service you requested (text analysis)

**Your Rights Under GDPR:**
- Right to access your data (stored locally in your browser)
- Right to rectification (update settings at any time)
- Right to erasure ("right to be forgotten" - uninstall the extension)
- Right to restrict processing (disable the extension)
- Right to data portability (settings can be exported manually)
- Right to object (stop using the extension at any time)
- Right to withdraw consent (uninstall or change settings)

**Data Controller:** Céline Lenoble (crabe@fastmail.com)

## California Privacy Rights (CCPA)

For California residents:

**Categories of Personal Information:**
- We do not collect personal information as defined by CCPA
- Webpage text content is not considered personal information in our use case
- API keys are stored locally and not accessible to us

**Your California Rights:**
- Right to know what data is collected (described in this policy)
- Right to delete data (uninstall extension)
- Right to opt-out of sale (we do not sell data)
- Right to non-discrimination (N/A - we don't monetize data)

## Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:

**Email:** crabe@fastmail.com  
**Extension Name:** Text Reliability Assessment  
**Developer:** Céline Lenoble

**Response Time:** We aim to respond to privacy inquiries within 30 days.

## Open Source and Transparency

This Extension is open source software licensed under GNU Affero General Public License v3.0 (AGPL v3).

**Transparency:**
- Source code is available for review (to be published on GitHub)
- You can inspect the code to verify our privacy claims
- Community contributions and security audits are welcome

**License:** https://www.gnu.org/licenses/agpl-3.0.en.html

## Compliance and Certifications

- **Chrome Web Store Policies:** This Extension complies with Chrome Web Store Developer Program Policies
- **Manifest V3:** Built using Chrome's latest extension platform with enhanced security and privacy
- **Content Security Policy:** Strict CSP enforced to prevent security vulnerabilities

## Jurisdiction and Governing Law

This Privacy Policy is governed by and construed in accordance with the laws of Switzerland, where the developer is located, without regard to conflict of law principles.

## Acknowledgment

By installing and using Text Reliability Assessment, you acknowledge that you have read, understood, and agree to this Privacy Policy.

---

**Version:** 1.0  
**Last Updated:** January 27, 2025  
**Effective Date:** January 27, 2025  
**Developer:** Céline Lenoble  
**Contact:** crabe@fastmail.com
