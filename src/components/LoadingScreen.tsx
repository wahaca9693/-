import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface LoadingScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onFinish,
  minDuration = 1800,
}) => {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 300);
    const timer2 = setTimeout(() => setProgress(85), 900);
    const timer3 = setTimeout(() => setProgress(100), minDuration - 400);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, minDuration + 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Gold Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#ffd700]/5 blur-[80px] pointer-events-none" />

      {/* Main Logo Showcase */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
        <Logo size="xl" showSubtitle={false} />

        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-3xl font-extrabold gold-gradient-text tracking-widest drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]">
            M.N.R
          </h1>
          <p className="text-[#e5e2e1] text-base font-semibold tracking-wide">
            مركز المنار للموبايل
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18150c] border border-[#d4af37]/30 text-xs text-[#ffd700]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-ping" />
            <span>الوكيل المعتمد والضمان الذهبي</span>
          </div>
        </div>

        {/* Golden Progress Bar */}
        <div className="w-56 mt-4">
          <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#d4af37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#d4af37] transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#99907c] mt-2 font-mono" dir="ltr">
            <span>{progress}%</span>
            <span className="font-sans text-[#d4af37]">جاري تجهيز المتجر الفاخر...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
