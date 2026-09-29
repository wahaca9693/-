import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, minDuration = 1500 }) => {
  const [progress, setProgress] = useState(12);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setProgress(46), 280),
      setTimeout(() => setProgress(84), 820),
      setTimeout(() => setProgress(100), Math.max(0, minDuration - 300)),
      setTimeout(() => setIsFading(true), minDuration),
      setTimeout(() => onFinish?.(), minDuration + 450),
    ];
    return () => timers.forEach(clearTimeout);
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-canvas transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* هالة الشعاع */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full blur-3xl pointer-events-none opacity-60 animate-beacon"
        style={{ background: 'radial-gradient(circle, var(--mnr-brand) 0%, var(--mnr-brand-2) 40%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        <Logo size="xl" showSubtitle={false} />

        <div className="space-y-2">
          <h1 className="mnr-h1 text-3xl sm:text-4xl mnr-gradient-text tracking-widest">M.N.R</h1>
          <p className="mnr-h2 text-base text-ink">مركز المنار للموبايل</p>
          <span className="mnr-badge mnr-badge-gold">
            <ShieldCheck className="w-3.5 h-3.5" />
            الوكيل المعتمد والضمان الذهبي
          </span>
        </div>

        <div className="w-64">
          <div className="h-1.5 w-full rounded-full bg-surface-2 border border-line overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundImage: 'linear-gradient(90deg, var(--mnr-brand), var(--mnr-brand-2), var(--mnr-gold))',
              }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-ink-3">
            <span className="mnr-num">{progress}%</span>
            <span>جاري تجهيز المتجر…</span>
          </div>
        </div>
      </div>
    </div>
  );
};
