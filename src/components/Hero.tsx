import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Truck, Sparkles, ArrowLeft, Star, Award, Zap } from 'lucide-react';

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
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Volumetric Gold Glows */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)] blur-[90px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-10 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Right Column: Hero Typography & Value Proposition (RTL First) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right space-y-6">
            {/* Top Brand Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#18150c] border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
              <span className="text-xs font-bold text-[#ffd700] tracking-wide">
                الوكيل الحصري والضمان الماسي في العراق
              </span>
              <Award className="w-3.5 h-3.5 text-[#ffd700]" />
            </div>

            {/* Official Logo Banner & Headings */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Logo size="lg" showSubtitle={false} />
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black gold-gradient-text tracking-widest">
                    M.N.R
                  </span>
                  <span className="text-sm font-semibold text-[#d0c5af]">
                    مركز المنار للموبايل
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#f5f5f7] leading-[1.25] tracking-tight">
                كل ما تحتاجه لعالم{' '}
                <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(212,175,55,0.35)]">
                  الموبايل
                </span>{' '}
                في مكان واحد
              </h1>

              <p className="text-base sm:text-lg text-[#d0c5af] leading-relaxed max-w-2xl font-normal pt-1">
                هواتف أصلية، سماعات، شواحن وإكسسوارات مختارة بعناية وبأسعار مميزة مع كفالة استبدال فورية وتوصيل سريع لكافة المحافظات.
              </p>
            </div>

            {/* Delivery & Trust Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full pt-1">
              {/* Box 1 */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#121212] border border-[#d4af37]/25 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#1e1b12] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#ffd700] truncate">توصيل 5,000 د.ع</span>
                  <span className="text-[11px] text-[#99907c] truncate">لكافة محافظات العراق</span>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#121212] border border-[#d4af37]/25 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#1e1b12] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#ffd700] truncate">ضمان ذهبي 12 شهر</span>
                  <span className="text-[11px] text-[#99907c] truncate">فحص واستبدال فوري</span>
                </div>
              </div>

              {/* Box 3 */}
              <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 rounded-2xl bg-[#121212] border border-[#d4af37]/25 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#1e1b12] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#ffd700] truncate">معاينة قبل الدفع</span>
                  <span className="text-[11px] text-[#99907c] truncate">نقد عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={onShopNow}
                className="flex-1 sm:flex-initial h-13 px-8 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>تسوق الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreProducts}
                className="flex-1 sm:flex-initial h-13 px-7 rounded-xl bg-[#141414] hover:bg-[#1a160d] border border-[#d4af37]/40 text-[#f5f5f7] hover:text-[#ffd700] font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>استكشف المنتجات</span>
              </button>
            </div>
          </div>

          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#181818] via-[#0f0f0f] to-[#080808] border border-[#d4af37]/30 p-4 sm:p-6 shadow-2xl overflow-hidden group">
              {/* Golden Ambient Particle Backlight */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ffd700]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Tag & Rating Pill */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#ffd700] text-[#0a0a0a] font-extrabold text-xs shadow-[0_0_12px_rgba(255,215,0,0.5)]">
                  وصول جديد • 2026
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1b1b]/80 border border-[#d4af37]/30 text-xs text-[#ffd700]">
                  <Star className="w-3.5 h-3.5 fill-[#ffd700] text-[#ffd700]" />
                  <span className="font-bold">4.9</span>
                  <span className="text-[#a1a1a6] text-[10px]">(+1,200 زبون)</span>
                </div>
              </div>

              {/* Showcase Image */}
              <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden bg-[#050505] flex items-center justify-center border border-[#d4af37]/15">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuxKn7zDiW949R7yC1ROc3aot8GuFUou759KVP_5DAje-j_RyRIfqVE69hM6HkA6e2Rww9dhPIGva7TQOKwwljA9YEEFCyR-y7Pm9Pb0OskC4wYxQZyZsYuuI_8A2M_Sdjwc6p8uho8lYyrq5zvHldKNRlQF0G9mTgrlANMy4LDOq2hbs9h7xY2oveUcq7IW30EGVWF50kfTSs4rqQCoR66JWXul1B8mN6RjCyEL0zkjAgtqqY3BC"
                  alt="iPhone 17 Pro Max & Samsung Galaxy S26 Ultra"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

                {/* Overlaid Float Badges */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between p-3 rounded-xl bg-[#0d0d0d]/85 backdrop-blur-md border border-[#d4af37]/30">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#d4af37] font-bold">إصدارات القمة الفاخرة</span>
                    <span className="text-sm font-bold text-[#f5f5f7]">iPhone 17 Pro Max & S26 Ultra</span>
                  </div>
                  <button
                    onClick={onShopNow}
                    className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#ffd700] text-[#0d0d0d] font-bold text-xs active:scale-95 transition-all shadow-md"
                  >
                    شراء الآن
                  </button>
                </div>
              </div>

              {/* Bottom Quick Feature Strip */}
              <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs text-[#d0c5af]">
                <span>التوصيل متاح لبغداد وكافة المحافظات</span>
                <span className="font-mono text-[#ffd700] font-bold">5,000 د.ع</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
