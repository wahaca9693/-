import React from 'react';
import { CartItem } from '../types/store';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, Truck, Banknote, Package } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { formatIQD } from '../lib/format';
import { deliveryService } from '../services/deliveryService';
import { IRAQ_GOVERNORATES } from '../data/initialData';
import { MapPin, Clock } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  deliveryFee: number;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  governorate: string;
  onSelectGovernorate: (governorate: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  deliveryFee,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  governorate,
  onSelectGovernorate,
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // تقدير أجور التوصيل حسب المحافظة المختارة
  const quote = deliveryService.quote(governorate, subtotal);
  const fee = quote.available ? quote.fee : deliveryFee;
  const total = cart.length > 0 ? subtotal + fee : 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="سلة المشتريات"
      count={itemsCount}
      icon={ShoppingBag}
      footer={
        cart.length > 0 && (
          <div className="space-y-3.5">
            {/* اختيار المحافظة لمعرفة أجور التوصيل قبل الدفع */}
            <div>
              <label className="mnr-label flex items-center gap-1.5" htmlFor="cart-gov">
                <MapPin className="w-3.5 h-3.5" />
                المحافظة للتوصيل
              </label>
              <select
                id="cart-gov"
                value={governorate}
                onChange={(e) => onSelectGovernorate(e.target.value)}
                className="mnr-field h-10"
              >
                {IRAQ_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-2">مجموع المنتجات</dt>
                <dd className="font-extrabold text-ink mnr-num">{formatIQD(subtotal)}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-ink-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-ink" />
                  أجور التوصيل — {governorate}
                </dt>
                <dd className={`font-extrabold mnr-num ${quote.free ? 'text-success' : 'text-brand-ink'}`}>
                  {quote.free ? 'مجاني' : formatIQD(fee)}
                </dd>
              </div>
              {quote.etaDays > 0 && (
                <div className="flex justify-between items-center">
                  <dt className="text-ink-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink-3" />
                    الوصول المتوقع
                  </dt>
                  <dd className="text-ink-2 font-bold">خلال {quote.etaDays} يوم</dd>
                </div>
              )}
              <div className="pt-2.5 border-t border-line flex justify-between items-baseline">
                <dt className="mnr-h2 text-sm text-ink">المجموع النهائي</dt>
                <dd className="text-xl font-extrabold text-gold mnr-num">{formatIQD(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="mnr-btn mnr-btn-primary w-full h-12"
            >
              <span>متابعة الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-success font-semibold">
              <Banknote className="w-4 h-4" />
              تدفع نقداً للمندوب بعد معاينة الطلب
            </p>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
          <span className="w-20 h-20 rounded-full bg-surface-2 border border-line grid place-items-center text-ink-3">
            <ShoppingBag className="w-9 h-9" />
          </span>
          <h3 className="mnr-h2 text-lg text-ink">سلتك فارغة حالياً</h3>
          <p className="text-xs text-ink-3 max-w-[16rem]">
            تصفّح أحدث الهواتف والسماعات والشواحن الأصلية وأضف ما يناسبك إلى السلة.
          </p>
          <button type="button" onClick={onClose} className="mnr-btn mnr-btn-soft">
            <Package className="w-4 h-4" />
            استعراض المنتجات
          </button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {cart.map((item) => (
            <li
              key={item.product.id}
              className="flex gap-3 p-3 rounded-xl border border-line bg-surface-2"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover bg-surface shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-brand-ink">{item.product.brand}</span>
                    <h4 className="text-xs font-extrabold text-ink line-clamp-1">{item.product.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    aria-label="حذف"
                    className="text-ink-3 hover:text-danger transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-gold mnr-num whitespace-nowrap">
                    {formatIQD(item.product.price * item.quantity)}
                  </span>

                  <div dir="ltr" className="flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="إنقاص الكمية"
                      className="w-7 h-7 grid place-items-center rounded-md text-brand-ink hover:bg-brand-soft transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-extrabold text-ink mnr-num">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      aria-label="زيادة الكمية"
                      className="w-7 h-7 grid place-items-center rounded-md text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}

          <li className="pt-2">
            <button
              type="button"
              onClick={onClearCart}
              className="w-full mnr-btn mnr-btn-ghost h-9 text-xs text-ink-3 hover:text-danger"
            >
              <Trash2 className="w-3.5 h-3.5" />
              إفراغ السلة بالكامل
            </button>
          </li>
        </ul>
      )}
    </Drawer>
  );
};
