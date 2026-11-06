import type { Option } from '../../types/options';
import OptionCard from './OptionCard';
export default function OptionGrid({options,value,onChange}:{options:Option[];value:string;onChange:(id:string)=>void}){
  return <div className="options-grid">{options.map(option=><OptionCard key={option.id} option={option} selected={option.id===value} onClick={()=>onChange(option.id)}/>)}</div>;
}
