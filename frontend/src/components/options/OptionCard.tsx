import type { Option } from '../../types/options';
export default function OptionCard({option,selected,onClick}:{option:Option;selected:boolean;onClick:()=>void}){
  return <button type="button" className={'option-card '+(selected?'selected':'')} onClick={onClick} aria-pressed={selected}><span>{option.label}</span><span className="option-indicator" aria-hidden="true">{selected?'✓':''}</span></button>;
}
