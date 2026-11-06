import type { PromptRequest, PromptResponse } from '../types/prompt';
import { cabinMayBeVisible } from '../data/fixedRules';

// This report describes textual selections; it does not inspect photo pixels.
export function buildLocalAudit(request: PromptRequest): NonNullable<PromptResponse['audit']> {
  const index = (key: keyof PromptRequest['selections']) =>
    Number(request.selections[key].split('-').at(-1));
  const angle=index('selfieAngles');
  const location=index('locations');
  const light=index('lighting');
  const condition=index('carConditions');
  const reflection=[4,29].includes(angle);
  const close=[2,3,9,10,11].includes(angle);
  const interior=cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses);
  const covered=[8,10,11,12,13,29,46].includes(location);
  const repairNotes:string[]=[];
  if(reflection)repairNotes.push('سيلفي انعكاسي مع احتمال فرض كاميرا أمامية → العدسة يجب أن تواجه السطح العاكس → استخدام كاميرا خلفية وانعكاس واحد متسق.');
  if(covered&&[1,2,3,4,7,8].includes(light))
    repairNotes.push('اختيار ضوء خارجي لموقع مسقوف → السقف يحجبه → استخدام الإنارة الموجودة داخل المكان.');
  if(light===10)repairNotes.push(reflection
    ?'فلاش الانعكاس → الوهج مرتبط بمصباح الكاميرا الخلفية → تثبيته عند موضع LED المنعكس.'
    :'فلاش الكاميرا الأمامية → LED الخلفي لا يضيء الوجه من الأمام → استخدام وميض الشاشة المفعّل صراحة.');
  if(light===9)repairNotes.push('إضاءة الشاشة وحدها → ضعيفة مع المسافة → إبقاء الخلفية مظلمة دون إضاءة مخفية.');
  if(close)repairNotes.push('اقتصاص قريب → الطريق والمقصورة غالبًا خارج الكادر → عدم إضافتهما أو توسيع الصورة.');
  if(!repairNotes.length)repairNotes.push('تفاصيل الاتساخ العشوائية قد تبدو مصطنعة → لا توجد رواسب بلا سبب → إضافة آثار استخدام موضعية ومرئية فقط.');
  const surface=close?'نسيج البشرة وثنيات الملابس دون عيوب مبتكرة':
    interior?'انضغاط الجلد وآثار لمس الأسطح الظاهرة فقط':
    condition===1?'انعكاسات طلاء نظيف بلا غبار مفروض':
    condition===5?'قطرات المطر والجريان على الأسطح المعرضة':
    'غبار موضعي قرب العجلات وحواف الطريق والملابس المطوية طبيعيًا';
  return {
    repairNotes:repairNotes.slice(0,5),
    sceneCameraSurface:`${interior?'سيلفي في السيارة المتوقفة':'سيلفي قرب السيارة المتوقفة'}؛ ${reflection?'الملف B: كاميرا خلفية وانعكاس':'الملف A: كاميرا أمامية مباشرة'}؛ تفاصيل متوقعة عند ظهورها: ${surface}. هذا تدقيق للخيارات النصية وليس فحصًا للصورة المرجعية.`
  };
}
