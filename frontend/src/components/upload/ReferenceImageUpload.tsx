import { useRef, useState } from 'react';
import { ImagePlus, Trash2, ShieldCheck } from 'lucide-react';
type Props={file:File|null;onChange:(file:File|null)=>void};
export default function ReferenceImageUpload({file,onChange}:Props){
  const ref=useRef<HTMLInputElement>(null);
  const [message,setMessage]=useState('');
  const [preview,setPreview]=useState<string|null>(null);
  function receive(selected?:File){
    if(!selected)return;
    if(!['image/png','image/jpeg','image/webp'].includes(selected.type)){setMessage('اختر صورة بصيغة مدعومة.');return;}
    if(selected.size>10*1024*1024){setMessage('حجم الصورة يجب ألا يتجاوز عشرة ميجابايت.');return;}
    if(preview)URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selected));setMessage('');onChange(selected);
  }
  function clear(){if(preview)URL.revokeObjectURL(preview);setPreview(null);onChange(null);if(ref.current)ref.current.value='';}
  return <section className="panel upload-panel">
    <div className="section-heading"><span className="eyebrow">الخطوة الأولى</span><h2>صورتك المرجعية</h2><p>اختر صورة واضحة لوجهك. ستستخدمها بنفسك مع البرومبت في محادثة توليد الصور.</p></div>
    <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" className="visually-hidden" aria-label="اختيار صورة مرجعية" onChange={e=>receive(e.target.files?.[0])}/>
    {file&&preview?<div className="preview-box"><img src={preview} alt="معاينة الصورة المرجعية"/><div><strong>تم اختيار الصورة</strong><p>{file.name}</p><button className="button secondary" type="button" onClick={clear}><Trash2 size={16}/> حذف الصورة</button></div></div>:
    <button type="button" className="upload-target" onClick={()=>ref.current?.click()}><ImagePlus size={34}/><strong>اضغط لاختيار صورتك</strong><span>صور شخصية بصيغة معروفة، حتى عشرة ميجابايت</span></button>}
    {message&&<p className="form-error" role="alert">{message}</p>}
    <p className="privacy-line"><ShieldCheck size={16}/> الصورة تبقى داخل متصفحك ولا تُرسل إلى خدمة توليد البرومبت.</p>
  </section>;
}
