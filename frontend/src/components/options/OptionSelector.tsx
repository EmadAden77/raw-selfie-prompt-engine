import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CategoryConfig } from '../../types/options';
import OptionGrid from './OptionGrid';
export default function OptionSelector({category,value,onChange}:{category:CategoryConfig;value:string;onChange:(id:string)=>void}){
  const [open,setOpen]=useState(false);
  const selected=category.options.find(option=>option.id===value)?.label??'';
  const panelId='options-'+category.key;
  return <section className="category-panel"><button className="category-trigger" type="button" aria-expanded={open} aria-controls={panelId} onClick={()=>setOpen(!open)}>
    <span><strong>{category.title}</strong><small>{category.description}</small><em>{selected}</em></span><span className="count-pill">{category.options.length} خيارًا</span><ChevronDown className={'arrow '+(open?'rotated':'')} size={18}/>
  </button>{open&&<div id={panelId} className="category-content"><OptionGrid options={category.options} value={value} onChange={onChange}/></div>}</section>;
}
