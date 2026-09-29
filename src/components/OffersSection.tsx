import React, { useState, useEffect } from 'react';
import { Offer } from '../types/store';
import { Flame, Copy, Check, Sparkles, Clock, Tag } from 'lucide-react';

interface OffersSectionProps {
  offers: Offer[];
  onApplyCategoryFilter: (category: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  onApplyCategoryFilter,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Deals Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1c180e] via-[#251e0f] to-[#14120c] border border-[#d4af37]/35 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col text-right space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-xs font-black self-start">
                <Flame className="w-4 h-4 text-[#ffd700] animate-bounce" />
                <span>عروض التوفير الذهبية الحصرية</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-[#f5f5f7]">
                خصومات فورية تصل إلى <span className="gold-gradient-text">25%</span> على الشواحن والإكسسوارات
              </h2>
              <p className="text-xs sm:text-sm text-[#d0c5af]">
                استخدم أكواد الخصم عند الدفع وتمتع بأسعار الجملة لجميع المحافظات مع شحن ثابت 5,000 د.ع
              </p>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-[#d0c5af]">
                <Clock className="w-4 h-4 text-[#ffd700]" />
                <span>ينتهي العرض الاستثنائي خلال:</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black" dir="ltr">
                <div className="px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[#ffd700]">:</span>
                <div className="px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[#ffd700]">:</span>
                <div className="px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Active Promo Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-[#d4af37]/20">
            {offers.map((off) => (
              <div
                key={off.id}
                className="p-4 rounded-2xl bg-[#0e0e0e]/80 border border-[#d4af37]/25 flex items-center justify-between gap-3 text-right"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                    <span className="font-bold text-xs text-[#f5f5f7] truncate">{off.title}</span>
                  </div>
                  <p className="text-[11px] text-[#99907c] truncate">{off.description}</p>
                  <span className="text-[11px] font-bold text-[#ffd700]">
                    خصم {off.discountValue} {off.discountType === 'percentage' ? '%' : 'د.ع'}
                  </span>
                </div>

                {off.code && (
                  <button
                    onClick={() => copyCode(off.code!)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#1c180e] hover:bg-[#282215] border border-[#d4af37]/40 text-[#ffd700] shrink-0 active:scale-95 transition-all"
                    title="نسخ كود الخصم"
                  >
                    <span className="font-mono text-xs font-bold">{off.code}</span>
                    <span className="text-[9px] text-[#99907c] flex items-center gap-1 mt-0.5">
                      {copiedCode === off.code ? (
                        <>
                          <Check className="w-3 h-3 text-[#30d158]" />
                          <span className="text-[#30d158]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ</span>
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
