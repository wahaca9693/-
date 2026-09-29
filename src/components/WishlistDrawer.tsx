import React from 'react';
import { Product } from '../types/store';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { formatIQD } from '../lib/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistIds: string[];
  allProducts: Product[];
  onClose: () => void;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistIds,
  allProducts,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  const items = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="قائمة المفضلة"
      count={items.length}
      icon={Heart}
      footer={
        <button type="button" onClick={onClose} className="mnr-btn mnr-btn-soft w-full h-11">
          <span>متابعة التسوّق</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      }
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
          <span className="w-16 h-16 rounded-full bg-surface-2 border border-line grid place-items-center text-ink-3">
            <Heart className="w-8 h-8" />
          </span>
          <h3 className="mnr-h2 text-base text-ink">لم تحفظ أي منتج بعد</h3>
          <p className="text-xs text-ink-3 max-w-[15rem]">
            اضغط رمز القلب عند أي منتج لحفظه والعودة إليه في أي وقت.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((product) => (
            <li key={product.id} className="flex gap-3 p-3 rounded-xl border border-line bg-surface-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover bg-surface shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-brand-ink">{product.brand}</span>
                    <h4 className="text-xs font-extrabold text-ink line-clamp-1">{product.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFromWishlist(product.id)}
                    aria-label="إزالة"
                    className="text-ink-3 hover:text-danger transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-gold mnr-num">{formatIQD(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="mnr-btn mnr-btn-primary h-8 px-3 text-[11px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    للسلة
                  </button>
                </div>
              </div>
            </li>
          ))}

          <li className="pt-1 flex items-center gap-1.5 text-[11px] text-ink-3 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            المنتجات المحفوظة تبقى محفوظة على جهازك
          </li>
        </ul>
      )}
    </Drawer>
  );
};
