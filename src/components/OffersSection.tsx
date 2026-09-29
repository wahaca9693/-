import React, { useEffect, useState } from 'react';
import { Offer } from '../types/store';
import { Flame, Copy, Check, Clock, Tag, Gift } from 'lucide-react';
import { formatNumber } from '../lib/format';

interface OffersSectionProps {
  offers: Offer[];
  onApplyCategoryFilter: (category: string) => void;
}

const DURATION_HOURS = 12;

export const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_HOURS * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? DURATION_HOURS * 3600 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(code);
    setTimeout(() => setCopied(null), 2200);
  };

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (offers.length === 0) return null;

  return (
    <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-32">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {/* توهّج دافئ */}
        <div
          className="absolute -top-24 -left-16 w-80 h-80 rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--mnr-gold) 0%, transparent 70%)' }}
        />

        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <span className="mnr-badge mnr-badge-gold mb-2.5">
                <Flame className="w-3.5 h-3.5" />
                عروض التوفير
              </span>
              <h2 className="mnr-h2 text-xl sm:text-2xl text-ink">
                خصومات فورية تصل إلى <span className="mnr-gradient-text">25%</span> على الشواحن والإكسسوارات
              </h2>
              <p className="text-sm text-ink-2 mt-1.5">
                انسخ كود الخصم عند الدفع واستمتع بأسعار الجملة مع شحن ثابت 5,000 د.ع.
              </p>
            </div>

            <div className="shrink-0">
              <p className="flex items-center gap-1.5 text-[11px] text-ink-3 mb-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                ينتهي العرض خلال
              </p>
              <div dir="ltr" className="flex items-center gap-1.5">
                {[hh, mm, ss].map((value, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-gold font-extrabold mnr-num">:</span>}
                    <span className="mnr-num min-w-[3.25rem] text-center py-2 px-1.5 rounded-lg bg-surface-2 border border-line text-lg font-extrabold text-ink">
                      {value}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-line">
            {offers.map((offer) => (
              <li
                key={offer.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-line bg-surface-2"
              >
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
                    <Gift className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{offer.title}</span>
                  </h3>
                  <p className="text-[11px] text-ink-3 mt-1 line-clamp-1">{offer.description}</p>
                  <p className="text-[11px] font-extrabold text-success mt-1">
                    خصم {formatNumber(offer.discountValue)}{' '}
                    {offer.discountType === 'percentage' ? '%' : 'د.ع'}
                  </p>
                </div>

                {offer.code && (
                  <button
                    type="button"
                    onClick={() => copyCode(offer.code as string)}
                    className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-brand/30 bg-brand-soft text-brand-ink hover:bg-brand hover:text-on-brand transition-colors"
                  >
                    <span className="mnr-num text-xs font-extrabold">{offer.code}</span>
                    <span className="flex items-center gap-1 text-[9px]">
                      {copied === offer.code ? (
                        <>
                          <Check className="w-3 h-3" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          نسخ
                        </>
                      )}
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
