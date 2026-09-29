import React from 'react';
import { Logo } from './Logo';
import { Truck, ShieldCheck, Package, Phone, MessageSquare, MapPin, Award, Shield } from 'lucide-react';
import { IRAQ_GOVERNORATES } from '../data/initialData';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onScrollToSection: (id: string) => void;
}

const TRUST = [
  { icon: Truck, title: 'توصيل 5,000 د.ع لكل العراق', desc: 'شحن آمن ومؤمن لكل المحافظات' },
  { icon: ShieldCheck, title: 'كفالة 12 شهراً', desc: 'أجهزة أصلية برقم تسلسلي موثّق' },
  { icon: Award, title: 'المعاينة قبل الدفع', desc: 'حق فتح الطرد وفحصه مع المندوب' },
  { icon: Package, title: 'تتبع مباشر للشحنة', desc: 'اعرف حالة طلبك برقمه وهاتفك' },
];

const QUICK_LINKS: { label: string; section: string }[] = [
  { label: 'الهواتف الرائدة', section: 'phones' },
  { label: 'السماعات والصوت', section: 'audio' },
  { label: 'شواحن GaN', section: 'chargers' },
  { label: 'الكفرات والحماية', section: 'cases' },
  { label: 'الساعات الذكية', section: 'watches' },
  { label: 'أدوات الصيانة', section: 'accessories' },
];

const SUPPORT = [
  { label: 'أجور الشحن: 5,000 د.ع ثابتة' },
  { label: 'سياسة الاستبدال: 14 يوم' },
  { label: 'الضمان: 12 شهر وكالة' },
];

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenTracking, onScrollToSection }) => (
  <footer className="mt-10 border-t border-line bg-surface text-ink">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* شريط الثقة */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {TRUST.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3 p-4 rounded-xl border border-line bg-surface-2">
              <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand-ink grid place-items-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h4 className="text-[13px] font-extrabold text-ink leading-tight">{item.title}</h4>
                <p className="text-[11px] text-ink-3 mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* الأعمدة */}
      <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <Logo size="md" />
          <p className="text-xs text-ink-2 leading-relaxed">
            مركز المنار للموبايل وجهتك الأولى في العراق لاقتناء أحدث الهواتف الذكية الأصلية من
            آبل وسامسونج، إضافة إلى ملحقات الصوت الاحترافية والشواحن الذكية المعتمدة مع خدمة
            توصيل سريعة لكافة المحافظات.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://wa.me/9647701234567"
              target="_blank"
              rel="noreferrer"
              className="mnr-btn mnr-btn-primary h-10 px-4 text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              واتساب المتجر
            </a>
            <a href="tel:07701234567" className="mnr-btn mnr-btn-soft h-10 px-4 text-xs">
              <Phone className="w-4 h-4" />
              <span className="mnr-num">0770 123 4567</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mnr-h2 text-sm text-ink pb-2.5 mb-3 border-b border-line">أقسام المتجر</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.section}>
                <button
                  type="button"
                  onClick={() => onScrollToSection(link.section)}
                  className="text-xs text-ink-2 hover:text-brand-ink transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mnr-h2 text-sm text-ink pb-2.5 mb-3 border-b border-line">خدمة العملاء</h4>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={onOpenTracking}
                className="text-xs font-extrabold text-brand-ink hover:underline"
              >
                تتبع شحنتك المباشر
              </button>
            </li>
            {SUPPORT.map((item) => (
              <li key={item.label} className="text-xs text-ink-3">
                {item.label}
              </li>
            ))}
            <li className="pt-1">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-xs font-bold text-ink-3 hover:text-brand-ink transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                دخول لوحة الإدارة
              </button>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h4 className="mnr-h2 text-sm text-ink pb-2.5 mb-3 border-b border-line flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-ink" />
            تغطية الشحن لكل المحافظات
          </h4>
          <p className="text-[11px] text-ink-3">
            أسطول شحن يومي إلى جميع المدن والأقضية العراقية بـ 5,000 دينار فقط.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {IRAQ_GOVERNORATES.map((gov) => (
              <span key={gov} className="mnr-badge mnr-badge-neutral">
                {gov}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* الحقوق */}
      <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-3">
        <p>© 2026 مركز المنار للموبايل M.N.R — جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-2">
          <span>الأسعار بالدينار العراقي (IQD)</span>
          <span>•</span>
          <button type="button" onClick={onOpenAdmin} className="hover:text-brand-ink transition-colors">
            لوحة الإدارة
          </button>
        </p>
      </div>
    </div>
  </footer>
);
