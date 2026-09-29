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
    <section id="maintenance" className="py-14 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] border-y border-[#d4af37]/20 relative overflow-hidden">
      {/* Golden Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#d4af37]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700] mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>قسم الصيانة التخصصي المعتمد</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#f5f5f7]">
              خدمات وأدوات <span className="gold-gradient-text">صيانة الهاتف</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#99907c] mt-1">
              أحدث الأجهزة الرقمية لتبديل الشاشات، صيانة الآي سيات، ومعالجة الأعطال المستعصية
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-sm font-black gold-gradient-text block">
              "ثقتكم .. سر نجاحنا"
            </span>
            <span className="text-xs text-[#d0c5af]">مركز المنار للموبايل M.N.R</span>
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#141414] hover:bg-[#1c180e] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1c1b1b] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#f5f5f7] group-hover:text-[#ffd700] transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#99907c] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-[#18150c] border border-[#d4af37]/35 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffd700] text-[#0a0a0a] flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5f5f7]">هل يحتاج هاتفك لفحص أو صيانة عاجلة؟</h4>
              <p className="text-xs text-[#d0c5af]">تواصل مباشرة مع مهندسي مركز المنار لمعاينة جهازك وتقدير التكلفة</p>
            </div>
          </div>

          <button
            onClick={onContactWhatsApp}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            استشارة فني الصيانة الآن عبر واتساب
          </button>
        </div>
      </div>
    </section>
  );
};
