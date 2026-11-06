import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import type { FallbackReason, PromptResponse } from '../../types/prompt';
import CopyButton from './CopyButton';

const reasons:Record<FallbackReason,string>={
  no_key:'لم تُدخل مفتاح NVIDIA؛ استُخدمت القواعد المحلية.',
  invalid_key:'صيغة مفتاح NVIDIA غير صالحة. تأكد أنه يبدأ بـ nvapi-.',
  unauthorized:'رفضت NVIDIA المفتاح (رمز 401). تأكد من صلاحية المفتاح أو أنشئ مفتاحًا جديدًا.',
  forbidden:'ليس لهذا المفتاح إذن باستخدام الخدمة (رمز 403). راجع صلاحيات حساب NVIDIA.',
  quota:'الحساب يحتاج رصيدًا أو سماحًا بالاستخدام (رمز 402).',
  rate_limited:'تجاوزت حد الطلبات لدى NVIDIA (رمز 429). حاول بعد قليل.',
  model_unavailable:'الموديل غير متاح لهذا المفتاح أو غير موجود (رمز 404).',
  nvidia_timeout:'تأخرت استجابة NVIDIA وانتهت مهلة الاتصال.',
  nvidia_network:'تعذّر اتصال الخادم بخدمة NVIDIA.',
  nvidia_unavailable:'خدمة NVIDIA غير متاحة مؤقتًا.',
  request_rejected:'رفضت NVIDIA إعدادات الطلب. قد يكون هناك تعارض في إعدادات الموديل.',
  empty_response:'لم تُرجع NVIDIA نصًا مناسبًا لإنشاء البرومبت.',
  unsafe_output:'أعادت NVIDIA نصًا يخالف قواعد الهوية أو السيارة أو الواقعية؛ استُخدم البديل الآمن.',
  backend_unreachable:'تعذّر اتصال المتصفح بالخادم؛ تأكد أن Backend يعمل وأن منفذه متاح.',
  backend_error:'استجاب الخادم بخطأ. راجع تشغيل Backend وإعداد الاتصال.',
  invalid_response:'استجابة الخادم غير صالحة أو تخالف القواعد الثابتة.'
};
export default function PromptResult({result}:{result:PromptResponse}){
  const viaNvidia=result.source==='server';
  return <section className="panel result-panel">
    <div className="section-heading"><span className="eyebrow">الخطوة الثالثة</span><h2>البرومبت النهائي</h2><p>انسخ النص الإنجليزي وأرسله إلى محادثة توليد الصور مع صورتك المرجعية.</p></div>
    <div className="generation-status" role="status" aria-live="polite">
      {viaNvidia?<CheckCircle2 size={19}/>:<AlertTriangle size={19}/>}
      <div><strong>{viaNvidia?'تم التوليد باستخدام NVIDIA بنجاح':'تم التوليد بواسطة القواعد المحلية'}</strong>
        <p>{viaNvidia?'استُخدمت NVIDIA لإضافة تفاصيل واقعية، مع إبقاء قواعد الهوية والسيارة ثابتة.':reasons[result.reason??'invalid_response']}</p>
      </div>
    </div>
    <div className="prompt-output" dir="ltr" lang="en">{result.prompt}</div>
    <div className="result-actions"><CopyButton prompt={result.prompt}/></div>
    <p className="privacy-line"><Info size={16}/> التطبيق ينشئ نص البرومبت فقط، ولا يولّد الصور.</p>
  </section>;
}
