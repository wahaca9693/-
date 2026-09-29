import React from 'react';
import { Logo } from './Logo';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

const CONTACTS = [
  {
    icon: Phone,
    label: 'الاتصال الهاتفي المباشر',
    primary: '+964 770 123 4567',
    secondary: '+964 780 123 4567',
    mono: true,
  },
  {
    icon: MapPin,
    label: 'المستودعات والمراكز',
    primary: 'العراق — بغداد (المنصور / الكرادة)',
    secondary: 'فرع كربلاء المقدسة (حي الحسين)',
  },
  {
    icon: Clock,
    label: 'أوقات العمل والتجهيز',
    primary: 'يومياً: 09:00 ص – 11:00 م',
    secondary: 'شحن الطلبات يعمل طوال أيام الأسبوع',
    accent: true,
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    primary: 'support@mnr-iraq.com',
    secondary: 'لطلبات الجملة والشراكات التجارية',
    mono: true,
  },
];

export const AboutContactSection: React.FC = () => (
  <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-32 space-y-8">
    {/* من نحن */}
    <div className="grid lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl border border-line bg-surface relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle, var(--mnr-brand) 0%, transparent 70%)' }}
        />
        <Logo size="xl" />
        <p className="mt-6 text-center text-sm font-extrabold mnr-gradient-text">M.N.R – مركز المنار للموبايل</p>
        <p className="mt-2 text-center text-xs text-ink-2 max-w-[16rem]">
          علامة رائدة في تجارة الهواتف الذكية والإكسسوارات وخدمات الصيانة الدقيقة في العراق.
        </p>
      </div>

      <div className="lg:col-span-7 space-y-4">
        <span className="mnr-badge mnr-badge-brand">
          <Sparkles className="w-3.5 h-3.5" />
          من نحن
        </span>
        <h2 className="mnr-h1 text-2xl sm:text-3xl text-ink leading-snug">
          ريادة تجارة الموبايل والتقنية الأصلية في <span className="mnr-gradient-text">العراق</span>
        </h2>
        <p className="text-sm text-ink-2 leading-relaxed">
          تأسس مركز المنار للموبايل برؤية واضحة تهدف إلى تزويد المستخدم العراقي بأحدث ما توصلت
          إليه تكنولوجيا الهواتف الذكية مع ضمان الوكالة الرسمي المعتمد. تخضع جميع الأجهزة
          والإكسسوارات لفحص دقيق ومطابقة السيريال قبل وصولها إلى يد العميل.
        </p>
        <p className="text-sm text-ink-3 leading-relaxed">
          نوفر خدمة شحن آمنة ومباشرة لكافة المحافظات العراقية بتكلفة ثابتة 5,000 دينار عراقي،
          مع إمكانية المعاينة وفحص الطلب قبل تسديد المبلغ نقداً عند الاستلام.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface-2">
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
            <span className="text-xs font-extrabold text-ink">كفالة أجهزة 12 شهراً</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface-2">
            <Clock className="w-5 h-5 text-brand-ink shrink-0" />
            <span className="text-xs font-extrabold text-ink">توصيل 24 إلى 48 ساعة</span>
          </div>
        </div>
      </div>
    </div>

    {/* تواصل معنا */}
    <div id="contact" className="p-5 sm:p-8 rounded-2xl border border-line bg-surface">
      <SectionHeader
        eyebrow="دعم مباشر"
        eyebrowIcon={MessageSquare}
        title="تواصل معنا وقنوات الدعم"
        description="فريقنا متواجد يومياً من 9:00 صباحاً حتى 11:00 مساءً للرد على الاستفسارات."
        className="mb-6"
        action={
          <a
            href="https://wa.me/9647701234567"
            target="_blank"
            rel="noreferrer"
            className="mnr-btn mnr-btn-primary h-11 px-5"
          >
            <MessageSquare className="w-4 h-4" />
            محادثة فورية على واتساب
          </a>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {CONTACTS.map((contact) => {
          const Icon = contact.icon;
          return (
            <div key={contact.label} className="p-4 rounded-xl border border-line bg-surface-2">
              <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand-ink grid place-items-center mb-2.5">
                <Icon className="w-4 h-4" />
              </span>
              <p className="text-[11px] text-ink-3">{contact.label}</p>
              <p
                className={`text-sm font-extrabold text-ink mt-0.5 ${contact.mono ? 'mnr-num' : ''}`}
              >
                {contact.primary}
              </p>
              <p
                className={`text-[11px] mt-0.5 ${contact.mono ? 'mnr-num' : ''} ${
                  contact.accent ? 'text-success font-bold' : 'text-ink-3'
                }`}
              >
                {contact.secondary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
