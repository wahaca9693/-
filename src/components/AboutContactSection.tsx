import React from 'react';
import { Logo } from './Logo';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export const AboutContactSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#070707] text-right relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#18150c] to-[#0c0c0c] border border-[#d4af37]/35 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full blur-2xl pointer-events-none" />
            <Logo size="xl" />
            <div className="mt-6 text-center space-y-2">
              <span className="text-xl font-black gold-gradient-text tracking-wider">
                M.N.R – مركز المنار للموبايل
              </span>
              <p className="text-xs text-[#d0c5af] max-w-xs mx-auto">
                علامة مسجلة ورائدة في عالم تجارة الهواتف الذكية والإكسسوارات الفاخرة وخدمات الصيانة الدقيقة في العراق
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>من نحن • رؤية النخبة</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#f5f5f7]">
              ريادة تجارة الموبايل والتقنية الأصلية في <span className="gold-gradient-text">العراق</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#d0c5af] leading-relaxed">
              تأسس مركز المنار للموبايل (M.N.R) برؤية واضحة تهدف إلى تزويد المستخدم العراقي بأحدث ما توصلت إليه تكنولوجيا الهواتف الذكية مع ضمان الوكالة الرسمي المعتمد. نلتزم بأعلى معايير الشفافية والموثوقية، حيث تخضع جميع الأجهزة والإكسسوارات لفحص دقيق ومطابقة السيريال نمبر قبل وصولها إلى يد العميل.
            </p>
            <p className="text-xs sm:text-sm text-[#99907c] leading-relaxed">
              نوفر خدمة شحن آمنة ومباشرة لكافة المحافظات العراقية (من زاخو إلى البصرة) بتكلفة ثابتة تبلغ 5,000 دينار عراقي فقط، مع إمكانية المعاينة وفحص الطلب قبل تسديد المبلغ نقداً عند الاستلام.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#d4af37]/20 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#ffd700] shrink-0" />
                <span className="font-bold text-[#f5f5f7]">كفالة أجهزة 12 شهراً</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#d4af37]/20 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#ffd700] shrink-0" />
                <span className="font-bold text-[#f5f5f7]">توصيل 24 إلى 48 ساعة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="pt-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121212] border border-[#d4af37]/25 shadow-xl">
            <div className="mb-6 pb-4 border-b border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#ffd700]">
                  تواصل معنا وقنوات الدعم المباشر
                </h3>
                <p className="text-xs text-[#99907c] mt-0.5">
                  فريقنا متواجد يومياً من الساعة 9:00 صباحاً حتى 11:00 مساءً للرد على كافة الاستفسارات
                </p>
              </div>

              <a
                href="https://wa.me/9647701234567"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110"
              >
                <MessageSquare className="w-4 h-4" />
                <span>محادثة فورية على واتساب</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/15 space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1c180e] text-[#ffd700] flex items-center justify-center mb-2">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[#99907c] block">الاتصال الهاتفي المباشر:</span>
                <span className="font-bold text-sm text-[#f5f5f7] font-mono block" dir="ltr">
                  +964 770 123 4567
                </span>
                <span className="font-bold text-sm text-[#f5f5f7] font-mono block" dir="ltr">
                  +964 780 123 4567
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/15 space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1c180e] text-[#ffd700] flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[#99907c] block">المستودعات والمراكز:</span>
                <span className="font-bold text-sm text-[#f5f5f7] block">
                  العراق - بغداد (المنصور / الكرادة)
                </span>
                <span className="text-[11px] text-[#d0c5af] block">
                  وفرع كربلاء المقدسة (حي الحسين)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/15 space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1c180e] text-[#ffd700] flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[#99907c] block">أوقات العمل والتجهيز:</span>
                <span className="font-bold text-sm text-[#f5f5f7] block">
                  يومياً: 09:00 ص – 11:00 م
                </span>
                <span className="text-[11px] text-[#30d158] block">
                  شحن الطلبات يعمل طيلة أيام الأسبوع
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/15 space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1c180e] text-[#ffd700] flex items-center justify-center mb-2">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[#99907c] block">البريد الإلكتروني المعتمد:</span>
                <span className="font-bold text-xs text-[#ffd700] font-mono block" dir="ltr">
                  support@mnr-iraq.com
                </span>
                <span className="text-[11px] text-[#99907c] block">
                  لطلبات الجملة والشراكات التجارية
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
