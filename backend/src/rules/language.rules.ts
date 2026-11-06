export const REQUIRED_PREFIX='ChatGPT, using the reference image I uploaded, generate an image of the exact same person';
export const languageRules=[
 'Write one coherent final English-language prompt directly addressed to ChatGPT.',
 'Start verbatim with: '+REQUIRED_PREFIX,
 'Do not include Arabic, markdown fences, headings, explanations, JSON or a separate negative prompt.'
] as const;
