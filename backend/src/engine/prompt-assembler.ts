export function assemblePrompt(base:string,expansion:string):string {
  return [base.trim(),expansion.trim(),'Vertical portrait composition, 9:16 aspect ratio.'].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
}

