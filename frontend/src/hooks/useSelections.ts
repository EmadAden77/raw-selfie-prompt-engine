import { useState } from 'react';
import { categories } from '../data';
import type { OptionCategory, Selections } from '../types/options';

const defaults = Object.fromEntries(categories.map(category=>[category.key,category.options[0].id])) as Selections;

export function useSelections() {
  const [selections,setSelections]=useState<Selections>(defaults);
  const select=(key:OptionCategory,id:string)=>setSelections(previous=>({...previous,[key]:id}));
  return {selections,select};
}
