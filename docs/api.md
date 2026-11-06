# توثيق API

## نقاط النهاية

### GET /health

يُرجع نجاح الخدمة:

```json
{"status":"ok"}
```

### POST /api/prompt

الرأس: `Content-Type: application/json`. يستقبل معرفات الاختيارات فقط؛ لا يقبل صورة أو مفتاح API.

```json
{
  "selections": {
    "locations": "location-1",
    "clothing": "clothing-1",
    "expressions": "expression-1",
    "hairstyles": "hair-1",
    "selfieAngles": "angle-1",
    "poses": "pose-1",
    "carConditions": "clean-2",
    "lighting": "light-1"
  },
  "variation": 1
}
```

الخيارات الثمانية مطلوبة، ومعرّفاتها يجب أن توجد في القوائم المسموحة. `variation` عدد صحيح من 0 إلى 1000000.

الرد الناجح: HTTP 200

```json
{
  "prompt": "ChatGPT, using the reference image I uploaded, generate an image of the exact same person...",
  "source": "local"
}
```

`source` يساوي `server` إذا استُخدمت نتيجة NVIDIA المقبولة، أو `local` إذا استُخدم المولّد الاحتياطي داخل Backend. محتوى `prompt` الحقيقي أطول ويضم القواعد الثابتة. الأخطاء: 400 للمدخلات غير الصالحة، 404 لمسار غير موجود، 429 لتجاوز المعدل، و500 للأخطاء غير المتوقعة.

## طلب تجريبي دون أي مفتاح

```bash
curl -X POST http://localhost:3001/api/prompt \
  -H "Content-Type: application/json" \
  -d '{"selections":{"locations":"location-1","clothing":"clothing-1","expressions":"expression-1","hairstyles":"hair-1","selfieAngles":"angle-1","poses":"pose-1","carConditions":"clean-2","lighting":"light-1"},"variation":1}'
```

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

## ثوابت لا تتغير

- **الهوية:** الصورة المرجعية هي المصدر الوحيد للشخص؛ لا تغيير للوجه أو شكل الجسم أو لون البشرة، ولا تجميل أو تبييض أو تنعيم. الشعر يحتفظ بخط نموه وكثافته وطوله الأصلي، وتتغير جهة التسريح فقط بما تسمح به الصورة.
- **السيارة:** Range Rover Sport 2022 باللون الأبيض اللؤلؤي، باقة رياضية وجنوط سوداء؛ الداخلية جلد بيج للمقاعد والطبلون والأبواب، مقود جلدي أسود، سقف بانورامي وشاشتان Touch Pro Duo أصليتان. السيارة متوقفة دائمًا.
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
