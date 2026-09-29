import React from 'react';
import { ProductCategory } from '../types/store';
import { CATEGORIES_LIST } from '../data/initialData';
import { Smartphone, Headphones, Zap, BatteryCharging, Cable, Shield, Watch, Wrench, ArrowUpLeft } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  totalProductsCount: number;
}

const CATEGORY_ITEMS: {
  id: ProductCategory;
  name: string;
  desc: string;
  icon: React.ElementType;
  count: number;
  gradient: string;
}[] = [
  {
    id: 'phones',
    name: 'الهواتف الذكية',
    desc: 'أحدث هواتف Apple و Samsung الأصلية',
    icon: Smartphone,
    count: 18,
    gradient: 'from-[#1e190e] to-[#0f0e0a]',
  },
  {
    id: 'audio',
    name: 'السماعات والصوتيات',
    desc: 'عزل ضجيج وصوت نقي فائق الجودة',
    icon: Headphones,
    count: 14,
    gradient: 'from-[#181611] to-[#0e0d0b]',
  },
  {
    id: 'chargers',
    name: 'الشواحن السريعة GaN',
    desc: 'شواحن ذكية 65W و 100W متعددة المنافذ',
    icon: Zap,
    count: 22,
    gradient: 'from-[#1a170f] to-[#0d0c0a]',
  },
  {
    id: 'powerbanks',
    name: 'البطاريات المتنقلة',
    desc: 'MagSafe وشحن لاسلكي فائق السعة',
    icon: BatteryCharging,
    count: 12,
    gradient: 'from-[#171510] to-[#0d0c09]',
  },
  {
    id: 'cases',
    name: 'الكفرات وحمايات الشاشة',
    desc: 'جلد طبيعي، حماية 9H، وكفرات MagSafe',
    icon: Shield,
    count: 25,
    gradient: 'from-[#1a1710] to-[#0e0d0a]',
  },
  {
    id: 'watches',
    name: 'الساعات الذكية',
    desc: 'ساعات رياضية وصحية بهياكل تيتانيوم',
    icon: Watch,
    count: 9,
    gradient: 'from-[#16140e] to-[#0c0b08]',
  },
  {
    id: 'cables',
    name: 'الكيبلات والوصلات',
    desc: 'كيبلات مضفرة مدرعة تتحمل أقصى استهلاك',
    icon: Cable,
    count: 16,
    gradient: 'from-[#17150f] to-[#0c0b09]',
  },
  {
    id: 'accessories',
    name: 'معدات وأدوات الصيانة',
    desc: 'محطات حرارية وطقوم مفكات دقيقة للفنيين',
    icon: Wrench,
    count: 15,
    gradient: 'from-[#191610] to-[#0d0c09]',
  },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  return (
    <div className="w-full space-y-6 text-right">
      {/* Section Header with Refined Typography */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#222]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f7] tracking-tight">
            أقسام المتجر الرئيسية
          </h2>
          <p className="text-xs text-[#8e8e93] mt-0.5">
            تصفح التشكيلة بحسب الفئة مع كامل تفاصيل المواصفات والأسعار
          </p>
        </div>

        {selectedCategory !== 'all' ? (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs text-[#ffd700] hover:underline font-medium self-start sm:self-auto"
          >
            عرض كافة الأقسام (الكل) ←
          </button>
        ) : (
          <span className="text-xs text-[#8e8e93]">
            {totalProductsCount} منتج متوفر
          </span>
        )}
      </div>

      {/* Spacious 4-Column Modern Category Grid (2 on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {CATEGORY_ITEMS.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group text-right p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[125px] sm:min-h-[140px] cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#241d0e] to-[#121008] border-[#ffd700] shadow-[0_8px_25px_rgba(212,175,55,0.2)]'
                  : 'bg-gradient-to-br ' + cat.gradient + ' border-[#26241e] hover:border-[#d4af37]/60 hover:shadow-lg'
              }`}
            >
              {/* Header Icon & Count */}
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#ffd700] text-[#0a0a0a]'
                      : 'bg-[#181818] text-[#ffd700] border border-[#d4af37]/20 group-hover:bg-[#d4af37]/15 group-hover:border-[#ffd700]/40'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#8e8e93] group-hover:text-[#ffd700] transition-colors">
                  <span>{cat.count} منتج</span>
                  <ArrowUpLeft className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3
                  className={`text-sm sm:text-base font-bold transition-colors ${
                    isSelected ? 'text-[#ffd700]' : 'text-[#f5f5f7] group-hover:text-[#ffd700]'
                  }`}
                >
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#8e8e93] line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
