import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, WandSparkles } from 'lucide-react';
import Header from '../components/layout/Header';
import StepNavigation from '../components/layout/StepNavigation';
import UploadPage from '../pages/UploadPage';
import OptionsPage from '../pages/OptionsPage';
import ResultPage from '../pages/ResultPage';
import GenerateButton from '../components/prompt/GenerateButton';
import { useSelections } from '../hooks/useSelections';
import { usePromptGenerator } from '../hooks/usePromptGenerator';

export default function App(){
  const [step,setStep]=useState(0);
  const [image,setImage]=useState<File|null>(null);
  const {selections,select}=useSelections();
  const {result,loading,error,generate}=usePromptGenerator();
  async function submit(){await generate(selections);setStep(2);}
  return <div className="app-shell"><Header/><main className="main">
    <section className="hero"><div className="hero-icon"><WandSparkles size={25}/></div><span className="eyebrow">واقعية الصورة تبدأ بتفاصيل صحيحة</span><h1>سيلفي يشبهك، لا يشبه الفلاتر</h1><p>اصنع تعليمات صورة عفوية تحفظ ملامحك وسيارتك كما هي، ثم انسخ البرومبت إلى محادثة توليد الصور.</p></section>
    <StepNavigation step={step}/>
    {step===0&&<UploadPage file={image} onChange={setImage}/>}
    {step===1&&<OptionsPage selections={selections} onSelect={select}/>}
    {step===2&&(result?<ResultPage result={result}/>:<p className="form-error">{error||'تعذّر إنشاء البرومبت.'}</p>)}
    {error&&step!==2&&<p role="alert" className="form-error">{error}</p>}
    <div className="navigation-bar">
      {step>0&&<button className="button secondary" type="button" onClick={()=>setStep(step-1)}><ArrowRight size={17}/> رجوع</button>}
      {step===0&&<button className="button primary" type="button" onClick={()=>setStep(1)} disabled={!image}>متابعة إلى الاختيارات <ArrowLeft size={17}/></button>}
      {step===1&&<GenerateButton loading={loading} onClick={submit}/>}
      {step===2&&<GenerateButton loading={loading} onClick={submit} label="توليد برومبت آخر"/>}
    </div>
    <footer className="footer"><LockKeyhole size={16}/> هويتك من صورتك المرجعية، والسيارة متوقفة دائمًا، ولا يتم إنشاء صور داخل التطبيق.</footer>
  </main></div>;
}
