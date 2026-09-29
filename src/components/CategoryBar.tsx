import React from 'react';
import { ProductCategory } from '../types/store';
import { CATEGORIES_LIST } from '../data/initialData';
import { 
  Smartphone, 
  Headphones, 
  Zap, 
  BatteryCharging, 
  Cable, 
  Shield, 
  Watch, 
  Wrench, 
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  totalProductsCount: number;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  phones: Smartphone,
  chargers: Zap,
  powerbanks: BatteryCharging,
  audio: Headphones,
  cases: Shield,
  watches: Watch,
  cables: Cable,
  accessories: Wrench,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  return (
    <div className="w-full text-right space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#222]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>الأقسام الرئيسية للمتجر</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f5f5f7] tracking-tight">
            تصفح حسب قسم المنتجات
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8e93] mt-1">
            اختر القسم للاطلاع على أحدث الأجهزة الأصلية المتوفرة حالياً بالضمان
          </p>
        </div>

        {/* View All Button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#ffd700] text-[#0a0a0a] shadow-[0_2px_12px_rgba(255,215,0,0.3)]'
              : 'bg-[#151515] hover:bg-[#1f1f1f] text-[#d4af37] border border-[#333]'
          }`}
        >
          <span>عرض كل المنتجات ({totalProductsCount})</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Large, Organized Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = CATEGORY_ICON_MAP[cat.id] || Sparkles;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden text-right select-none group ${
                isSelected
                  ? 'bg-gradient-to-b from-[#241f10] to-[#141209] border-2 border-[#ffd700] shadow-[0_4px_25px_rgba(212,175,55,0.25)] scale-[1.02]'
                  : 'bg-[#111111] hover:bg-[#161616] border border-[#262626] hover:border-[#ffd700]/50 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Background ambient subtle image preview */}
              <div className="absolute -bottom-8 -left-8 w-28 h-28 opacity-15 pointer-events-none transition-transform duration-500 group-hover:scale-125">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full filter blur-[1px]"
                />
              </div>

              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between mb-3 z-10">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#ffd700] text-[#0a0a0a] shadow-md'
                      : 'bg-[#1a1a1a] text-[#ffd700] group-hover:bg-[#ffd700]/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#ffd700]/30 text-[#ffd700]'
                      : 'bg-[#1e1e1e] text-[#a1a1a6] group-hover:text-[#ffd700]'
                  }`}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Content */}
              <div className="z-10 mt-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isSelected ? 'text-[#ffd700]' : 'text-[#f5f5f7] group-hover:text-[#ffd700]'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#ffd700] text-[#0a0a0a] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#8e8e93] line-clamp-1 mt-1 group-hover:text-[#b0b0b5] transition-colors">
                  {cat.subtitle}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-[11px]">
                  <span className="text-[#a1a1a6]">{cat.count} منتج متوفر</span>
                  <span
                    className={`font-bold transition-colors flex items-center gap-1 ${
                      isSelected ? 'text-[#ffd700]' : 'text-[#636366] group-hover:text-[#ffd700]'
                    }`}
                  >
                    <span>استعراض</span>
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
