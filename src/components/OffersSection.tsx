import React, { useState, useEffect } from 'react';
import { Offer } from '../types/store';
import { Flame, Copy, Check, Clock, Tag } from 'lucide-react';

interface OffersSectionProps {
  offers: Offer[];
  onApplyCategoryFilter: (category: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
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
    <section id="offers" className="py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Deals Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#17140c] via-[#201a0e] to-[#121008] border border-[#d4af37]/30 p-5 sm:p-7 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex flex-col text-right space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#ffd700]/15 text-[#ffd700] text-xs font-bold self-start">
                <Flame className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>عروض التوفير الذهبية</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#f5f5f7]">
                خصومات فورية تصل إلى <span className="gold-gradient-text">25%</span> على الشواحن والإكسسوارات
              </h2>
              <p className="text-xs text-[#a1a1a6]">
                استخدم أكواد الخصم عند الدفع وتمتع بأسعار الجملة لجميع المحافظات مع شحن ثابت 5,000 د.ع
              </p>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93]">
                <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>ينتهي العرض الخاص خلال:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-lg sm:text-xl font-bold" dir="ltr">
                <div className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[#ffd700]">:</span>
                <div className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[#ffd700]">:</span>
                <div className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/30 text-[#ffd700]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Active Promo Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#26241e]">
            {offers.map((off) => (
              <div
                key={off.id}
                className="p-3.5 rounded-xl bg-[#0a0a0a]/90 border border-[#2a2720] flex items-center justify-between gap-3 text-right"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                    <span className="font-bold text-xs text-[#f5f5f7] truncate">{off.title}</span>
                  </div>
                  <p className="text-[11px] text-[#8e8e93] truncate">{off.description}</p>
                  <span className="text-[11px] font-bold text-[#ffd700]">
                    خصم {off.discountValue} {off.discountType === 'percentage' ? '%' : 'د.ع'}
                  </span>
                </div>

                {off.code && (
                  <button
                    onClick={() => copyCode(off.code!)}
                    className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-[#18150c] hover:bg-[#221c0e] border border-[#d4af37]/30 text-[#ffd700] shrink-0 active:scale-95 transition-all cursor-pointer"
                    title="نسخ كود الخصم"
                  >
                    <span className="font-mono text-xs font-bold">{off.code}</span>
                    <span className="text-[9px] text-[#8e8e93] flex items-center gap-1 mt-0.5">
                      {copiedCode === off.code ? (
                        <>
                          <Check className="w-3 h-3 text-[#30d158]" />
                          <span className="text-[#30d158]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ الكود</span>
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
