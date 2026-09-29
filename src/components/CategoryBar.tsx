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
  LayoutGrid,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

interface CategoryBarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  totalProductsCount: number;
}

const ICONS: Record<string, React.ElementType> = {
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
}) => (
  <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-32">
    <SectionHeader
      eyebrow="الأقسام الرئيسية"
      eyebrowIcon={LayoutGrid}
      title="تصفّح حسب قسم المنتجات"
      description="اختر القسم لعرض الأجهزة الأصلية المتوفرة حالياً مع الضمان والفحص قبل الدفع."
      className="mb-6"
      action={
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`mnr-btn h-10 ${
            selectedCategory === 'all' ? 'mnr-btn-primary' : 'mnr-btn-soft'
          }`}
        >
          <span>عرض الكل ({totalProductsCount})</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      }
    />

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {CATEGORIES_LIST.map((cat) => {
        const selected = selectedCategory === cat.id;
        const Icon = ICONS[cat.id] || LayoutGrid;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={selected}
            className={`group relative text-right rounded-2xl border p-4 overflow-hidden transition-all duration-300 ${
              selected
                ? 'border-brand bg-brand-soft shadow-card'
                : 'border-line bg-surface hover:border-brand/40 hover:shadow-card'
            }`}
          >
            {/* صورة خلفية خافتة */}
            <img
              src={cat.image}
              alt=""
              aria-hidden="true"
              className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full object-cover opacity-10 blur-[2px] transition-transform duration-500 group-hover:scale-125 group-hover:opacity-20"
            />

            <div className="relative flex items-start justify-between gap-2">
              <span
                className={`w-11 h-11 rounded-xl grid place-items-center transition-colors ${
                  selected
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-2 text-brand-ink group-hover:bg-brand-soft'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              {selected ? (
                <span className="w-6 h-6 rounded-full bg-brand text-on-brand grid place-items-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              ) : (
                <span className="mnr-badge mnr-badge-neutral">{cat.badge}</span>
              )}
            </div>

            <div className="relative mt-3">
              <h3
                className={`text-sm sm:text-[15px] font-extrabold ${
                  selected ? 'text-brand-ink' : 'text-ink'
                }`}
              >
                {cat.name}
              </h3>
              <p className="text-[11px] text-ink-3 mt-1 line-clamp-1">{cat.subtitle}</p>

              <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between">
                <span className="text-[11px] text-ink-3">{cat.count} منتج</span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-bold ${
                    selected ? 'text-brand-ink' : 'text-ink-3 group-hover:text-brand-ink'
                  } transition-colors`}
                >
                  استعراض
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </section>
);
