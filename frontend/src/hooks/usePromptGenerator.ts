import { useState } from 'react';
import { generatePrompt } from '../services/promptApi';
import type { Selections } from '../types/options';
import type { PromptResponse } from '../types/prompt';

export function usePromptGenerator(){
  const [result,setResult]=useState<PromptResponse|null>(null);
  const [loading,setLoading]=useState(false);
  const [variation,setVariation]=useState(0);
  const [error,setError]=useState('');
  async function generate(selections:Selections, ownerToken=''){
    const next=variation+1;
    setVariation(next);setLoading(true);setError('');
    try {setResult(await generatePrompt({selections,variation:next},ownerToken));}
    catch {setError('تعذّر إنشاء البرومبت. حاول مرة أخرى.');}
    finally {setLoading(false);}
  }
  return {result,loading,error,generate};
}
