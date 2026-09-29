import React, { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import {
  Search,
  ShoppingBag,
  Heart,
  Shield,
  Package,
  Truck,
  Wrench,
  Flame,
  Smartphone,
  Headphones,
  Zap,
  BatteryCharging,
  Cable,
  Watch,
  Home,
  Sun,
  Moon,
  MapPin,
  ChevronLeft,
} from 'lucide-react';
import { ProductCategory } from '../types/store';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: ProductCategory | 'all';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onScrollToSection: (sectionId: string) => void;
}

const NAV_ITEMS: {
  label: string;
  icon: React.ElementType;
  category?: ProductCategory | 'all';
  section?: string;
  accent?: boolean;
}[] = [
  { label: 'الرئيسية', icon: Home, section: 'hero' },
  { label: 'الهواتف', icon: Smartphone, category: 'phones' },
  { label: 'السماعات', icon: Headphones, category: 'audio' },
  { label: 'الشواحن', icon: Zap, category: 'chargers' },
  { label: 'البطاريات', icon: BatteryCharging, category: 'powerbanks' },
  { label: 'الكيبلات', icon: Cable, category: 'cables' },
  { label: 'الساعات', icon: Watch, category: 'watches' },
  { label: 'الصيانة', icon: Wrench, section: 'maintenance' },
  { label: 'العروض', icon: Flame, section: 'offers', accent: true },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  activeCategory,
  theme,
  onToggleTheme,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onOpenTracking,
  onScrollToSection,
  onSelectCategory,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 12);

      // إخفاء ذكي عند النزول، ظهور فوري عند الصعود
      if (current > 140) {
        if (current > lastScrollY.current + 6) setIsVisible(false);
        else if (current < lastScrollY.current - 6) setIsVisible(true);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.category !== undefined) onSelectCategory(item.category);
    if (item.section) onScrollToSection(item.section);
  };

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.category !== undefined && item.category === activeCategory;

  const iconBtn =
    'relative w-10 h-10 grid place-items-center rounded-xl text-ink-2 hover:text-brand-ink hover:bg-brand-soft transition-colors';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* شريط الثقة العلوي */}
      <div
        className={`hidden lg:block overflow-hidden transition-all duration-300 ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="mnr-glass border-b border-line">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-10 flex items-center justify-between gap-4 text-[11px]">
            <span className="flex items-center gap-2 text-ink-2 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success animate-ping opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              أجهزة أصلية 100% مختومة بكفالة الوكالة 12 شهراً
            </span>

            <span className="flex items-center gap-2 text-ink-2 font-medium">
              <Truck className="w-3.5 h-3.5 text-brand-ink" />
              توصيل 5,000 د.ع ثابت لكل المحافظات
            </span>

            <button
              type="button"
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 font-bold text-brand-ink hover:gap-2.5 transition-all"
            >
              <Package className="w-3.5 h-3.5" />
              تتبع شحنتك
            </button>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'mnr-glass border-b border-line shadow-soft'
            : 'mnr-glass border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-[72px]">
            {/* العلامة */}
            <div className="shrink-0">
              <Logo size="sm" onClick={() => onScrollToSection('hero')} />
            </div>

            {/* روابط التنقّل */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => go(item)}
                    className={`relative px-3 h-10 grid place-items-center rounded-xl text-[13px] font-bold transition-colors ${
                      active || item.accent
                        ? item.accent && !active
                          ? 'text-gold hover:bg-gold-soft'
                          : 'text-brand-ink bg-brand-soft'
                        : 'text-ink-2 hover:text-ink hover:bg-surface-2'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* الأدوات */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button type="button" onClick={onOpenSearch} className={iconBtn} aria-label="بحث">
                <Search className="w-[18px] h-[18px]" />
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className={iconBtn}
                aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
                title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
              >
                {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              <button
                type="button"
                onClick={onOpenWishlist}
                className={`${iconBtn} hidden sm:grid`}
                aria-label="المفضلة"
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-canvas">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className="mnr-btn mnr-btn-primary h-10 px-3.5 sm:px-4 relative"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">السلة</span>
                {cartCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1 rounded-full bg-on-brand/25 text-on-brand text-[11px] font-extrabold grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className={`${iconBtn} hidden md:grid`}
                aria-label="لوحة الإدارة"
                title="لوحة الإدارة"
              >
                <Shield className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* روابط الأقسام على الشاشات المتوسطة (بدل xl) */}
      <div
        className={`xl:hidden overflow-x-auto mnr-no-scrollbar border-b transition-all duration-300 ${
          isScrolled ? 'border-line' : 'border-transparent'
        } ${isVisible ? '' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-2 min-w-max">
          <button
            type="button"
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold text-brand-ink bg-brand-soft"
          >
            <MapPin className="w-3.5 h-3.5" />
            تتبع الطلب
          </button>
          {NAV_ITEMS.filter((i) => i.category).map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold transition-colors ${
                  active ? 'bg-brand-soft text-brand-ink' : 'text-ink-2 hover:bg-surface-2'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onScrollToSection('maintenance')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold text-ink-2 hover:bg-surface-2"
          >
            <Wrench className="w-3.5 h-3.5" />
            الصيانة
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('offers')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold text-gold hover:bg-gold-soft"
          >
            <Flame className="w-3.5 h-3.5" />
            العروض
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
