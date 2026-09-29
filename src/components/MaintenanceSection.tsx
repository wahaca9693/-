import React from 'react';
import { Wrench, BatteryCharging, Smartphone, Cpu, Droplets, CheckCircle, MessageSquare } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

interface MaintenanceSectionProps {
  onContactWhatsApp: () => void;
}

const SERVICES = [
  { icon: Smartphone, title: 'تبديل شاشات بجودة عالية', desc: 'شاشات أصلية OLED مع كفالة اللمس والألوان ودعم TrueTone.' },
  { icon: BatteryCharging, title: 'تبديل بطاريات أصلية', desc: 'بطاريات معتمدة بصحة 100% ودورات شحن كاملة بلا تحذيرات.' },
  { icon: Wrench, title: 'صيانة جميع أنواع الموبايلات', desc: 'فنيون متخصصون في تصليح بوردات الآيفون والسامسونج والشاومي.' },
  { icon: Cpu, title: 'برمجة وفك الرموز', desc: 'سوفت وير أصلي، تخطي مشاكل النظام، ونسخ احتياطي لبياناتك.' },
  { icon: Droplets, title: 'حل مشاكل الماء والرطوبة', desc: 'تنظيف بالموجات الصوتية ومعالجة الشورتات بأحدث الأجهزة.' },
  { icon: CheckCircle, title: 'فحص شامل قبل وبعد الصيانة', desc: 'تقرير دقيق للحساسات والكاميرات والشبكة ومنفذ الشحن.' },
];

export const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ onContactWhatsApp }) => (
  <section id="maintenance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-32">
    <SectionHeader
      eyebrow="قسم الصيانة"
      eyebrowIcon={Wrench}
      title={
        <>
          خدمات و<span className="mnr-gradient-text">أدوات صيانة الهاتف</span>
        </>
      }
      description="أجهزة رقمية حديثة لتبديل الشاشات، صيانة الآي سيات، ومعالجة الأعطال المستعصية."
      className="mb-6"
    />

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <div
            key={service.title}
            className="group p-4 sm:p-5 rounded-2xl border border-line bg-surface hover:border-brand/40 hover:shadow-card transition-all duration-300"
          >
            <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand-ink grid place-items-center mb-3 transition-transform group-hover:scale-105">
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-extrabold text-ink group-hover:text-brand-ink transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-ink-3 mt-1.5 leading-relaxed">{service.desc}</p>
          </div>
        );
      })}
    </div>

    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-line bg-surface-2">
      <div>
        <h3 className="mnr-h2 text-base text-ink">هل يحتاج هاتفك لفحص أو صيانة عاجلة؟</h3>
        <p className="text-xs text-ink-3 mt-1">
          تواصل مباشرة مع مهندسي مركز المنار لمعاينة جهازك وتقدير التكلفة.
        </p>
      </div>
      <button type="button" onClick={onContactWhatsApp} className="mnr-btn mnr-btn-primary h-11 px-5 shrink-0">
        <MessageSquare className="w-4 h-4" />
        استشارة فني الصيانة عبر واتساب
      </button>
    </div>
  </section>
);
