const steps=['الصورة المرجعية','التفاصيل والاختيارات','البرومبت النهائي'];
export default function StepNavigation({step}:{step:number}){
  return <nav aria-label="مراحل إنشاء البرومبت" className="step-nav">{steps.map((label,i)=><div key={label} className={'step '+(i===step?'current':i<step?'complete':'')}><span className="step-number">{i+1}</span><span>{label}</span></div>)}</nav>;
}
