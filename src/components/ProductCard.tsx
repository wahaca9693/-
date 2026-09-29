import React from 'react';
import { Product } from '../types/store';
import { Heart, Star, ShoppingBag, Truck, Check, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="flex flex-col justify-between rounded-2xl bg-[#0e0e0e] border border-[#242424] hover:border-[#ffd700]/70 p-4 transition-all duration-300 text-right shadow-lg group hover:shadow-2xl">
      <div>
        {/* Top Header: Brand & Heart */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#ffd700] uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/20">
              {product.brand}
            </span>
            <span className="text-[11px] text-[#30d158] font-medium flex items-center gap-0.5">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>أصلي 100%</span>
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-[#e11d48]/15 text-[#e11d48]'
                : 'text-[#666] hover:text-[#ffd700] bg-[#161616]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#e11d48]' : ''}`} />
          </button>
        </div>

        {/* Product Photo */}
        <div
          onClick={() => onOpenDetails(product)}
          className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-[#070707] flex items-center justify-center cursor-pointer mb-3 border border-[#1f1f1f]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {product.discountPercent ? (
            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#ffd700] text-[#0a0a0a] text-xs font-black shadow-md">
              خصم {product.discountPercent}%
            </span>
          ) : null}

          {isOutOfStock && (
            <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#93000a] text-[#ffdad6] text-xs font-bold shadow-md">
              نفذ المخزون
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm sm:text-base font-bold text-[#f5f5f7] group-hover:text-[#ffd700] transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Key Specs Highlights */}
        {product.specs && product.specs.length > 0 && (
          <div className="space-y-1 mb-3">
            <p className="text-[11px] text-[#8e8e93] line-clamp-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#ffd700]" />
              <span>{product.specs[0]}</span>
            </p>
            {product.specs[1] && (
              <p className="text-[11px] text-[#8e8e93] line-clamp-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#ffd700]" />
                <span>{product.specs[1]}</span>
              </p>
            )}
          </div>
        )}

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-xs text-[#8e8e93] mb-3 pt-1 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-1 text-[#ffd700]">
            <Star className="w-3.5 h-3.5 fill-[#ffd700]" />
            <span className="font-bold text-xs">{product.rating}</span>
            <span className="text-[#636366] text-[10px]">({product.reviewsCount} تقييم)</span>
          </div>

          <span className="text-[11px] text-[#8e8e93] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
            <span>كفالة 12 شهر</span>
          </span>
        </div>
      </div>

      {/* Pricing & Direct Order Section */}
      <div className="pt-3 border-t border-[#222] space-y-2.5">
        {/* Crystal Clear, Giant, High-Contrast Price in IQD */}
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] text-[#8e8e93]">السعر الرسمي:</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#ffd700] tracking-tight">
                {formatIQD(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-[#636366] line-through font-medium">
                  {formatIQD(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="text-left">
            <span className="text-[11px] text-[#30d158] font-bold block">
              الدفع كاش
            </span>
            <span className="text-[10px] text-[#8e8e93]">
              عند الاستلام
            </span>
          </div>
        </div>

        {/* Clear Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Main "Order Now (Cash on Delivery)" Button */}
          <button
            onClick={() => onQuickBuy(product)}
            disabled={isOutOfStock}
            className={`col-span-3 h-11 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
                : 'bg-[#ffd700] hover:bg-[#e6c200] text-[#0a0a0a] shadow-[0_2px_12px_rgba(255,215,0,0.3)] active:scale-95'
            }`}
          >
            <span>{isOutOfStock ? 'نفذ المخزون' : 'اطلب الآن (الدفع كاش)'}</span>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            title="أضف إلى سلة المشتريات"
            className={`col-span-1 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
                : 'bg-[#181818] hover:bg-[#222] border border-[#333] text-[#ffd700] active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Reassurance Footer Line */}
        <p className="text-[10px] text-[#8e8e93] text-center pt-0.5">
          توصيل 5,000 د.ع لكافة المحافظات • فحص ومعاينة قبل الدفع
        </p>
      </div>
    </div>
  );
};
