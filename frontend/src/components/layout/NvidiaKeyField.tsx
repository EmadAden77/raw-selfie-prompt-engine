import { useState, type ClipboardEvent } from 'react';
import { Eye, EyeOff, KeyRound, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'raw-selfie-nvidia-key';
// Invisible direction marks sometimes enter the clipboard when copying from RTL text.
export function normalizeNvidiaKey(value: string): string {
  return value.replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, '').trim();
}

export function readKey(): string {
  try { return normalizeNvidiaKey(window.localStorage.getItem(STORAGE_KEY) ?? ''); }
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
    const cleaned = normalizeNvidiaKey(next);
    onChange(cleaned);
    try {
      if (cleaned) window.localStorage.setItem(STORAGE_KEY, cleaned);
      else window.localStorage.removeItem(STORAGE_KEY);
      setStorageWarning(false);
    } catch { setStorageWarning(true); }
  }

  function paste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text/plain');
    if (!pasted) return;
    event.preventDefault();
    const input = event.currentTarget;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    update(value.slice(0, start) + normalizeNvidiaKey(pasted) + value.slice(end));
  }

  return <section className="key-panel" aria-label="إعداد مفتاح الخدمة">
    <div className="key-heading"><KeyRound size={19}/><label htmlFor="nvidia-key">مفتاح NVIDIA الخاص بي</label></div>
    <p>ضع مفتاحك هنا إذا أردت استخدام NVIDIA، وإذا تركته فاضي سيعمل التطبيق بالمولد المحلي.</p>
    <div className="key-input-row">
      <input
        id="nvidia-key"
        className="key-input"
        type={visible ? 'text' : 'password'}
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={event => update(event.target.value)}
        onPaste={paste}
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
      'يُحفظ المفتاح في هذا المتصفح فقط، ويُرسل للخادم عند التوليد. تجنّب استخدام جهاز مشترك.'}
    </p>
  </section>;
}
