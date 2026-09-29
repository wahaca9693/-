import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { Search, ShoppingBag, Heart, Shield, Sparkles } from 'lucide-react';
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
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Smooth auto-hide on scroll down, reappear on scroll up
      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY.current + 6) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavCategoryClick = (cat: ProductCategory | 'all') => {
    onSelectCategory(cat);
    onScrollToSection('products-catalog');
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#ffd700]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1c1c1c]'
      }`}
    >
      {/* Top Reassurance Ticker Bar (Desktop) */}
      <div className="hidden lg:block bg-[#121008] border-b border-[#ffd700]/15 py-1 px-4 text-center text-xs text-[#ffd700]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
            <span className="text-[#e5e2e1] font-medium">أجهزة أصلية 100% مختومة بكفالة الوكالة 12 شهراً</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <span>توصيل 5,000 د.ع ثابت لكافة محافظات العراق</span>
            <span>•</span>
            <span className="text-[#30d158]">الدفع نقداً (كاش) عند الاستلام والمعاينة</span>
          </div>
          <button
            onClick={onOpenTracking}
            className="text-xs text-[#ffd700] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>تتبع شحنتك المباشر</span>
            <span>←</span>
          </button>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Official Brand Logo */}
          <Logo size="sm" onClick={() => onScrollToSection('hero')} />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm">
            <button
              onClick={() => onScrollToSection('hero')}
              className="text-[#a1a1a6] hover:text-[#ffd700] transition-colors cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleNavCategoryClick('phones')}
              className={`transition-colors cursor-pointer font-medium ${
                activeCategory === 'phones' ? 'text-[#ffd700] font-bold' : 'text-[#a1a1a6] hover:text-[#ffd700]'
              }`}
            >
              📱 الهواتف
            </button>
            <button
              onClick={() => handleNavCategoryClick('chargers')}
              className={`transition-colors cursor-pointer font-medium ${
                activeCategory === 'chargers' ? 'text-[#ffd700] font-bold' : 'text-[#a1a1a6] hover:text-[#ffd700]'
              }`}
            >
              🔌 الشواحن
            </button>
            <button
              onClick={() => handleNavCategoryClick('audio')}
              className={`transition-colors cursor-pointer font-medium ${
                activeCategory === 'audio' ? 'text-[#ffd700] font-bold' : 'text-[#a1a1a6] hover:text-[#ffd700]'
              }`}
            >
              🎧 السماعات
            </button>
            <button
              onClick={() => handleNavCategoryClick('powerbanks')}
              className={`transition-colors cursor-pointer font-medium ${
                activeCategory === 'powerbanks' ? 'text-[#ffd700] font-bold' : 'text-[#a1a1a6] hover:text-[#ffd700]'
              }`}
            >
              🔋 البطاريات
            </button>
            <button
              onClick={() => handleNavCategoryClick('cases')}
              className={`transition-colors cursor-pointer font-medium ${
                activeCategory === 'cases' ? 'text-[#ffd700] font-bold' : 'text-[#a1a1a6] hover:text-[#ffd700]'
              }`}
            >
              🛡️ الإكسسوارات
            </button>
            <button
              onClick={() => onScrollToSection('offers')}
              className="text-[#ffd700] hover:text-white font-bold transition-colors cursor-pointer"
            >
              العروض 🔥
            </button>
            <button
              onClick={() => onScrollToSection('maintenance')}
              className="text-[#a1a1a6] hover:text-[#ffd700] transition-colors cursor-pointer"
            >
              الصيانة
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#d0c5af] hover:text-[#ffd700] border border-[#2a2a2a] flex items-center justify-center transition-colors cursor-pointer"
              title="بحث عن منتج أو ماركة"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative w-9 h-9 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#d0c5af] hover:text-[#ffd700] border border-[#2a2a2a] flex items-center justify-center transition-colors cursor-pointer"
              title="المفضلة"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e11d48] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#ffd700] hover:bg-[#e6c200] text-[#0a0a0a] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>السلة</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0a0a0a] text-[#ffd700] text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Shield (Desktop) */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex w-9 h-9 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#8e8e93] hover:text-[#ffd700] border border-[#2a2a2a] items-center justify-center transition-colors cursor-pointer"
              title="لوحة الإدارة"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
