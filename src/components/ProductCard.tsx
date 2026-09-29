import React from 'react';
import { Product } from '../types/store';
import { Heart, Star, ShoppingBag, Zap, Shield, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onQuickBuy,
  onToggleWishlist,
  onOpenDetails,
}) => {
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-[#d4af37]/20 p-3.5 sm:p-4 hover:border-[#d4af37]/60 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all duration-300 relative">
      <div>
        {/* Top Badges & Wishlist Trigger */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-[#ffd700] text-[#0a0a0a] text-[10px] font-extrabold shadow-sm">
                خصم {product.discountPercent}%
              </span>
            ) : null}

            {product.badge && (
              <span className="px-2 py-0.5 rounded-md bg-[#1f1b13] border border-[#d4af37]/40 text-[#ffd700] text-[10px] font-bold">
                {product.badge}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/40'
                : 'bg-[#181818] text-[#99907c] hover:text-[#ffd700] border border-[#d4af37]/20 hover:border-[#d4af37]/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#e11d48]' : ''}`} />
          </button>
        </div>

        {/* Thumbnail Image Container */}
        <div
          onClick={() => onOpenDetails(product)}
          className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-[#070707] flex items-center justify-center cursor-pointer mb-3.5 border border-[#d4af37]/10"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent opacity-60" />

          {/* Stock Availability Pill */}
          <div className="absolute bottom-2 right-2">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#93000a]/90 border border-[#ffb4ab]/40 text-[#ffdad6] text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>نفذ المخزون</span>
              </span>
            ) : product.stock <= 5 ? (
              <span className="px-2 py-0.5 rounded bg-[#1f1b13]/90 border border-[#ffd700]/50 text-[#ffd700] text-[10px] font-bold">
                متبقي {product.stock} قطع فقط
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#0d0d0d]/85 text-[#30d158] text-[10px] font-bold">
                متوفر بالمستودع
              </span>
            )}
          </div>
        </div>

        {/* Brand & Ratings */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-[#d4af37] tracking-wider uppercase">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-[#ffd700]">
            <Star className="w-3 h-3 fill-[#ffd700]" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-[#99907c] text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm sm:text-base font-bold text-[#f5f5f7] hover:text-[#ffd700] transition-colors line-clamp-2 cursor-pointer mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Warranty hint */}
        <div className="flex items-center gap-1 text-[11px] text-[#99907c] mb-3">
          <Shield className="w-3 h-3 text-[#d4af37]" />
          <span className="truncate">{product.warranty}</span>
        </div>
      </div>

      {/* Pricing and Action CTAs */}
      <div className="pt-2 border-t border-[#d4af37]/15 mt-auto">
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-[#ffd700] tracking-tight">
              {formatIQD(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-[#99907c] line-through">
                {formatIQD(product.oldPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[#99907c] bg-[#141414] px-2 py-0.5 rounded border border-[#d4af37]/10">
            شحن 5,000 د.ع
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-5 gap-2">
          {/* Add to Cart (Span 4) */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`col-span-4 h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#1a1a1a] text-[#636366] border border-[#333] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}</span>
          </button>

          {/* Quick Buy Flash (Span 1) */}
          <button
            onClick={() => onQuickBuy(product)}
            disabled={isOutOfStock}
            aria-label="Quick Buy"
            title="شراء فوري مباشر"
            className={`col-span-1 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#1a1a1a] text-[#636366] border border-[#333] cursor-not-allowed'
                : 'bg-[#18150c] hover:bg-[#252012] border border-[#d4af37]/40 text-[#ffd700] active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4 text-[#ffd700]" />
          </button>
        </div>
      </div>
    </div>
  );
};
