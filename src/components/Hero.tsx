import React from 'react';
import {
  Truck,
  ShieldCheck,
  ArrowLeft,
  Banknote,
  Sparkles,
  Smartphone,
  Zap,
  Package,
  Star,
  Headphones,
} from 'lucide-react';
import phonesHeroImg from '../assets/images/phones_hero_showcase_1790717437900.jpg';
import chargersHeroImg from '../assets/images/chargers_hero_showcase_1790717448264.jpg';
import audioGearDisplayImg from '../assets/images/audio_gear_display_1790717469794.jpg';
import { formatIQD } from '../lib/format';

interface HeroProps {
  onShopNow: () => void;
  onOpenTracking: () => void;
  onSelectCategory?: (category: any) => void;
}

const TRUST_POINTS = [
  {
    icon: Banknote,
    title: 'الدفع كاش عند الاستلام',
    desc: 'عاين الطلب وافحصه قبل دفع أي دينار',
    tone: 'success' as const,
  },
  {
    icon: Truck,
    title: 'توصيل 5,000 د.ع ثابت',
    desc: 'شحن سريع لكافة محافظات العراق الـ 19',
    tone: 'brand' as const,
  },
];

const SPOTLIGHTS = [
  {
    id: 'phones',
    icon: Smartphone,
    eyebrow: 'قسم الهواتف الذكية الرائدة',
    title: 'iPhone 17 Pro Max و Galaxy S26 Ultra',
    desc: 'معالجات A19 Pro و Snapdragon، شاشات 120Hz وكاميرات احترافية مع كفالة رسمية.',
    price: 1480000,
    image: phonesHeroImg,
  },
  {
    id: 'chargers',
    icon: Zap,
    eyebrow: 'قسم الشواحن الذكية و GaN',
    title: 'شواحن أنكر وآبل الأصلية فائقة السرعة',
    desc: 'تقنيات GaN بقدرات 35W و 65W و 140W مع حماية فائقة للبطارية من الحرارة.',
    price: 45000,
    image: chargersHeroImg,
  },
  {
    id: 'audio',
    icon: Headphones,
    eyebrow: 'قسم السماعات والصوتيات',
    title: 'سماعات عازلة للصوت وأجهزة صوت استوديو',
    desc: 'عزل ضوضاء نشط، صوت محيطي 360° وأداء نقي مع كفالة الوكيل المعتمد.',
    price: 79000,
    image: audioGearDisplayImg,
  },
];

export const Hero: React.FC<HeroProps> = ({ onShopNow, onOpenTracking, onSelectCategory }) => (
  <section id="hero" className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-2">
    <div className="max-w-7xl mx-auto space-y-4">
      {/* البانر الرئيسي */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {/* توهّج الخلفية */}
        <div
          className="absolute -top-40 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(circle, var(--mnr-brand) 0%, var(--mnr-brand-2) 45%, transparent 70%)',
          }}
        />

        <div className="relative grid lg:grid-cols-12 gap-8 p-6 sm:p-10">
          {/* النص */}
          <div className="lg:col-span-7 space-y-5">
            <span className="mnr-badge mnr-badge-brand">
              <Sparkles className="w-3.5 h-3.5" />
              الوكيل الرسمي المعتمد • كفالة 12 شهراً
            </span>

            <h1 className="mnr-h1 text-[1.75rem] sm:text-4xl lg:text-5xl text-ink leading-[1.25]">
              كل ما تحتاجه لعالم <span className="mnr-gradient-text">الموبايل الذكي</span> في مكان واحد
            </h1>

            <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-xl">
              أحدث هواتف آبل وسامسونج، شواحن GaN فائقة السرعة، سماعات أصلية وكافة ملحقات
              الموبايل بأفضل الأسعار الرسمية بالدينار العراقي.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {TRUST_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-2 border border-line"
                  >
                    <span
                      className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${
                        point.tone === 'success'
                          ? 'bg-success-soft text-success'
                          : 'bg-brand-soft text-brand-ink'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold text-ink">{point.title}</p>
                      <p className="text-[11px] text-ink-3 mt-0.5">{point.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={onShopNow} className="mnr-btn mnr-btn-primary h-12 px-6 text-sm">
                <span>تسوّق الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button type="button" onClick={onOpenTracking} className="mnr-btn mnr-btn-soft h-12 px-5 text-sm">
                <Package className="w-4 h-4 text-brand-ink" />
                <span>تتبّع طلبك</span>
              </button>
            </div>
          </div>

          {/* الصورة */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-line bg-surface-2 group">
              <img
                src={phonesHeroImg}
                alt="متجر مركز المنار للموبايل"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/10 to-transparent" />

              <div className="absolute top-4 right-4">
                <span className="mnr-badge mnr-badge-gold bg-surface/90 backdrop-blur">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  أصلي 100% مختوم
                </span>
              </div>

              <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-surface/92 backdrop-blur border border-line">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-ink truncate">هواتف آبل وسامسونج الرائدة</h3>
                    <p className="text-[11px] text-ink-3 mt-0.5">تبدأ من {formatIQD(1480000)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectCategory?.('phones')}
                    className="mnr-btn mnr-btn-soft h-9 px-3 text-xs shrink-0"
                  >
                    استعراض
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الأقسام المميزة */}
      <div className="grid md:grid-cols-3 gap-4">
        {SPOTLIGHTS.map((spot) => {
          const Icon = spot.icon;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => onSelectCategory?.(spot.id)}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-line bg-surface text-right hover:border-brand/40 hover:shadow-card transition-all duration-300 overflow-hidden relative"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-line">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand-ink">
                  <Icon className="w-3.5 h-3.5" />
                  {spot.eyebrow}
                </span>
                <h3 className="text-sm font-extrabold text-ink mt-1 line-clamp-1 group-hover:text-brand-ink transition-colors">
                  {spot.title}
                </h3>
                <p className="text-[11px] text-ink-3 mt-1 line-clamp-2 leading-relaxed">{spot.desc}</p>
                <p className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-[10px] text-ink-3">يبدأ من</span>
                  <span className="text-sm font-extrabold text-gold mnr-num">{formatIQD(spot.price)}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* شريط التقييم */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Star, value: '4.9 / 5', label: 'تقييم عملائنا' },
          { icon: ShieldCheck, value: '12 شهر', label: 'كفالة الوكالة' },
          { icon: Truck, value: '24–48 ساعة', label: 'زمن التوصيل' },
          { icon: Package, value: '+2,400', label: 'طلب مكتمل' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface-2"
            >
              <span className="w-9 h-9 rounded-lg bg-gold-soft text-gold grid place-items-center shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-ink leading-tight">{stat.value}</p>
                <p className="text-[11px] text-ink-3">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
