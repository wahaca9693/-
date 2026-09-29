import React, { useState } from 'react';
import { Product } from '../types/store';
import {
  Star,
  ShieldCheck,
  Truck,
  Check,
  Heart,
  ShoppingBag,
  Zap,
  AlertTriangle,
  Banknote,
  Minus,
  Plus,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatIQD } from '../lib/format';

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
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} size="lg">
      <div key={product.id} className="grid md:grid-cols-2 gap-6 p-5 sm:p-7">
        {/* الصورة + الضمانات */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface-2">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.discountPercent && (
              <span className="absolute top-3 right-3 mnr-badge bg-danger text-white px-3 py-1">
                خصم {product.discountPercent}%
              </span>
            )}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="المفضلة"
              className={`absolute top-3 left-3 w-10 h-10 grid place-items-center rounded-full backdrop-blur transition-colors ${
                isWishlisted ? 'bg-danger text-white' : 'bg-surface/85 text-ink-2 hover:text-danger'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-2 border border-line text-[11px] text-ink-2">
              <Truck className="w-4 h-4 text-brand-ink shrink-0" />
              شحن 5,000 د.ع لكل المحافظات
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-2 border border-line text-[11px] text-ink-2">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              كفالة {product.warranty || '12 شهراً'}
            </div>
          </div>
        </div>

        {/* التفاصيل */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="mnr-badge mnr-badge-brand">{product.brand}</span>
              <span className="flex items-center gap-1 text-xs">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="font-extrabold text-ink">{product.rating}</span>
                <span className="text-ink-3">({product.reviewsCount} تقييم)</span>
              </span>
            </div>
            <h2 className="mnr-h2 text-xl sm:text-2xl text-ink leading-snug">{product.name}</h2>
            <p className="text-xs text-ink-3 mt-1 mnr-num text-right">{product.nameEn}</p>
          </div>

          {/* السعر */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-brand-soft border border-brand/25">
            <div>
              <p className="text-[11px] text-ink-2">السعر الرسمي</p>
              <p className="mnr-num text-2xl leading-tight font-extrabold text-gold whitespace-nowrap">
                {formatIQD(product.price)}
              </p>
              {product.oldPrice && product.oldPrice > product.price && (
                <p className="mnr-num text-sm text-ink-3 line-through whitespace-nowrap">
                  {formatIQD(product.oldPrice)}
                </p>
              )}
            </div>
            {isOutOfStock ? (
              <span className="mnr-badge mnr-badge-danger">
                <AlertTriangle className="w-3.5 h-3.5" />
                نفد المخزون
              </span>
            ) : (
              <span className="mnr-badge mnr-badge-success">متبقي {product.stock} قطعة</span>
            )}
          </div>

          <p className="text-sm text-ink-2 leading-relaxed">{product.description}</p>

          {product.specs?.length > 0 && (
            <div>
              <h3 className="text-xs font-extrabold text-ink mb-2">المواصفات المعتمدة</h3>
              <ul className="grid sm:grid-cols-2 gap-1.5">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink-2">
                    <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* الكمية */}
          {!isOutOfStock && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-2">الكمية المطلوبة</span>
              <div dir="ltr" className="flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="إنقاص"
                  className="w-8 h-8 grid place-items-center rounded-lg text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-extrabold text-ink mnr-num">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="زيادة"
                  className="w-8 h-8 grid place-items-center rounded-lg text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-2.5 mt-auto">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="mnr-btn mnr-btn-soft h-12"
            >
              <ShoppingBag className="w-4 h-4" />
              أضف للسلة
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => {
                onQuickBuy(product, quantity);
                onClose();
              }}
              className="mnr-btn mnr-btn-primary h-12"
            >
              <Zap className="w-4 h-4" />
              اطلب الآن
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-success font-semibold">
            <Banknote className="w-4 h-4" />
            الدفع كاش عند الاستلام — مع معاينة وفحص قبل الدفع
          </p>
        </div>
      </div>
    </Modal>
  );
};
