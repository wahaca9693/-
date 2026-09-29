import React from 'react';
import { Truck, ShieldCheck, ArrowLeft, Banknote, Sparkles, Smartphone, Zap } from 'lucide-react';
import phonesHeroImg from '../assets/images/phones_hero_showcase_1790717437900.jpg';
import chargersHeroImg from '../assets/images/chargers_hero_showcase_1790717448264.jpg';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts: () => void;
  onOpenTracking: () => void;
  onSelectCategory?: (category: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onShopNow, 
  onOpenTracking,
  onSelectCategory 
}) => {
  return (
    <section id="hero" className="relative px-3 sm:px-6 lg:px-8 pt-2 pb-6 text-right">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Main Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#17140e] via-[#100f0b] to-[#080808] border border-[#2d281c] p-5 sm:p-8 md:p-10 overflow-hidden shadow-2xl">
          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Info Side */}
            <div className="space-y-4 max-w-2xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الوكيل الرسمي المعتمد • كفالة 12 شهراً مع استبدال فوري</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#f5f5f7] tracking-tight leading-tight">
                كل ما تحتاجه لعالم <span className="gold-gradient-text">الموبايل الذكي</span> في مكان واحد
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-[#a1a1a6] leading-relaxed">
                أحدث هواتف آبل وسامسونج، شواحن GaN فائقة السرعة، سماعات أصلية وكافة ملحقات الموبايل بأفضل الأسعار الرسمية بالدينار العراقي.
              </p>

              {/* Reassuring Cash on Delivery & Delivery Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141414] border border-[#30d158]/30 text-xs text-[#f5f5f7]">
                  <div className="w-7 h-7 rounded-lg bg-[#30d158]/15 text-[#30d158] flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#30d158] block">الدفع نقداً (كاش) عند الاستلام</span>
                    <span className="text-[11px] text-[#8e8e93]">عاين الطلب وافحصه قبل دفع أي دينار</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141414] border border-[#ffd700]/30 text-xs text-[#f5f5f7]">
                  <div className="w-7 h-7 rounded-lg bg-[#ffd700]/15 text-[#ffd700] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#ffd700] block">توصيل 5,000 د.ع ثابت</span>
                    <span className="text-[11px] text-[#8e8e93]">شحن سريع لكافة محافظات العراق الـ 19</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onShopNow}
                  className="h-12 px-7 rounded-xl bg-[#ffd700] hover:bg-[#e6c200] text-[#0a0a0a] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(255,215,0,0.35)] active:scale-95 transition-all cursor-pointer"
                >
                  <span>تسوق الآن (الدفع عند الاستلام)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenTracking}
                  className="h-12 px-5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-[#d4af37] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>تتبع طلبك بالرقم</span>
                </button>
              </div>
            </div>

            {/* Visual Photography Card */}
            <div className="w-full lg:w-96 rounded-2xl overflow-hidden bg-[#0a0a0a] border border-[#333] shadow-2xl relative group">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={phonesHeroImg}
                  alt="M.N.R Flagship Phones Showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#ffd700] text-[#0a0a0a] text-xs font-black shadow-md">
                  أصلي 100% مختوم
                </div>
              </div>

              <div className="p-4 bg-[#0e0e0e] border-t border-[#222] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#f5f5f7]">هواتف آبل وسامسونج الرائدة</h4>
                  <p className="text-[11px] text-[#8e8e93]">تبدأ من 1,480,000 د.ع مع ضمان سنة</p>
                </div>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('phones')}
                  className="px-3 py-1.5 rounded-lg bg-[#ffd700]/15 hover:bg-[#ffd700] text-[#ffd700] hover:text-[#0a0a0a] text-xs font-bold transition-all cursor-pointer"
                >
                  استعراض الهواتف
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Curated Spotlights: 1. Flagship Phones Spotlight & 2. High-speed GaN Chargers Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spotlight 1: Phones */}
          <div 
            onClick={() => onSelectCategory && onSelectCategory('phones')}
            className="group relative rounded-2xl bg-gradient-to-br from-[#14120c] to-[#0c0c0c] border border-[#2b2518] hover:border-[#ffd700]/60 p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ffd700]">
                  <Smartphone className="w-4 h-4" />
                  <span>قسم الهواتف الذكية الرائدة</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#f5f5f7] group-hover:text-[#ffd700] transition-colors">
                  iPhone 17 Pro Max & Galaxy S26 Ultra
                </h3>
                <p className="text-xs text-[#8e8e93] line-clamp-2">
                  معالجات A19 Pro و Snapdragon 8 Gen 4، شاشات تيتانيوم 120Hz وكاميرات احترافية مع كفالة رسمية.
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-xs text-[#8e8e93]">الأسعار تبدأ من:</span>
                  <span className="text-base font-black text-[#ffd700]">1,480,000 د.ع</span>
                </div>
              </div>

              <div className="w-28 sm:w-36 h-28 sm:h-32 rounded-xl overflow-hidden bg-[#070707] border border-[#262626] shrink-0">
                <img
                  src={phonesHeroImg}
                  alt="Phones Showcase"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Spotlight 2: Chargers & Powerbanks */}
          <div 
            onClick={() => onSelectCategory && onSelectCategory('chargers')}
            className="group relative rounded-2xl bg-gradient-to-br from-[#14120c] to-[#0c0c0c] border border-[#2b2518] hover:border-[#ffd700]/60 p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ffd700]">
                  <Zap className="w-4 h-4" />
                  <span>قسم الشواحن الذكية و GaN</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#f5f5f7] group-hover:text-[#ffd700] transition-colors">
                  شواحن أنكر وآبل الأصلية فائقة السرعة
                </h3>
                <p className="text-xs text-[#8e8e93] line-clamp-2">
                  تقنيات GaN III بقدرات 35W, 65W, و 120W مع أمان فائق وحماية للبطارية من الحرارة الزائدة.
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-xs text-[#8e8e93]">الأسعار تبدأ من:</span>
                  <span className="text-base font-black text-[#ffd700]">45,000 د.ع</span>
                </div>
              </div>

              <div className="w-28 sm:w-36 h-28 sm:h-32 rounded-xl overflow-hidden bg-[#070707] border border-[#262626] shrink-0">
                <img
                  src={chargersHeroImg}
                  alt="Chargers Showcase"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
