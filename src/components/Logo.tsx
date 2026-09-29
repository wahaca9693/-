import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 38, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 48, text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 84, text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 140, text: 'text-4xl', sub: 'text-lg' },
  };

  const current = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer ${className}`}
    >
      {/* Official Circular Golden Crest */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-b from-[#18150c] to-[#080808] border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
        style={{ width: current.icon, height: current.icon }}
      >
        {/* Ambient Gold Radial Glow */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.18)_0%,transparent_75%)] pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear Gold Gradient */}
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff6c7" />
              <stop offset="25%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="75%" stopColor="#aa7c11" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>

            <linearGradient id="goldShine" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fff8db" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>

          {/* Double Concentric Gold Rings */}
          <circle cx="50" cy="50" r="46" stroke="url(#goldMetallic)" strokeWidth="2.2" />
          <circle cx="50" cy="50" r="42" stroke="url(#goldMetallic)" strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />

          {/* Golden Royal Crown */}
          <g transform="translate(30, 14) scale(0.4)">
            {/* Crown Base */}
            <path
              d="M10 50 L20 70 L80 70 L90 50 L75 35 L50 60 L25 35 Z"
              fill="url(#goldMetallic)"
            />
            {/* Crown Peaks */}
            <path
              d="M15 55 L30 15 L50 45 L70 15 L85 55 Z"
              fill="url(#goldShine)"
            />
            {/* Jewels */}
            <circle cx="30" cy="12" r="4" fill="#ffffff" stroke="#ffd700" strokeWidth="1" />
            <circle cx="50" cy="8" r="5" fill="#ffffff" stroke="#ffd700" strokeWidth="1" />
            <circle cx="70" cy="12" r="4" fill="#ffffff" stroke="#ffd700" strokeWidth="1" />
          </g>

          {/* M.N.R Central Bold Monogram */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="url(#goldMetallic)"
            fontFamily="'Cinzel', 'Playfair Display', serif"
            fontWeight="900"
            fontSize="18.5"
            letterSpacing="1"
          >
            M.N.R
          </text>

          {/* Smartphone Outline Icon in Center Base */}
          <g transform="translate(42.5, 60)">
            <rect
              x="0"
              y="0"
              width="15"
              height="23"
              rx="2.5"
              stroke="url(#goldMetallic)"
              strokeWidth="1.4"
              fill="#0a0a0a"
            />
            {/* Screen Notch & Home Button */}
            <circle cx="7.5" cy="19.5" r="1.2" fill="url(#goldMetallic)" />
            <line x1="5" y1="2.5" x2="10" y2="2.5" stroke="url(#goldMetallic)" strokeWidth="0.9" strokeLinecap="round" />
          </g>

          {/* Decorative Wings / Laurels flanking the phone */}
          <path
            d="M20 66 C26 73, 34 76, 40 76 C35 73, 29 70, 24 64 Z"
            fill="url(#goldMetallic)"
          />
          <path
            d="M80 66 C74 73, 66 76, 60 76 C65 73, 71 70, 76 64 Z"
            fill="url(#goldMetallic)"
          />
        </svg>
      </div>

      {/* Typography Block */}
      {showSubtitle && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-wider gold-gradient-text ${current.text}`}>
              M.N.R
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          </div>
          <span className={`text-[#d0c5af] font-medium tracking-tight ${current.sub}`}>
            مركز المنار للموبايل
          </span>
        </div>
      )}
    </div>
  );
};
