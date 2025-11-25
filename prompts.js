const SYSTEM_PROMPT = `Analyze the following text based on the provided criteria. Your primary task is to first classify the text as 'Factual', 'Opinion', or 'Fiction'. Based on that classification, you will then perform a simplified reliability assessment using only the rubric for the determined category.

Your final output must be a single JSON object adhering to the provided schema.

**Assessment Criteria:**

**A. Factual Content Rubric:**
* **Evidentiary Integrity:**
    * Indicator: Presence of quantitative data (numbers, percentages, statistics) and mentions of sources (studies, reports, research).
    * Analysis: Score 0-5. Score higher for higher density and specificity of evidence.
* **Logical Coherence:**
    * Indicator: Detection of logical fallacy markers (e.g., "everyone knows," "it's obvious that," ad hominem attacks).
    * Analysis: Score 0-5. Score *lower* if fallacy markers are present. A score of 5 means high coherence.
* **Rhetorical Style:**
    * Indicator: Analysis of language for emotional charge (e.g., "outrageous," "disastrous," "miracle").
    * Analysis: Score 0-5. Score *lower* for high prevalence of emotionally charged language. A score of 5 means neutral language.

**B. Opinion Content Rubric:**
* **Transparency of Position:**
    * Indicator: Use of first-person pronouns ("I believe," "In my view") and subjective framing.
    * Analysis: Score 0-5. Score higher for clear subjective framing (this is a *transparency* score).
* **Support for Opinion:**
    * Indicator: Presence of evidence-like statements (as per Factual assessment) used to support the opinion.
    * Analysis: Score 0-5. Score higher when opinions are supported by verifiable information.
* **Intellectual Honesty:**
    * Indicator: Phrases that acknowledge counterarguments ("although some may say," "on the other hand," "a counterpoint is").
    * Analysis: Score 0-5. Score higher for acknowledging other viewpoints.

**C. Fiction Content Rubric:**
* **Explicit Labeling:**
    * Indicator: Presence of keywords like 'Fiction,' 'Satire,' 'Short Story,' 'Parody.'
    * Analysis: Score 0-5. Score 5 if explicitly labeled, 0 if not.
* **Content & Stylistic Cues:**
    * Indicator: Presence of dialogue (quotation marks), narrative descriptions, and character development.
    * Analysis: Score 0-5. Score higher for strong, clear narrative elements (this is a *transparency* score).

**Final JSON Output:**
The output must be a single JSON object.
1.  \`classification\`: The determined category ('Factual', 'Opinion', or 'Fiction').
2.  \`finalScore\`: An overall score from 0 to 5, representing an average of the criteria scores for the *chosen* rubric.
3.  \`rawAssessment\`: An array of objects, where each object details the scoring for a specific criterion *from the chosen rubric*, including the \`indicator\`, the \`analysis\` (your reasoning), and the \`score\` assigned (0-5).`;
