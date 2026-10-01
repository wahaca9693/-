import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, Delete, Store } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface AdminAuthModalProps {
  isOpen: boolean;
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** بوابة الدخول للوحة الإدارة — لوحة أرقام بدل حقل نصّي */
export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  correctPin,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  const press = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);

    if (next.length === 4) {
      if (next === correctPin) {
        onSuccess();
        setPin('');
      } else {
        setError(true);
        window.setTimeout(() => setPin(''), 600);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" disableOutsideClose>
      <div className="p-6 sm:p-7 text-center">
        <span className="w-16 h-16 mx-auto rounded-2xl bg-brand-soft text-brand-ink grid place-items-center mb-3">
          <Lock className="w-7 h-7" />
        </span>

        <h3 className="mnr-h2 text-lg text-ink">لوحة إدارة M.N.R</h3>
        <p className="text-xs text-ink-3 mt-1">أدخل رمز الأمان المكوّن من 4 أرقام</p>

        {/* مؤشرات الرمز */}
        <div dir="ltr" className="flex items-center justify-center gap-3 my-6">
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`w-4 h-4 rounded-full transition-all ${
                error
                  ? 'bg-danger scale-110'
                  : pin.length > idx
                    ? 'bg-brand scale-110'
                    : 'bg-surface-3 border border-line'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 flex items-center justify-center gap-1.5 text-xs font-bold text-danger animate-shake">
            <AlertCircle className="w-4 h-4" />
            رمز الدخول غير صحيح — حاول مرة أخرى
          </p>
        )}

        {/* لوحة الأرقام */}
        <div className="grid grid-cols-3 gap-2 max-w-[15rem] mx-auto">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className="mnr-btn mnr-btn-soft h-12 mnr-num text-lg"
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPin('');
              setError(false);
            }}
            className="mnr-btn mnr-btn-ghost h-12 text-xs"
          >
            مسح
          </button>
          <button type="button" onClick={() => press('0')} className="mnr-btn mnr-btn-soft h-12 mnr-num text-lg">
            0
          </button>
          <button
            type="button"
            onClick={() => {
              setPin((p) => p.slice(0, -1));
              setError(false);
            }}
            aria-label="حذف"
            className="mnr-btn mnr-btn-ghost h-12"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-ink-3">
          {correctPin === '1234' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              الرمز الافتراضي <span className="mnr-num font-bold text-brand-ink">1234</span> — غيّره من تبويب الإعدادات
            </>
          ) : (
            <>
              <Store className="w-3.5 h-3.5" />
              رمز مخصّص — غيّره من تبويب «إعدادات المتجر»
            </>
          )}
        </p>
      </div>
    </Modal>
  );
};
