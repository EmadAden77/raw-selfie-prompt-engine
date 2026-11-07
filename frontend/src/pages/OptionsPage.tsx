import { categories } from '../data';
import OptionSelector from '../components/options/OptionSelector';
import type { OptionCategory, Selections } from '../types/options';

export default function OptionsPage({
  selections,onSelect,ownerToken,onOwnerTokenChange
}:{
  selections:Selections;
  onSelect:(key:OptionCategory,id:string)=>void;
  ownerToken:string;
  onOwnerTokenChange:(token:string)=>void;
}){
  return <section className="panel">
    <div className="section-heading">
      <span className="eyebrow">الخطوة الثانية</span>
      <h2>خصص تفاصيل السيلفي</h2>
      <p>اختر التفاصيل التي تناسبك. السيارة والهوية وقواعد الواقعية ثابتة في جميع النتائج.</p>
    </div>
    <div className="category-list">
      {categories.map(category=><OptionSelector key={category.key} category={category}
        value={selections[category.key]} onChange={id=>onSelect(category.key,id)}/>)}
    </div>
    <details className="key-panel owner-nvidia-panel">
      <summary>🔒 NVIDIA الخاصة بصاحب التطبيق</summary>
      <p>للإضافة التحريرية باستخدام NVIDIA، أدخل رمز المالك المنفصل عن مفتاح NVIDIA. بدون الرمز يعمل المحرك المحلي كاملًا.</p>
      <label htmlFor="owner-access-token">رمز الدخول الخاص</label>
      <input id="owner-access-token" className="key-input" type="password"
        dir="ltr" autoComplete="off" spellCheck={false} maxLength={256}
        value={ownerToken} onChange={event=>onOwnerTokenChange(event.currentTarget.value)}
        placeholder="رمز المالك السري"/>
      <p className="key-help">لا تضع مفتاح NVIDIA الذي يبدأ بـ nvapi- هنا. لا نحفظ هذا الرمز في المتصفح أو داخل البرومبت.</p>
    </details>
  </section>;
}
