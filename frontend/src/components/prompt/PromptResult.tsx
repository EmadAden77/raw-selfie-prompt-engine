import { Info } from 'lucide-react';
import type { PromptResponse } from '../../types/prompt';
import CopyButton from './CopyButton';
export default function PromptResult({result}:{result:PromptResponse}){
  return <section className="panel result-panel"><div className="section-heading"><span className="eyebrow">الخطوة الثالثة</span><h2>البرومبت النهائي</h2><p>انسخ النص الإنجليزي وأرسله إلى محادثة توليد الصور مع صورتك المرجعية.</p></div>
  <div className="prompt-output" dir="ltr" lang="en">{result.prompt}</div>
  <div className="result-actions"><CopyButton prompt={result.prompt}/></div>
  <p className="privacy-line"><Info size={16}/>{result.source==='local'?'تم إنشاء البرومبت بواسطة القواعد المحلية.':'تم إنشاء البرومبت عبر خدمة النص.'} التطبيق لا يولّد الصور.</p></section>;
}
