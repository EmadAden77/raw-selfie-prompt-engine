# معمارية النظام

## المكونات

- `frontend/src/app`: التنقل والخطوات؛ `components/upload` معاينة الصورة داخل المتصفح؛ `components/options` الاختيارات العربية؛ `components/prompt` النتيجة والنسخ.
- `frontend/src/data`: نصوص خيارات عربية مع وصف إنجليزي للتوليد المحلي؛ `hooks` الحالة؛ `services/promptApi.ts` إرسال JSON واستقبال النص أو fallback.
- `backend/src/routes` و`controllers`: نقطة استقبال `/api/prompt`.
- `backend/src/schemas`: فحص JSON وقيم معرفات الاختيارات قبل التوليد.
- `backend/src/data/option-mappings.ts`: ربط المعرفات `location-1` وغيرها بنصوص إنجليزية آمنة.
- `backend/src/rules`: القواعد الثابتة؛ `engine`: بناء القاعدة، التوسيع، تجميع البرومبت، التحقق والتوليد الاحتياطي.
- `backend/src/services/nvidia.service.ts`: استدعاء NVIDIA على الخادم باستخدام المفتاح السري؛ `prompt.service.ts`: اختيار الاستجابة المقبولة أو fallback.
- `backend/src/config`: إعدادات البيئة؛ `middleware`: CORS وتحديد المعدل ومعالجة الأخطاء.

## مسار العمل

```text
Frontend (React + TypeScript + Vite, Arabic RTL)
  → JSON: { selections, variation }
  → POST /api/prompt
Backend (Node.js + TypeScript + Express)
  → Validation → Rule Builder → Creative Expander
  → NVIDIA API (deepseek-ai/deepseek-v4.1-flash)
  → Prompt Validator → English ChatGPT prompt
  ↳ NVIDIA missing/unavailable/invalid → Backend Fallback Generator
  ↳ Backend unreachable → Frontend local fallback
```

عنوان خدمة NVIDIA: `https://integrate.api.nvidia.com/v1/chat/completions`. لا يرسل Frontend الصورة المرجعية إلى Backend ولا إلى NVIDIA؛ يُنسخ البرومبت وتُرفع الصورة في ChatGPT بشكل منفصل.

## التدرج عند الفشل

إذا لم يتوفر مفتاح NVIDIA أو فشل استدعاؤها أو خالفت النتيجة قواعد التحقق، يرد Backend ببرومبت محلي ويحمل `source: "local"`. إذا لم يصل المتصفح إلى Backend خلال مهلة الاتصال أو عاد رد غير مقبول، ينشئ Frontend برومبتًا محليًا أيضًا. `source: "server"` يدل على قبول نص NVIDIA من الخادم؛ وليس ضمانًا بأن الصورة مطابقة للهوية.

## حدود الثقة

الصورة المرجعية لا تدخل JSON، والواجهة لا تمتلك أي مفتاح. يُتحقق من معرّفات الاختيارات في Backend؛ ومع ذلك فـ fallback المتصفح مخصص لاستمرارية تجربة المستخدم، وليس بديلًا عن حماية الخادم.

## ثوابت لا تتغير

- **الهوية:** الصورة المرجعية هي المصدر الوحيد للشخص؛ لا تغيير للوجه أو شكل الجسم أو لون البشرة، ولا تجميل أو تبييض أو تنعيم. الشعر يحتفظ بخط نموه وكثافته وطوله الأصلي، وتتغير جهة التسريح فقط بما تسمح به الصورة.
- **السيارة:** Range Rover Sport 2022 باللون الأبيض اللؤلؤي، باقة رياضية وجنوط سوداء؛ الداخلية جلد ومقاعد وطبلون ومقود وألواح أبواب باللون البيج مع سقف بانورامي. السيارة متوقفة دائمًا.
- **التصوير:** سيلفي خام من الكاميرا الأمامية بيد الشخص، منظور ومسافة ذراع حقيقيان، ميلان وتكوين غير مثالي قليلًا، وضوضاء مستشعر وإضاءة وظلال منطقية.
- **الواقعية:** ممنوع الجلد الشمعي أو البلاستيكي أو الخزفي، وفلاتر التجميل وCGI والعرض ثلاثي الأبعاد وHDR المبالغ فيه. تظهر مسام الجلد وملمس القماش وغبار السيارة بصورة طبيعية بلا إضافة عيوب مختلقة.
- **المكان:** مشاهد سعودية يومية عامة دون أسماء معالم أو مولات أو أبراج مشهورة؛ خلفية غير فارغة مع نشاط بشري ومروري منطقي، والسيارة الأساسية لا تتحرك.
- **اللغة:** واجهة المستخدم واختياراتها بالعربية فقط واتجاهها RTL؛ الناتج برومبت واحد بالإنجليزية فقط موجّه إلى ChatGPT ويبدأ حرفيًا بـ:

```text
ChatGPT, using the reference image I uploaded, generate an image of the exact same person
```

تُستكمل الجملة بتفاصيل المشهد، ولا يضاف نص عربي أو شرح أو Negative Prompt منفصل داخل الناتج.

## التشغيل على الجهاز

المتطلبات: Node.js مطابق للشرط في `package.json` (مثل Node.js 22.12+)، وnpm 10+.

من جذر المستودع نفّذ:

```bash
npm install
```

انسخ ملف `backend/.env.example` إلى `backend/.env` محليًا. داخل **`backend/.env` فقط** ضع مفتاحك الخاص في `NVIDIA_API_KEY` إن أردت استخدام NVIDIA. تركه فارغًا يشغّل المولّد الاحتياطي بدون الاتصال بـNVIDIA. لا تضع المفتاح في Frontend أو متغيرات `VITE_*` أو أي ملف مرفوع إلى GitHub.

افتح نافذتي طرفية من جذر المشروع:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

الواجهة عادة على `http://localhost:5173`، والخادم على `http://localhost:3001`، والفحص الصحي `http://localhost:3001/health`. يوجّه Vite المسار `/api` إلى Backend تلقائيًا أثناء التطوير.

للتحقق قبل النشر:

```bash
npm run typecheck
npm run build
npm test
```

## ملاحظات النشر

ابنِ الحزمتين من جذر المشروع بـ `npm install` ثم `npm run build`. انشر `frontend/dist` كملفات ثابتة، وشغّل Backend ببيئة Node.js (مثل `npm run start` بعد البناء) وتحقق من صحة `/health`.

هناك طريقتان للربط:

1. **نطاق واحد:** وجّه طلبات `/api/*` إلى خادم Backend، وقدّم باقي الطلبات من `frontend/dist`؛ بهذا يبقى `VITE_API_BASE_URL` فارغًا.
2. **نطاقان مختلفان:** اضبط `VITE_API_BASE_URL` عند **بناء Frontend** إلى عنوان Backend الذي يصل إليه المتصفح (من دون `/api/prompt`). اضبط `CORS_ORIGINS` في Backend على أصل الواجهة الصحيح، واستخدم HTTPS.

خدمة Backend فقط تحمل `NVIDIA_API_KEY` في متغيرات بيئة الخادم أو `backend/.env` المحلي غير المتتبّع؛ **لا تنشر ملف .env الحقيقي ولا تكشف المفتاح في المتصفح أو GitHub**. `.env.example` قالب بلا أسرار. لا يفترض المشروع أن Vite proxy التطويري يعمل في الإنتاج؛ يلزم Proxy إنتاجي أو عنوان Backend كما سبق.
