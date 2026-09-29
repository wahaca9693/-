import React from 'react';
import { Home, Grid, ShoppingBag, Truck, Shield } from 'lucide-react';

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
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#d4af37]/25 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around">
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#d0c5af] hover:text-[#ffd700] active:scale-95 transition-all"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">الرئيسية</span>
        </button>

        <button
          onClick={onGoCategories}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#d0c5af] hover:text-[#ffd700] active:scale-95 transition-all"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">الأقسام</span>
        </button>

        {/* Central Prominent Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center -top-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0a0a0a] text-[#ffd700] text-[10px] font-extrabold flex items-center justify-center border border-[#ffd700]">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] font-extrabold mt-0.5">السلة</span>
        </button>

        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#d0c5af] hover:text-[#ffd700] active:scale-95 transition-all"
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">التتبع</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#d0c5af] hover:text-[#ffd700] active:scale-95 transition-all"
        >
          <Shield className="w-5 h-5 text-[#ffd700]" />
          <span className="text-[10px] font-medium mt-1">الإدارة</span>
        </button>
      </div>
    </div>
  );
};
