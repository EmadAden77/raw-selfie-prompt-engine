import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
export default function CopyButton({prompt}:{prompt:string}){
  const [state,setState]=useState<'idle'|'copied'|'error'>('idle');
  async function handle(){try{await copyToClipboard(prompt);setState('copied');}catch{setState('error');}}
  return <button type="button" className="button secondary" onClick={handle}>{state==='copied'?<Check size={17}/>:<Copy size={17}/>} {state==='copied'?'تم النسخ':state==='error'?'تعذّر النسخ، حاول مجددًا':'نسخ البرومبت'}</button>;
}
