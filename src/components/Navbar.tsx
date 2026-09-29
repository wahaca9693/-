import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { Search, ShoppingBag, Heart, Shield, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { ProductCategory } from '../types/store';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onOpenTracking,
  onScrollToSection,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect whether user has scrolled past threshold
      setIsScrolled(currentScrollY > 40);

      // Smart hide on scroll down, show on scroll up
      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY.current + 5) {
          // Scrolling DOWN: Hide navbar smoothly
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          // Scrolling UP: Reveal navbar smoothly
          setIsVisible(true);
        }
      } else {
        // At the very top: Always show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', action: () => onScrollToSection('hero') },
    { label: 'الأقسام', action: () => onScrollToSection('categories') },
    { label: 'الهواتف', action: () => onSelectCategory('phones') },
    { label: 'السماعات', action: () => onSelectCategory('audio') },
    { label: 'الشواحن', action: () => onSelectCategory('chargers') },
    { label: 'الإكسسوارات', action: () => onSelectCategory('cases') },
    { label: 'العروض', action: () => onScrollToSection('offers') },
    { label: 'الصيانة', action: () => onScrollToSection('maintenance') },
    { label: 'من نحن', action: () => onScrollToSection('about') },
    { label: 'تواصل معنا', action: () => onScrollToSection('contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-[#080808]/92 backdrop-blur-xl border-b border-[#d4af37]/25 shadow-[0_10px_35px_rgba(0,0,0,0.85)]'
            : 'bg-[#080808]/80 backdrop-blur-md border-b border-[#d4af37]/15'
        }`}
      >
        {/* Top Gold Announcement Bar - Collapses smoothly when scrolled */}
        <div
          className={`bg-gradient-to-r from-[#18150c] via-[#2a2412] to-[#18150c] border-b border-[#d4af37]/25 overflow-hidden transition-all duration-300 ${
            isScrolled ? 'max-h-0 opacity-0 py-0 border-none' : 'max-h-12 opacity-100 py-1.5 px-4'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#ffd700]">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              <span className="text-[#e5e2e1]">كافة الأجهزة مختومة بضمان الوكالة الرسمي 12 شهر</span>
            </div>

            <div className="flex items-center justify-center gap-2 w-full sm:w-auto font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>توصيل ثابت 5,000 د.ع لكافة محافظات العراق (بغداد، كربلاء، النجف، البصرة، أربيل)</span>
            </div>

            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#ffd700] hover:underline transition-colors"
            >
              <span>تتبع شحنتك</span>
              <span className="text-[10px]">←</span>
            </button>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Right: Official Logo */}
            <div className="flex items-center gap-3">
              <Logo
                size="md"
                onClick={() => onScrollToSection('hero')}
              />
            </div>

            {/* Center: Desktop Navigation Links with animated hover transitions */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={link.action}
                  className="text-[#d0c5af] hover:text-[#ffd700] transition-all relative py-1 hover:-translate-y-0.5"
                >
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>

            {/* Left: Action Icons (Search, Wishlist, Cart, Admin) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                aria-label="Search"
                className="w-10 h-10 rounded-xl bg-[#141414] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37]/15 hover:border-[#ffd700]/60 transition-all hover:scale-105 active:scale-95"
                title="بحث عن منتج"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                aria-label="Wishlist"
                className="relative w-10 h-10 rounded-xl bg-[#141414] border border-[#d4af37]/20 flex items-center justify-center text-[#d0c5af] hover:text-[#ffd700] hover:bg-[#d4af37]/15 transition-all hover:scale-105 active:scale-95"
                title="المفضلة"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1f1b13] border border-[#d4af37] text-[#ffd700] text-[10px] font-bold flex items-center justify-center animate-scale">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 h-10 px-3.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0d0d0d] font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">السلة</span>
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#0d0d0d] text-[#ffd700] text-xs font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* Admin Dashboard Shield */}
              <button
                onClick={onOpenAdmin}
                className="relative w-10 h-10 rounded-xl bg-[#1a160d] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] hover:bg-[#d4af37]/20 hover:border-[#ffd700] hover:scale-105 active:scale-95 transition-all group"
                title="لوحة تحكم الأدمن (محمية برمز PIN)"
              >
                <Shield className="w-4 h-4 text-[#ffd700] group-hover:rotate-12 transition-transform" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#30d158] ring-2 ring-[#080808]" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl bg-[#141414] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] active:scale-95"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a]/98 backdrop-blur-2xl border-b border-[#d4af37]/25 px-5 py-5 space-y-4 animate-slideDown shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    link.action();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#d4af37]/15 text-[#e5e2e1] hover:text-[#ffd700] hover:bg-[#1a160d] transition-all text-right active:scale-95"
                >
                  <span>{link.label}</span>
                  <span className="text-[#d4af37] text-xs">←</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#d4af37]/20 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs text-[#ffd700] font-semibold bg-[#1a160d] px-3.5 py-2 rounded-xl border border-[#d4af37]/30"
              >
                <span>تتبع طلبك بالرقم المرجعي</span>
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-[#d0c5af] hover:text-[#ffd700]"
              >
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>دخول الإدارة</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
