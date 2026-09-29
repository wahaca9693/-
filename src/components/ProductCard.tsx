import React from 'react';
import { Product } from '../types/store';
import { Heart, Star, ShoppingBag, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

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
    <div className="group flex flex-col justify-between rounded-2xl bg-[#0f0f0f] border border-[#26241e] hover:border-[#d4af37]/60 p-4 transition-all duration-300 relative text-right shadow-sm hover:shadow-xl">
      <div>
        {/* Top Header: Brand & Wishlist Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#ffd700] tracking-wider uppercase">
              {product.brand}
            </span>
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-[#ffd700] text-[#0a0a0a] text-[10px] font-black">
                وفر {product.discountPercent}%
              </span>
            ) : null}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-[#e11d48]/15 text-[#e11d48] border border-[#e11d48]/30'
                : 'bg-[#181818] text-[#8e8e93] hover:text-[#ffd700] border border-[#333]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#e11d48]' : ''}`} />
          </button>
        </div>

        {/* Thumbnail Image Container */}
        <div
          onClick={() => onOpenDetails(product)}
          className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-[#070707] flex items-center justify-center cursor-pointer mb-3.5 border border-[#222]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent opacity-50" />

          {/* Availability Status */}
          <div className="absolute bottom-2 right-2">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#93000a]/90 text-[#ffdad6] text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>نفذ المخزون</span>
              </span>
            ) : product.stock <= 5 ? (
              <span className="px-2 py-0.5 rounded bg-[#1f1b13]/90 text-[#ffd700] border border-[#ffd700]/30 text-[10px] font-semibold">
                متبقي {product.stock} قطع
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Rating & Warranty Badge */}
        <div className="flex items-center justify-between text-xs text-[#8e8e93] mb-1.5">
          <div className="flex items-center gap-1 text-[#ffd700]">
            <Star className="w-3.5 h-3.5 fill-[#ffd700]" />
            <span className="font-bold text-[11px]">{product.rating}</span>
            <span className="text-[#636366] text-[10px]">({product.reviewsCount})</span>
          </div>

          <span className="text-[11px] text-[#8e8e93] truncate max-w-[130px]">
            {product.warranty}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm sm:text-base font-bold text-[#f5f5f7] hover:text-[#ffd700] transition-colors line-clamp-1 cursor-pointer mb-3"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      {/* Pricing and Action CTAs */}
      <div className="pt-3 border-t border-[#222]">
        {/* Price Row: Very clear and high contrast */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-[#ffd700] font-sans tracking-tight">
              {formatIQD(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-[#636366] line-through">
                {formatIQD(product.oldPrice)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#8e8e93]">
            شحن 5,000 د.ع
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Add to Cart (Span 3) */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`col-span-3 h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#181818] text-[#555] cursor-not-allowed border border-[#2a2a2a]'
                : 'bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] shadow-sm hover:brightness-105 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'نفذ المخزون' : 'أضف للسلة'}</span>
          </button>

          {/* Quick Buy (Span 1) */}
          <button
            onClick={() => onQuickBuy(product)}
            disabled={isOutOfStock}
            aria-label="Quick Buy"
            title="شراء فوري مباشر"
            className={`col-span-1 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#181818] text-[#555] cursor-not-allowed border border-[#2a2a2a]'
                : 'bg-[#181818] hover:bg-[#222] border border-[#d4af37]/30 text-[#ffd700] active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4 text-[#ffd700]" />
          </button>
        </div>
      </div>
    </div>
  );
};
