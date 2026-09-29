import React, { useState } from 'react';
import { Product } from '../types/store';
import { X, Star, ShieldCheck, Truck, Check, Heart, ShoppingBag, Zap, AlertTriangle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickBuy: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onQuickBuy,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/30 shadow-2xl p-5 sm:p-8 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#d0c5af] hover:text-[#ffd700] hover:bg-[#252012] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start mt-2">
          {/* Product Image Section */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#070707] border border-[#d4af37]/20 flex items-center justify-center shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />

              {/* Discount Tag */}
              {product.discountPercent ? (
                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-[#ffd700] text-[#0a0a0a] text-xs font-black shadow-md">
                  خصم {product.discountPercent}%
                </div>
              ) : null}

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/40'
                    : 'bg-[#141414]/80 text-[#d0c5af] hover:text-[#ffd700] border border-[#d4af37]/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#e11d48]' : ''}`} />
              </button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#121212] border border-[#d4af37]/15 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span className="text-[#d0c5af]">شحن 5,000 د.ع لكافة المحافظات</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121212] border border-[#d4af37]/15 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span className="text-[#d0c5af]">كفالة استبدال وفحص فوري</span>
              </div>
            </div>
          </div>

          {/* Product Specs & Purchase Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-[#d4af37] tracking-wider uppercase">
                  {product.brand} • رسمي
                </span>
                <div className="flex items-center gap-1 text-xs text-[#ffd700]">
                  <Star className="w-4 h-4 fill-[#ffd700]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#99907c]">({product.reviewsCount} تقييم)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f7] leading-tight">
                {product.name}
              </h2>
              <span className="text-xs text-[#99907c] block mt-0.5" dir="ltr">
                {product.nameEn}
              </span>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl bg-[#18150c] border border-[#d4af37]/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#99907c]">السعر الرسمي:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#ffd700]">
                    {formatIQD(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-[#99907c] line-through">
                      {formatIQD(product.oldPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>نفذ المخزون</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#30d158]/15 border border-[#30d158]/30 text-[#30d158] text-xs font-bold">
                    متبقي {product.stock} قطع في المخزن
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#d0c5af] leading-relaxed">
              {product.description}
            </p>

            {/* Specs Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-[#d4af37]">المواصفات الفنية المعتمدة:</span>
              <ul className="space-y-1 text-xs text-[#e5e2e1]">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-[#d0c5af]">الكمية المطلوبة:</span>
                <div className="flex items-center gap-3 bg-[#121212] border border-[#d4af37]/30 rounded-xl px-2 py-1">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-[#1c1b1b] flex items-center justify-center text-lg font-bold text-[#ffd700] hover:bg-[#252012] disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#f5f5f7]">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg bg-[#1c1b1b] flex items-center justify-center text-lg font-bold text-[#ffd700] hover:bg-[#252012] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={isOutOfStock}
                className="h-12 rounded-xl bg-[#141414] hover:bg-[#1f1b12] border border-[#d4af37]/40 text-[#ffd700] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>أضف إلى السلة</span>
              </button>

              <button
                onClick={() => {
                  onQuickBuy(product, quantity);
                  onClose();
                }}
                disabled={isOutOfStock}
                className="h-12 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>شراء الآن</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
