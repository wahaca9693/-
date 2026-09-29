import React from 'react';
import { ProductCategory } from '../types/store';
import { CATEGORIES_LIST } from '../data/initialData';
import { Smartphone, Headphones, Zap, BatteryCharging, Cable, Shield, Watch, Wrench, Sparkles, Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  totalProductsCount: number;
}

const CATEGORY_DETAILS: Record<string, { subtitle: string; icon: React.ElementType }> = {
  phones: { subtitle: 'Apple & Samsung', icon: Smartphone },
  audio: { subtitle: 'ANC & Hi-Res صـوت', icon: Headphones },
  chargers: { subtitle: 'GaN 65W & 100W', icon: Zap },
  powerbanks: { subtitle: 'MagSafe لاسلكي', icon: BatteryCharging },
  cables: { subtitle: 'مضفر فائق المتانة', icon: Cable },
  cases: { subtitle: 'جلد طبيعي & حماية 9H', icon: Shield },
  watches: { subtitle: 'تيتانيوم وكريستال', icon: Watch },
  accessories: { subtitle: 'أدوات صيانة ومحطات', icon: Wrench },
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  return (
    <div className="w-full space-y-6 text-right">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#d4af37]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700] mb-2">
            <Layers className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>تصنيفات المتجر المنظمة</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[#f5f5f7]">
            استكشف <span className="gold-gradient-text">أقسام المنتجات الفاخرة</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#99907c] mt-1">
            اختر القسم لتصفية المنتجات مباشرة مع تفاصيل الأسعار بالدينار العراقي
          </p>
        </div>

        {/* Quick Filter Reset */}
        <div className="flex items-center gap-2">
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-[#ffd700] hover:underline bg-[#1c180e] px-3 py-1.5 rounded-xl border border-[#d4af37]/30 transition-all active:scale-95"
            >
              عرض كافة الأقسام (الكل)
            </button>
          )}
          <span className="text-xs text-[#d0c5af] bg-[#141414] px-3 py-1.5 rounded-xl border border-[#d4af37]/15">
            {totalProductsCount} منتج متاح
          </span>
        </div>
      </div>

      {/* 1. Fast Horizontal Pill Tabs with Motion Transitions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 h-11 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-105'
              : 'bg-[#121212] hover:bg-[#1c180e] text-[#d0c5af] hover:text-[#ffd700] border border-[#d4af37]/20 hover:border-[#d4af37]/50'
          }`}
        >
          <span>✨</span>
          <span>كل الأقسام</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedCategory === 'all' ? 'bg-[#0a0a0a] text-[#ffd700]' : 'bg-[#1e1e1e] text-[#99907c]'
            }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`flex-shrink-0 h-11 px-4 sm:px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-105'
                  : 'bg-[#121212] hover:bg-[#1c180e] text-[#d0c5af] hover:text-[#ffd700] border border-[#d4af37]/20 hover:border-[#d4af37]/50'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-[#0a0a0a] text-[#ffd700]' : 'bg-[#1c1b1b] text-[#99907c]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Structured & Well-Organized Visual Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {CATEGORIES_LIST.map((cat) => {
          const details = CATEGORY_DETAILS[cat.id] || { subtitle: '', icon: Smartphone };
          const IconComp = details.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`group flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 text-center cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-[#221c0e] to-[#121008] border-2 border-[#ffd700] shadow-[0_0_25px_rgba(212,175,55,0.35)] -translate-y-1'
                  : 'bg-[#121212] hover:bg-[#18150c] border border-[#d4af37]/20 hover:border-[#ffd700]/50 hover:-translate-y-1 shadow-md'
              }`}
            >
              {/* Golden Ambient Particle Glow on Active */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffd700]/15 rounded-full blur-xl pointer-events-none" />
              )}

              {/* Icon Container with Hover Animation */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-110 ${
                  isSelected
                    ? 'bg-[#ffd700] text-[#0a0a0a] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                    : 'bg-[#181818] text-[#ffd700] border border-[#d4af37]/25 group-hover:bg-[#d4af37]/20 group-hover:border-[#ffd700]/50'
                }`}
              >
                <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              {/* Title & Subtitle */}
              <div className="w-full">
                <span
                  className={`text-xs sm:text-sm font-bold block truncate transition-colors ${
                    isSelected ? 'text-[#ffd700]' : 'text-[#f5f5f7] group-hover:text-[#ffd700]'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#99907c] block truncate mt-0.5 font-medium">
                  {details.subtitle}
                </span>
              </div>

              {/* Badge Count */}
              <div className="mt-2 pt-1.5 border-t border-[#d4af37]/15 w-full flex items-center justify-center">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#ffd700]/25 text-[#ffd700]'
                      : 'bg-[#181818] text-[#99907c] group-hover:text-[#d0c5af]'
                  }`}
                >
                  {cat.count} موديل
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
