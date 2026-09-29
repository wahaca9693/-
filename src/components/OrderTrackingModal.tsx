import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/store';
import { storeStorage } from '../services/storeStorage';
import { Search, Check, Truck, AlertCircle, Phone, MessageSquare, Package, CircleDot } from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatIQD } from '../lib/format';

interface OrderTrackingModalProps {
  isOpen: boolean;
  initialOrderNumber?: string;
  initialPhone?: string;
  onClose: () => void;
}

const TIMELINE_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'new', label: 'تم استلام الطلب', desc: 'تم تسجيل الفاتورة إلكترونياً وحجز الرقم المرجعي' },
  { status: 'reviewing', label: 'قيد المراجعة والتدقيق', desc: 'فحص توافق الملحقات والضمان الرسمي' },
  { status: 'confirmed', label: 'تم تأكيد الطلب', desc: 'تأكيد توفر المنتجات في مستودع المنار' },
  { status: 'processing', label: 'قيد التجهيز والتغليف', desc: 'فحص السيريال والتغليف بطبقات حماية' },
  { status: 'shipped', label: 'خرج للتوصيل', desc: 'الشحنة مع مندوب التوصيل في طريقها إليك' },
  { status: 'delivered', label: 'تم التسليم بنجاح', desc: 'معاينة وفحص الشحنة واستلام الفاتورة' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  initialOrderNumber = '',
  initialPhone = '',
  onClose,
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || 'MNR-20260929-001');
  const [phoneQuery, setPhoneQuery] = useState(initialPhone || '07801234567');
  const [order, setOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) return storeStorage.getOrderById(initialOrderNumber) || null;
    return storeStorage.getOrders()[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(true);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanOrder = orderQuery.trim().toUpperCase();
    const cleanPhone = phoneQuery.trim().replace(/\s+/g, '');
    const found = storeStorage
      .getOrders()
      .find(
        (o) =>
          (o.orderNumber.toUpperCase() === cleanOrder || o.id === cleanOrder) &&
          (!cleanPhone || o.phone.replace(/\s+/g, '').includes(cleanPhone))
      );
    setOrder(found || null);
  };

  const stageIndex = order && order.status !== 'cancelled'
    ? TIMELINE_STAGES.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="تتبع الشحنة"
      subtitle="أدخل رقم الطلب ورقم الهاتف لمتابعة المسار"
      icon={Truck}
    >
      <div className="p-5 sm:p-7 space-y-5">
        {/* البحث */}
        <form onSubmit={search} className="p-4 rounded-xl border border-line bg-surface-2 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="mnr-label" htmlFor="trk-order">
                رقم الطلب المرجعي
              </label>
              <input
                id="trk-order"
                dir="ltr"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="MNR-20260929-001"
                className="mnr-field mnr-num"
              />
            </div>
            <div>
              <label className="mnr-label" htmlFor="trk-phone">
                رقم هاتف المستلم
              </label>
              <input
                id="trk-phone"
                dir="ltr"
                type="tel"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="07XXXXXXXXX"
                className="mnr-field mnr-num"
              />
            </div>
          </div>
          <button type="submit" className="mnr-btn mnr-btn-primary w-full h-11">
            <Search className="w-4 h-4" />
            تحديث مسار الطلب
          </button>
        </form>

        {order ? (
          <div className="space-y-4">
            {/* بطاقة الطلب */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-soft border border-brand/25">
              <div>
                <p className="text-[11px] text-ink-3">رقم التتبع</p>
                <p className="mnr-num text-lg font-extrabold text-gold tracking-wider">{order.orderNumber}</p>
                <p className="text-[11px] text-ink-2 mt-0.5">المستلم: {order.customerName}</p>
              </div>
              <div className="sm:text-left">
                <p className="text-[11px] text-ink-3">وجهة الشحنة</p>
                <p className="text-sm font-extrabold text-ink">
                  {order.governorate} — {order.city}
                </p>
                <p className="text-[11px] text-ink-2 mt-0.5">أقرب دالة: {order.nearestLandmark}</p>
              </div>
            </div>

            {order.status === 'cancelled' ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-soft border border-danger/25">
                <AlertCircle className="w-5 h-5 text-danger shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-danger">تم إلغاء هذا الطلب</h4>
                  <p className="text-xs text-ink-2 mt-1">
                    يرجى التواصل مع خدمة عملاء مركز المنار للاستفسار أو إنشاء طلب بديل.
                  </p>
                </div>
              </div>
            ) : (
              /* الجدول الزمني */
              <div className="p-4 rounded-xl border border-line bg-surface-2">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
                  <span className="text-xs font-extrabold text-ink">مسار الرحلة</span>
                  <span className="mnr-badge mnr-badge-brand">
                    المرحلة {stageIndex + 1} من {TIMELINE_STAGES.length}
                  </span>
                </div>

                <ol className="relative space-y-3 pr-8">
                  <span className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-line" aria-hidden="true" />
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const done = idx < stageIndex;
                    const current = idx === stageIndex;
                    return (
                      <li key={stage.status} className="relative">
                        <span
                          className={`absolute -right-8 top-0.5 w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold transition-colors ${
                            done
                              ? 'bg-success text-white'
                              : current
                                ? 'bg-brand text-on-brand ring-4 ring-brand/20'
                                : 'bg-surface-3 text-ink-3 border border-line'
                          }`}
                        >
                          {done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <CircleDot className="w-3 h-3" />}
                        </span>

                        <div
                          className={`p-3 rounded-xl border transition-colors ${
                            current
                              ? 'border-brand/40 bg-brand-soft'
                              : done
                                ? 'border-line bg-surface'
                                : 'border-transparent bg-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-extrabold ${
                                current ? 'text-brand-ink' : done ? 'text-ink' : 'text-ink-3'
                              }`}
                            >
                              {stage.label}
                            </span>
                            {current && <span className="mnr-badge mnr-badge-brand">جاري الآن</span>}
                          </div>
                          <p className="text-[11px] text-ink-3 mt-1">{stage.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* محتويات الشحنة */}
            <div className="p-4 rounded-xl border border-line bg-surface-2">
              <h4 className="text-xs font-extrabold text-ink mb-2.5">
                محتويات الشحنة ({order.items.length})
              </h4>
              <ul className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center gap-3 pb-1.5 border-b border-line">
                    <span className="text-xs text-ink truncate">
                      <span className="mnr-num text-ink-3">{item.quantity} ×</span> {item.productName}
                    </span>
                    <span className="text-xs font-extrabold text-gold mnr-num shrink-0">
                      {formatIQD(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-xs text-ink-3 pt-2">
                <span>أجور التوصيل الثابتة</span>
                <span className="mnr-num">{formatIQD(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 mt-1 border-t border-line">
                <span className="text-sm font-extrabold text-ink">المجموع الكلي للتحصيل</span>
                <span className="text-base font-extrabold text-gold mnr-num">{formatIQD(order.total)}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              <a href={`tel:${order.phone}`} className="mnr-btn mnr-btn-soft h-11 text-xs">
                <Phone className="w-4 h-4 text-brand-ink" />
                اتصال بالمستودع
              </a>
              <a
                href={`https://wa.me/9647701234567?text=${encodeURIComponent(`مرحبا، أود الاستفسار عن طلبي رقم ${order.orderNumber}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mnr-btn mnr-btn-primary h-11 text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                واتساب المندوب
              </a>
            </div>
          </div>
        ) : (
          hasSearched && (
            <div className="p-10 text-center space-y-2 border border-line rounded-xl bg-surface-2">
              <Package className="w-9 h-9 text-ink-3 mx-auto" />
              <h3 className="mnr-h2 text-sm text-ink">لم نجد شحنة مطابقة</h3>
              <p className="text-xs text-ink-3">
                تأكد من رقم الطلب بصيغة MNR-XXXXXXXX-XXX ومن رقم الهاتف المستخدم في الطلب.
              </p>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};
