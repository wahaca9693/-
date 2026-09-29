import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/store';
import { storeStorage } from '../services/storeStorage';
import { X, Search, Check, Clock, Package, Truck, CheckCircle2, AlertCircle, Phone, MessageSquare, MapPin } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  initialOrderNumber?: string;
  initialPhone?: string;
  onClose: () => void;
}

const TIMELINE_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'new', label: 'تم استلام الطلب', desc: 'تم تسجيل بيانات الفاتورة إلكترونياً وحجز الرقم المرجعي' },
  { status: 'reviewing', label: 'قيد المراجعة والتدقيق', desc: 'فحص توافق الملحقات والضمان الرسمي وتأكيد المستلم' },
  { status: 'confirmed', label: 'تم تأكيد الطلب', desc: 'تأكيد توفر المنتجات في مستودع المنار هاتفياً' },
  { status: 'processing', label: 'قيد التجهيز والتغليف', desc: 'فحص السيريال والتغليف بطبقات حماية ممتصة للصدمات' },
  { status: 'shipped', label: 'خرج للتوصيل السريع', desc: 'الشحنة مع مندوب التوصيل في طريقها لعنوانك' },
  { status: 'delivered', label: 'تم التسليم بنجاح', desc: 'معاينة وفحص الشحنة واستلام الفاتورة الرسمية' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  initialOrderNumber = '',
  initialPhone = '',
  onClose,
}) => {
  if (!isOpen) return null;

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || 'MNR-20260929-001');
  const [phoneQuery, setPhoneQuery] = useState(initialPhone || '07801234567');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) {
      return storeStorage.getOrderById(initialOrderNumber) || null;
    }
    // Default to the first seed order if available
    const orders = storeStorage.getOrders();
    return orders[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanOrder = orderQuery.trim().toUpperCase();
    const cleanPhone = phoneQuery.trim().replace(/\s+/g, '');

    const allOrders = storeStorage.getOrders();
    const found = allOrders.find(
      (o) =>
        (o.orderNumber.toUpperCase() === cleanOrder || o.id === cleanOrder) &&
        (!cleanPhone || o.phone.replace(/\s+/g, '').includes(cleanPhone))
    );

    setSearchedOrder(found || null);
  };

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return TIMELINE_STAGES.findIndex((s) => s.status === status);
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : -1;

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/30 shadow-2xl p-5 sm:p-8 text-right text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">تتبع الشحنة المباشر</h2>
              <span className="text-xs text-[#ffd700] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-ping" />
                <span>نظام التتبع المتزامن لمحافظات العراق</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#d0c5af] hover:text-[#ffd700]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                رقم الطلب المرجعي:
              </label>
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="مثال: MNR-20260929-001"
                className="w-full h-11 px-3.5 rounded-xl bg-[#181818] border border-[#d4af37]/20 text-xs sm:text-sm text-[#ffd700] font-mono focus:outline-none focus:border-[#ffd700]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                رقم هاتف المستلم (للتحقق):
              </label>
              <input
                type="tel"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="07XXXXXXXXX"
                className="w-full h-11 px-3.5 rounded-xl bg-[#181818] border border-[#d4af37]/20 text-xs sm:text-sm text-[#f5f5f7] font-mono focus:outline-none focus:border-[#ffd700]"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>تحديث مسار الطلب</span>
          </button>
        </form>

        {/* Search Result Display */}
        {searchedOrder ? (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Order Overview Header Card */}
            <div className="p-4 rounded-2xl bg-[#18150c] border border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-[#99907c]">رقم التتبع:</span>
                <span className="text-base font-black text-[#ffd700] font-mono tracking-wider" dir="ltr">
                  {searchedOrder.orderNumber}
                </span>
                <span className="text-[11px] text-[#d0c5af] mt-0.5">
                  المستلم: {searchedOrder.customerName}
                </span>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-[#99907c]">وجهة الشحنة:</span>
                <span className="font-bold text-[#f5f5f7]">
                  {searchedOrder.governorate} - {searchedOrder.city}
                </span>
                <span className="text-[11px] text-[#ffd700]">
                  أقرب دالة: {searchedOrder.nearestLandmark}
                </span>
              </div>
            </div>

            {/* Cancelled Notice if applicable */}
            {searchedOrder.status === 'cancelled' && (
              <div className="p-4 rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffdad6] text-xs flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-[#ffb4ab] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">تم إلغاء هذا الطلب</h4>
                  <p className="mt-0.5">يرجى التواصل مع خدمة عملاء مركز المنار لأي استفسار أو لإنشاء طلب بديل.</p>
                </div>
              </div>
            )}

            {/* 6-Stage Timeline (RTL Flow) */}
            {searchedOrder.status !== 'cancelled' && (
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/15">
                  <span className="text-xs font-bold text-[#ffd700]">المخطط الزمني للرحلة</span>
                  <span className="text-[11px] text-[#99907c]">
                    المرحلة {currentStageIndex + 1} من {TIMELINE_STAGES.length}
                  </span>
                </div>

                <div className="relative space-y-4 pr-3">
                  {/* Vertical Connection Line */}
                  <div className="absolute right-[19px] top-3 bottom-3 w-[2px] bg-[#222]" />

                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.status} className="relative flex items-start gap-3.5 z-10">
                        {/* Circle Indicator */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-[#d4af37] text-[#0a0a0a] shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                              : isCurrent
                              ? 'bg-[#ffd700] text-[#0a0a0a] ring-4 ring-[#ffd700]/25 shadow-[0_0_12px_rgba(255,215,0,0.6)] animate-pulse'
                              : 'bg-[#1e1e1e] text-[#666] border border-[#333]'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </div>

                        {/* Text Description */}
                        <div
                          className={`flex-1 rounded-xl p-2.5 transition-colors ${
                            isCurrent
                              ? 'bg-[#1c180e] border border-[#d4af37]/40'
                              : 'bg-[#181818]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent ? 'text-[#ffd700]' : isDone ? 'text-[#f5f5f7]' : 'text-[#666]'
                              }`}
                            >
                              {stage.label}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-[10px] font-bold">
                                جاري الآن
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#99907c] mt-0.5">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items & Total */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2 text-xs">
              <span className="font-bold text-[#ffd700] block mb-1">
                محتويات الشحنة ({searchedOrder.items.length}):
              </span>
              {searchedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-[#222]">
                  <span className="text-[#f5f5f7] truncate max-w-[220px]">
                    {item.quantity} × {item.productName}
                  </span>
                  <span className="font-bold text-[#ffd700]">{formatIQD(item.totalPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-[#99907c]">أجور التوصيل الثابتة:</span>
                <span className="text-[#ffd700]">{formatIQD(searchedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#d4af37]/20 text-sm font-bold">
                <span className="text-[#f5f5f7]">المجموع الكلي للتحصيل:</span>
                <span className="text-base text-[#ffd700]">{formatIQD(searchedOrder.total)}</span>
              </div>
            </div>

            {/* Courier Direct Contact */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${searchedOrder.phone}`}
                className="h-11 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af37]/30 text-[#f5f5f7] text-xs font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#ffd700]" />
                <span>اتصال بالمستودع</span>
              </a>

              <a
                href={`https://wa.me/9647701234567?text=مرحبا، أود الاستفسار عن طلبي رقم ${searchedOrder.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="h-11 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واتساب المندوب</span>
              </a>
            </div>
          </div>
        ) : (
          hasSearched && (
            <div className="p-8 text-center bg-[#121212] rounded-2xl border border-[#d4af37]/20 space-y-2">
              <AlertCircle className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
              <h3 className="font-bold text-sm text-[#f5f5f7]">لم نجد شحنة مطابقة</h3>
              <p className="text-xs text-[#99907c]">
                تأكد من كتابة رقم الطلب بصيغة MNR-XXXXXXXX-XXX ورقم الهاتف المستخدم في الطلب.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
