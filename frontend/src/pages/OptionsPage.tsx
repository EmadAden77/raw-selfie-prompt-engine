import { categories } from '../data';
import OptionSelector from '../components/options/OptionSelector';
import type { OptionCategory, Selections } from '../types/options';
export default function OptionsPage({selections,onSelect}:{selections:Selections;onSelect:(key:OptionCategory,id:string)=>void}){
  return <section className="panel"><div className="section-heading"><span className="eyebrow">الخطوة الثانية</span><h2>خصص تفاصيل السيلفي</h2><p>اختر التفاصيل التي تناسبك. السيارة والهوية وقواعد الواقعية ثابتة في جميع النتائج.</p></div>
  <div className="category-list">{categories.map(category=><OptionSelector key={category.key} category={category} value={selections[category.key]} onChange={id=>onSelect(category.key,id)}/>)}</div></section>;
}
