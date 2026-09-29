import React from 'react';
import { Wrench, BatteryCharging, Smartphone, Cpu, Droplets, CheckCircle, Shield } from 'lucide-react';

interface MaintenanceSectionProps {
  onContactWhatsApp: () => void;
}

export const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ onContactWhatsApp }) => {
  const services = [
    {
      icon: Smartphone,
      title: 'تبديل شاشات بجودة عالية',
      desc: 'شاشات أصلية OLED مع كفالة اللمس والألوان الحقيقية ودعم TrueTone',
    },
    {
      icon: BatteryCharging,
      title: 'تبديل بطاريات أصلية',
      desc: 'بطاريات معتمدة بصحة 100% ودورات شحن كاملة دون ظهور رسائل تحذيرية',
    },
    {
      icon: Wrench,
      title: 'صيانة جميع أنواع الموبايلات',
      desc: 'مهندسون وفنيون متخصصون في تصليح بوردات الآيفون والسامسونج والشاومي',
    },
    {
      icon: Cpu,
      title: 'برمجة وفك الرموز',
      desc: 'سوفت وير أصلي، تخطي مشاكل النظام، ونسخ احتياطي آمن لبياناتك',
    },
    {
      icon: Droplets,
      title: 'حل مشاكل الماء والرطوبة',
      desc: 'تنظيف بالموجات الصوتية ومعالجة الشورتات الكهربائية بأحدث الأجهزة',
    },
    {
      icon: CheckCircle,
      title: 'فحص شامل قبل وبعد الصيانة',
      desc: 'تقرير فحص دقيق لكافة الحساسات، الكاميرات، الشبكة، ومنفذ الشحن',
    },
  ];

  return (
    <section id="maintenance" className="py-12 bg-[#080808] border-y border-[#222] relative overflow-hidden text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading with Restrained Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b border-[#222]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#18150c] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700] mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>قسم الصيانة التخصصي المعتمد</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f7]">
              خدمات وأدوات <span className="gold-gradient-text">صيانة الهاتف</span>
            </h2>
            <p className="text-xs text-[#8e8e93] mt-0.5">
              أحدث الأجهزة الرقمية لتبديل الشاشات، صيانة الآي سيات، ومعالجة الأعطال المستعصية
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs sm:text-sm font-bold gold-gradient-text block">
              "ثقتكم .. سر نجاحنا"
            </span>
            <span className="text-[11px] text-[#8e8e93]">مركز المنار للموبايل M.N.R</span>
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#0f0f0f] border border-[#24221c] hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#16140e] border border-[#d4af37]/25 flex items-center justify-center text-[#ffd700] mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#f5f5f7] group-hover:text-[#ffd700] transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8e8e93] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-6 p-4 rounded-xl bg-[#12100a] border border-[#d4af37]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffd700] text-[#0a0a0a] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#f5f5f7] block">هل يحتاج هاتفك لفحص أو صيانة عاجلة؟</span>
              <span className="text-[#8e8e93]">تواصل مباشرة مع مهندسي مركز المنار لمعاينة جهازك وتقدير التكلفة</span>
            </div>
          </div>

          <button
            onClick={onContactWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
          >
            استشارة فني الصيانة عبر واتساب
          </button>
        </div>
      </div>
    </section>
  );
};
