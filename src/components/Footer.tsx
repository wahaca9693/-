import React from 'react';
import { Logo } from './Logo';
import { Truck, ShieldCheck, Phone, MessageSquare, MapPin, Award, Heart, Shield } from 'lucide-react';
import { IRAQ_GOVERNORATES } from '../data/initialData';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenTracking,
  onScrollToSection,
}) => {
  return (
    <footer className="bg-[#080808] border-t border-[#d4af37]/25 text-[#f5f5f7] pt-14 pb-8 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 4 Pillars of Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#121212] border border-[#d4af37]/20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5f5f7]">توصيل 5,000 د.ع لكافة العراق</h4>
              <p className="text-xs text-[#99907c]">شحن آمن ومؤمن لجميع المحافظات خلال 24-48 ساعة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5f5f7]">كفالة استبدال ذهبية 12 شهر</h4>
              <p className="text-xs text-[#99907c]">أجهزة أصلية معتمدة برقم تسلسلي وسيريال موثق</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5f5f7]">المعاينة والفحص قبل الدفع</h4>
              <p className="text-xs text-[#99907c]">حق فتح الطرد وفحصه مع المندوب قبل دفع المبلغ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5f5f7]">دعم فني واستشارات متخصصة</h4>
              <p className="text-xs text-[#99907c]">فريق تقني متواجد للإجابة عن توافق الشواحن والأجهزة</p>
            </div>
          </div>
        </div>

        {/* 4 Columns Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
          {/* Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="lg" />
            <p className="text-[#d0c5af] leading-relaxed text-xs sm:text-sm">
              مركز المنار للموبايل M.N.R هو وجهتك الأولى في العراق لاقتناء أحدث الهواتف الذكية الأصلية من Apple و Samsung، بالإضافة إلى ملحقات الصوت الاحترافية والشواحن الذكية المعتمدة مع خدمة التوصيل السريع لكافة المحافظات العراقية.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/9647701234567"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 text-[#ffd700] font-bold flex items-center gap-1.5 hover:bg-[#252012] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واتساب المتجر المباشر</span>
              </a>
              <a
                href="tel:07701234567"
                className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#d4af37]/20 text-[#f5f5f7] font-semibold flex items-center gap-1.5 hover:text-[#ffd700] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#ffd700]" />
                <span dir="ltr">0770 123 4567</span>
              </a>
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#ffd700] pb-1 border-b border-[#d4af37]/20">
              أقسام المتجر
            </h4>
            <ul className="space-y-2 text-[#d0c5af]">
              <li>
                <button onClick={() => onScrollToSection('phones')} className="hover:text-[#ffd700] transition-colors">
                  الهواتف الرائدة
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('audio')} className="hover:text-[#ffd700] transition-colors">
                  السماعات والصوت
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('chargers')} className="hover:text-[#ffd700] transition-colors">
                  شواحن GaN الفائقة
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('cases')} className="hover:text-[#ffd700] transition-colors">
                  كفرات وحماية الشاشة
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('watches')} className="hover:text-[#ffd700] transition-colors">
                  الساعات الذكية
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('accessories')} className="hover:text-[#ffd700] transition-colors">
                  أدوات ومعدات الصيانة
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#ffd700] pb-1 border-b border-[#d4af37]/20">
              خدمة العملاء
            </h4>
            <ul className="space-y-2 text-[#d0c5af]">
              <li>
                <button onClick={onOpenTracking} className="hover:text-[#ffd700] transition-colors font-bold text-[#ffd700]">
                  تتبع شحنتك المباشر
                </button>
              </li>
              <li>
                <span className="text-[#99907c]">أجور الشحن: 5,000 د.ع ثابتة</span>
              </li>
              <li>
                <span className="text-[#99907c]">سياسة الاستبدال: 14 يوم</span>
              </li>
              <li>
                <span className="text-[#99907c]">الضمان: 12 شهر وكالة</span>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#d4af37] hover:underline flex items-center gap-1 mt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>دخول لوحة الإدارة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Governorates Coverage List (Span 4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#ffd700] pb-1 border-b border-[#d4af37]/20 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ffd700]" />
              <span>تغطية الشحن والتوصيل لكافة المحافظات</span>
            </h4>
            <p className="text-[#99907c] text-[11px]">
              أسطول شحن يومي مباشر إلى جميع المدن والأقضية العراقية بـ 5,000 دينار عراقي فقط:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-[#d0c5af]">
              {IRAQ_GOVERNORATES.map((gov) => (
                <span
                  key={gov}
                  className="px-2 py-0.5 rounded-md bg-[#121212] border border-[#d4af37]/15 text-[#e5e2e1]"
                >
                  {gov}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Rights Strip */}
        <div className="pt-8 border-t border-[#d4af37]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#99907c]">
          <p>© 2026 مركز المنار للموبايل M.N.R – جميع الحقوق محفوظة لجمهورية العراق.</p>
          <div className="flex items-center gap-4">
            <span>الأسعار الرسمية بالدينار العراقي IQD</span>
            <span>•</span>
            <button onClick={onOpenAdmin} className="hover:text-[#ffd700] transition-colors">
              لوحة الإدارة
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
