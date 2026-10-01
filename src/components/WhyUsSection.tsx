import React from 'react';
import {
  BadgeCheck,
  Truck,
  Banknote,
  RotateCcw,
  Headphones,
  Lock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: 'أصالة مضمونة 100%',
    desc: 'كل جهاز يمر بفحص السيريال ومطابقة رقم الوكيل قبل عرضه للبيع.',
    tone: 'bg-success-soft text-success',
  },
  {
    icon: Truck,
    title: 'توصيل لكل المحافظات',
    desc: 'أسطول شحن يومي من زاخو إلى البصرة، مع إمكانية المعاينة قبل الدفع.',
    tone: 'bg-brand-soft text-brand-ink',
  },
  {
    icon: Banknote,
    title: 'كاش عند الاستلام',
    desc: 'لا دفع مسبق إطلاقاً. تدفع للمندوب بعد فحص المنتج في باب بيتك.',
    tone: 'bg-gold-soft text-gold',
  },
  {
    icon: RotateCcw,
    title: 'استبدال خلال 14 يوم',
    desc: 'إن وجدت أي خلل مصنعي نستبدله فوراً بدون تعقيد.',
    tone: 'bg-info-soft text-info',
  },
  {
    icon: Headphones,
    title: 'دعم فني بعد البيع',
    desc: 'فريق متخصص يجيب عن كل أسئلتك عن التوافق والإعداد بعد الشراء.',
    tone: 'bg-warn-soft text-warn',
  },
  {
    icon: Lock,
    title: 'متجر موثوق منذ سنوات',
    desc: 'سجل تجاري ومقر ثابت في بغداد وكربلاء، وزبائن يعودون إلينا دائماً.',
    tone: 'bg-danger-soft text-danger',
  },
];

const STEPS = [
  { step: '01', title: 'اختر ما يناسبك', desc: 'تصفّح المنتجات وقارن المواصفات والأسعار بوضوح.' },
  { step: '02', title: 'أضف إلى السلة', desc: 'السلة محفوظة على جهازك — أكمل وقت ما تحب حتى لو بعد يومين.' },
  { step: '03', title: 'أكّد بياناتك', desc: 'اسمك، هاتفك، وعنوانك بالتفصيل مع أقرب نقطة دالة.' },
  { step: '04', title: 'ادفع عند الاستلام', desc: 'المندوب يوصل الطلب، تفحصه، ثم تدفع نقداً.，没有任何 مخاطرة.' },
];

export const WhyUsSection: React.FC = () => (
  <section id="why" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-32">
    <SectionHeader
      eyebrow="لماذا مركز المنار"
      eyebrowIcon={Sparkles}
      title={
        <>
          نشتري بثقة، <span className="mnr-gradient-text">ونرتاح بعد الشراء</span>
        </>
      }
      description="ستة أسباب تجعل الزبون يعود إلينا مرة بعد مرة."
      className="mb-6"
    />

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {ADVANTAGES.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group flex items-start gap-3.5 p-4 rounded-2xl border border-line bg-surface hover:border-brand/40 hover:shadow-card transition-all duration-300"
          >
            <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${item.tone}`}>
              <Icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>

    {/* خطوات الشراء */}
    <div className="mt-6 rounded-2xl border border-line bg-surface overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-line bg-surface-2">
        <ShieldCheck className="w-4.5 h-4.5 text-brand-ink" />
        <h3 className="mnr-h2 text-sm text-ink">كيف تشتري من عندنا؟</h3>
      </div>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-line">
        {STEPS.map((item) => (
          <li key={item.step} className="p-5">
            <span className="mnr-num text-2xl font-extrabold text-brand-soft leading-none block mb-2">
              {item.step}
            </span>
            <h4 className="text-sm font-extrabold text-ink">{item.title}</h4>
            <p className="text-xs text-ink-3 mt-1 leading-relaxed">{item.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
