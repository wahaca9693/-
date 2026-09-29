import React, { useState } from 'react';
import { Lock, X, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  correctPin,
  onSuccess,
  onClose,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          onSuccess();
          setPin('');
        } else {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/40 shadow-2xl p-6 text-center text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#99907c] hover:text-[#ffd700]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Shield Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-3 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-[#f5f5f7]">لوحة إدارة M.N.R المركزية</h3>
        <p className="text-xs text-[#99907c] mt-1">
          أدخل رمز الأمان المكون من 4 أرقام للمتابعة
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all ${
                  error
                    ? 'border-[#ff453a] bg-[#ff453a]/20 scale-110'
                    : filled
                    ? 'border-[#ffd700] bg-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.6)] scale-110'
                    : 'border-[#444] bg-[#141414]'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-[#ff453a] mb-4 flex items-center justify-center gap-1 font-semibold animate-shake">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>رمز PIN غير صحيح! الرمز الافتراضي: 1234</span>
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-[#181818] hover:bg-[#252012] border border-[#d4af37]/20 hover:border-[#ffd700]/50 text-lg font-bold text-[#f5f5f7] active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="h-12 rounded-2xl bg-[#181818] hover:bg-[#222] text-xs font-semibold text-[#99907c] active:scale-95 transition-all"
          >
            مسح
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-[#181818] hover:bg-[#252012] border border-[#d4af37]/20 hover:border-[#ffd700]/50 text-lg font-bold text-[#f5f5f7] active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-[#181818] hover:bg-[#222] text-xs font-semibold text-[#ffd700] active:scale-95 transition-all flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        {/* Security Note */}
        <p className="text-[11px] text-[#99907c] mt-5">
          الرمز الافتراضي للمدير: <span className="font-mono text-[#ffd700] font-bold">1234</span> (يمكن تغييره من الإعدادات)
        </p>
      </div>
    </div>
  );
};
