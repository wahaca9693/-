import React from 'react';
import { CartItem } from '../types/store';
import { X, Trash2, ShoppingBag, ArrowLeft, Plus, Minus, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  deliveryFee: number;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
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
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = cart.length > 0 ? subtotal + deliveryFee : 0;

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
              <div className="w-9 h-9 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-[#f5f5f7]">سلة المشتريات</h2>
                <span className="text-xs text-[#99907c]">{cart.length} أصناف مضافة</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-[#99907c] hover:text-[#ff453a] transition-colors px-2 py-1"
                  title="إفراغ السلة"
                >
                  إفراغ الكل
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-lg bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#d0c5af] hover:text-[#ffd700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#141414] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <ShoppingBag className="w-10 h-10 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-[#f5f5f7]">سلتك فارغة حالياً</h3>
                <p className="text-xs text-[#99907c] max-w-xs">
                  تصفح أحدث الهواتف والسماعات والشواحن الأصلية وأضف ما يناسبك إلى السلة.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0d0d0d] font-bold text-xs shadow-md"
                >
                  استعراض المنتجات
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-[#121212] border border-[#d4af37]/15 shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-[#070707] border border-[#d4af37]/20 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] text-[#d4af37] font-semibold uppercase">
                          {item.product.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#f5f5f7] line-clamp-1">
                          {item.product.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#99907c] hover:text-[#ff453a] transition-colors p-1"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs sm:text-sm font-bold text-[#ffd700]">
                        {formatIQD(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-[#1c1b1b] border border-[#d4af37]/30 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#ffd700] hover:bg-[#252012]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#f5f5f7]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#ffd700] hover:bg-[#252012] disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary Ledger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#d4af37]/20 bg-[#0f0f0f] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#d0c5af]">
                  <span>مجموع المنتجات:</span>
                  <span className="font-bold text-[#f5f5f7]">{formatIQD(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center text-[#d0c5af]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>أجور التوصيل الثابتة (كافة المحافظات):</span>
                  </span>
                  <span className="font-bold text-[#ffd700]">{formatIQD(deliveryFee)}</span>
                </div>

                <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#f5f5f7]">المجموع النهائي:</span>
                  <span className="text-xl font-black text-[#ffd700]">{formatIQD(total)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>متابعة إتمام الطلب (Checkout)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
