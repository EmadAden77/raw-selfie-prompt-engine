import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'raw-selfie-nvidia-key';

function readKey(): string {
  try { return window.localStorage.getItem(STORAGE_KEY) ?? ''; }
  catch { return ''; }
}

export function NvidiaKeyField({ value, onChange }: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const valid = value.length === 0 || /^nvapi-[a-zA-Z0-9_-]{10,512}$/.test(value);

  function update(next: string) {
    const cleaned = next.trim();
    onChange(cleaned);
    try {
      if (cleaned) window.localStorage.setItem(STORAGE_KEY, cleaned);
      else window.localStorage.removeItem(STORAGE_KEY);
      setStorageWarning(false);
    } catch { setStorageWarning(true); }
  }

  return <section className="key-panel" aria-label="إعداد مفتاح الخدمة">
    <div className="key-heading"><KeyRound size={19} /><label htmlFor="nvidia-key">مفتاح NVIDIA الخاص بي</label></div>
    <p>ضع مفتاحك هنا إذا أردت استخدام NVIDIA، وإذا تركته فاضي سيعمل التطبيق بالمولد المحلي.</p>
    <div className="key-input-row">
      <input
        id="nvidia-key"
        className="key-input"
        type={visible ? 'text' : 'password'}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        dir="ltr"
        value={value}
        onChange={event => update(event.target.value)}
        placeholder="nvapi-••••••••"
        aria-invalid={!valid}
        aria-describedby="nvidia-key-help"
      />
      <button className="button secondary" type="button" aria-label={visible ? 'إخفاء المفتاح' : 'إظهار المفتاح'} onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff size={17}/> : <Eye size={17}/>}
      </button>
      <button className="button secondary" type="button" disabled={!value} onClick={() => update('')}><Trash2 size={16}/> حذف</button>
    </div>
    <p id="nvidia-key-help" className="key-help">
      {value && !valid ? 'يجب أن يبدأ المفتاح بـ nvapi- ويحتوي على أحرف وأرقام صالحة.' :
      storageWarning ? 'تعذّر حفظ المفتاح في المتصفح؛ سيبقى حتى إغلاق الصفحة أو إعادة تحميلها.' :
      'يُحفظ في هذا المتصفح فقط ولا يدخل ملفات المشروع. تجنّب استخدامه على جهاز مشترك.'}
    </p>
  </section>;
}

export { readKey };
