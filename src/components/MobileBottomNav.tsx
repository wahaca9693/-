import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Package, Shield } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  onGoHome: () => void;
  onGoCategories: () => void;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onGoHome,
  onGoCategories,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
}) => {
  const item = 'flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-ink-3 active:scale-95 transition-all';

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 mnr-glass border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center px-2 py-1.5">
        <button type="button" onClick={onGoHome} className={item} aria-label="الرئيسية">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        <button type="button" onClick={onGoCategories} className={item} aria-label="الأقسام">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">الأقسام</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="سلة المشتريات"
            className="relative -mt-6 mx-auto w-14 h-14 rounded-2xl bg-brand text-on-brand grid place-items-center shadow-float active:scale-95 transition-all"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -bottom-1 text-[9px] font-extrabold">السلة</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-danger text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-canvas">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <button type="button" onClick={onOpenTracking} className={item} aria-label="تتبع الطلب">
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-bold">التتبع</span>
        </button>

        <button type="button" onClick={onOpenAdmin} className={item} aria-label="الإدارة">
          <Shield className="w-5 h-5 text-brand-ink" />
          <span className="text-[10px] font-bold">الإدارة</span>
        </button>
      </div>
    </nav>
  );
};
