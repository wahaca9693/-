import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Truck, ArrowLeft, Star, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts: () => void;
  onOpenTracking: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onExploreProducts,
  onOpenTracking,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-16 text-right">
      {/* Subtle Ambient Studio Glow */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Info Column (Span 7) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-5">
            {/* Top Verification Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#14120c] border border-[#d4af37]/30 text-xs text-[#ffd700]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              <span className="font-medium">الوكيل المعتمد والضمان الذهبي الرسمي في العراق</span>
            </div>

            {/* Typography with Balanced, Modern Proportion */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#f5f5f7] leading-[1.3] tracking-tight">
                كل ما تحتاجه لعالم{' '}
                <span className="gold-gradient-text">الموبايل</span>{' '}
                في مكان واحد
              </h1>

              <p className="text-sm sm:text-base text-[#a1a1a6] leading-relaxed max-w-xl font-normal pt-1">
                هواتف أصلية مختومة، سماعات، شواحن وإكسسوارات مختارة بعناية وبأسعار مميزة مع خدمة التوصيل المباشر لكافة محافظات العراق.
              </p>
            </div>

            {/* Structured Trust Points */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg pt-1">
              <div className="p-3 rounded-xl bg-[#0f0f0f] border border-[#d4af37]/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#f5f5f7] block">توصيل 5,000 د.ع</span>
                  <span className="text-[11px] text-[#8e8e93]">ثابت لكافة المحافظات</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0f0f0f] border border-[#d4af37]/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#f5f5f7] block">ضمان رسمي 12 شهر</span>
                  <span className="text-[11px] text-[#8e8e93]">معاينة وفحص قبل الدفع</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={onShopNow}
                className="h-11 px-7 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>تسوق الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProducts}
                className="h-11 px-6 rounded-xl bg-[#141414] hover:bg-[#1a160d] border border-[#d4af37]/30 text-[#e5e2e1] hover:text-[#ffd700] font-semibold text-sm transition-all active:scale-95 cursor-pointer"
              >
                استكشف الأقسام
              </button>
            </div>
          </div>

          {/* Right Product Spotlight Showcase (Span 5) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#0e0e0e] border border-[#d4af37]/25 p-4 sm:p-5 shadow-xl relative overflow-hidden group">
              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-[#070707] flex items-center justify-center border border-[#d4af37]/15">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuxKn7zDiW949R7yC1ROc3aot8GuFUou759KVP_5DAje-j_RyRIfqVE69hM6HkA6e2Rww9dhPIGva7TQOKwwljA9YEEFCyR-y7Pm9Pb0OskC4wYxQZyZsYuuI_8A2M_Sdjwc6p8uho8lYyrq5zvHldKNRlQF0G9mTgrlANMy4LDOq2hbs9h7xY2oveUcq7IW30EGVWF50kfTSs4rqQCoR66JWXul1B8mN6RjCyEL0zkjAgtqqY3BC"
                  alt="M.N.R Flagship Phones"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-75" />

                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between p-2.5 rounded-lg bg-[#0e0e0e]/90 backdrop-blur-md border border-[#d4af37]/20 text-xs">
                  <div>
                    <span className="font-bold text-[#ffd700] block">iPhone 17 Pro Max & S26 Ultra</span>
                    <span className="text-[11px] text-[#8e8e93]">أصلي رسمي مختوم من الوكالة</span>
                  </div>
                  <button
                    onClick={onShopNow}
                    className="px-3 py-1 rounded bg-[#d4af37] text-[#0a0a0a] font-bold text-xs hover:brightness-105 transition-colors"
                  >
                    عرض الأجهزة
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
