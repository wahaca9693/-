import React from 'react';
import { Product } from '../types/store';
import { Heart, Star, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { formatIQD } from '../lib/format';

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
  const hasDiscount = Boolean(product.discountPercent) ||
    Boolean(product.oldPrice && product.oldPrice > product.price);

  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-surface overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-float">
      {/* الصورة */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpenDetails(product)}
          className="block w-full aspect-4/3 overflow-hidden bg-surface-2"
          aria-label={`عرض تفاصيل ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        {/* الشارات */}
        <div className="absolute top-3 right-3 flex flex-col items-start gap-1.5">
          {hasDiscount && (
            <span className="mnr-badge bg-danger text-white shadow-soft">
              خصم {product.discountPercent ?? Math.round((1 - product.price / (product.oldPrice as number)) * 100)}%
            </span>
          )}
          {product.badge && <span className="mnr-badge bg-surface/90 backdrop-blur text-ink-2">{product.badge}</span>}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-canvas/70 backdrop-blur-[2px] grid place-items-center">
            <span className="mnr-badge mnr-badge-danger px-3 py-1.5">نفد المخزون</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          className={`absolute top-3 left-3 w-9 h-9 grid place-items-center rounded-lg backdrop-blur transition-all ${
            isWishlisted
              ? 'bg-danger text-white'
              : 'bg-surface/85 text-ink-2 hover:text-danger hover:bg-surface'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* المحتوى */}
      <div className="flex flex-col grow p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="mnr-badge mnr-badge-brand">{product.brand}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-success">
            <Check className="w-3 h-3 stroke-[3]" />
            أصلي
          </span>
        </div>

        <button type="button" onClick={() => onOpenDetails(product)} className="text-right">
          <h3 className="text-sm font-extrabold text-ink leading-snug line-clamp-2 hover:text-brand-ink transition-colors">
            {product.name}
          </h3>
        </button>

        {product.specs?.length > 0 && (
          <ul className="mt-2 space-y-1">
            {product.specs.slice(0, 2).map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-ink-3">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-brand shrink-0" />
                <span className="line-clamp-1">{spec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-line text-[11px]">
          <span className="flex items-center gap-1 text-gold shrink-0">
            <Star className="w-3.5 h-3.5 fill-gold" />
            <span className="font-extrabold">{product.rating}</span>
            <span className="text-ink-3">({product.reviewsCount})</span>
          </span>
          <span className="flex items-center gap-1 text-ink-3 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
            <span className="truncate">كفالة {product.warranty || '12 شهر'}</span>
          </span>
        </div>

        {/* السعر + الأزرار */}
        <div className="mt-auto pt-3.5">
          <div className="flex items-end justify-between gap-2 mb-3">
            <div className="min-w-0">
              <p className="text-[10px] text-ink-3 mb-0.5">السعر الرسمي</p>
              <p className="mnr-num text-[17px] leading-tight font-extrabold text-gold whitespace-nowrap">
                {formatIQD(product.price)}
              </p>
              {product.oldPrice && product.oldPrice > product.price && (
                <p className="mnr-num text-[11px] text-ink-3 line-through whitespace-nowrap">
                  {formatIQD(product.oldPrice)}
                </p>
              )}
            </div>
            <span className="mnr-badge mnr-badge-success shrink-0">كاش</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onQuickBuy(product)}
              disabled={isOutOfStock}
              className="mnr-btn mnr-btn-primary h-11 flex-1 text-[13px]"
            >
              {isOutOfStock ? 'نفد المخزون' : 'اطلب الآن'}
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              aria-label="أضف إلى السلة"
              className="mnr-btn mnr-btn-soft h-11 w-12 px-0 shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
