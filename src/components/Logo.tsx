import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: { mark: 38, word: 'text-base', sub: 'text-[10px]' },
  md: { mark: 46, word: 'text-lg', sub: 'text-[11px]' },
  lg: { mark: 68, word: 'text-2xl', sub: 'text-xs' },
  xl: { mark: 108, word: 'text-4xl', sub: 'text-sm' },
} as const;

/**
 * شعار مركز المنار للموبايل.
 * الفكرة: شعاع منارة (Beacon) — مثلث ضوء ينطلق من قاعدة داكنة،
 * بتدرّج العلامة indigo ← cyan مع لمسة ذهبية تعكس الهوية الفاخرة.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const s = SIZE_MAP[size];
  const glyphId = `mnr-beam-${size}`;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* العلامة */}
      <span
        className="relative grid place-items-center rounded-2xl shrink-0 shadow-float"
        style={{ width: s.mark, height: s.mark }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`${glyphId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'var(--mnr-brand)' }} />
              <stop offset="60%" style={{ stopColor: 'var(--mnr-brand-2)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--mnr-gold)' }} />
            </linearGradient>
          </defs>

          {/* المربّع الخلفي */}
          <rect width="48" height="48" rx="14" style={{ fill: `url(#${glyphId}-bg)` }} />

          {/* شعاعان يخرجان من المصباح */}
          <g style={{ fill: 'var(--mnr-on-brand)' }}>
            <path d="M24 15.5 L11 6.5 L11 13 Z" opacity="0.45" />
            <path d="M24 15.5 L37 6.5 L37 13 Z" opacity="0.45" />
            <path d="M24 13 L16 5.5 L16 10 Z" opacity="0.75" />
            <path d="M24 13 L32 5.5 L32 10 Z" opacity="0.75" />
          </g>

          {/* جسم المنارة */}
          <path
            d="M20 21 H28 L29.2 36 H18.8 Z"
            style={{ fill: 'var(--mnr-on-brand)', fillOpacity: 0.95 }}
          />

          {/* المصباح */}
          <circle cx="24" cy="17.5" r="3.4" style={{ fill: 'var(--mnr-on-brand)' }} />

          {/* القاعدة */}
          <rect
            x="16.5"
            y="36.5"
            width="15"
            height="3"
            rx="1.5"
            style={{ fill: 'var(--mnr-on-brand)', fillOpacity: 0.95 }}
          />
        </svg>

        {/* هالة ناعمة خلف العلامة */}
        <span
          className="absolute -inset-3 -z-10 rounded-3xl blur-2xl opacity-45 animate-beacon"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, var(--mnr-brand) 0%, var(--mnr-brand-2) 45%, transparent 72%)',
          }}
        />
      </span>

      {/* الاسم */}
      {showSubtitle && (
        <span className="flex flex-col text-right leading-tight">
          <span className="flex items-center gap-1.5">
            <span className={`mnr-gradient-text mnr-h2 tracking-wider ${s.word}`}>M.N.R</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
          </span>
          <span className={`text-ink-2 font-medium ${s.sub}`}>مركز المنار للموبايل</span>
        </span>
      )}
    </div>
  );
};
