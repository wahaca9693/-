import React from 'react';
import { Product } from '../types/store';
import { X, Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

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
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-r border-[#d4af37]/30 shadow-2xl flex flex-col justify-between text-right">
          {/* Header */}
          <div className="p-5 border-b border-[#d4af37]/20 flex items-center justify-between bg-[#121212]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#e11d48]">
                <Heart className="w-5 h-5 fill-[#e11d48]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-[#f5f5f7]">قائمة المفضلة</h2>
                <span className="text-xs text-[#99907c]">{wishlistedProducts.length} منتجات محفوظة</span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-lg bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#d0c5af] hover:text-[#ffd700]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Heart className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-bold text-[#f5f5f7]">لم تحفظ أي منتج بالمفضلة بعد</h3>
                <p className="text-xs text-[#99907c] max-w-xs">
                  اضغط على رمز القلب عند أي منتج لحفظه والعودة إليه في أي وقت لاحقاً.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0d0d0d] font-bold text-xs shadow-md"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-[#121212] border border-[#d4af37]/15 shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#070707] border border-[#d4af37]/20 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-[#d4af37] font-semibold uppercase">
                          {product.brand}
                        </span>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-[#99907c] hover:text-[#ff453a] p-0.5"
                          title="إزالة من المفضلة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-[#f5f5f7] line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#ffd700]">
                        {formatIQD(product.price)}
                      </span>
                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>نقل للسلة</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#d4af37]/20 bg-[#0f0f0f]">
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-[#181818] border border-[#d4af37]/30 text-[#d0c5af] hover:text-[#ffd700] font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>متابعة التسوق</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
