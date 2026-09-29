import React from 'react';
import { Order } from '../types/store';
import { CheckCircle2, Copy, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatIQD } from '../lib/format';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string, phone: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onTrackOrder }) => {
  if (!order) return null;

  const copyOrderNumber = () => {
    navigator.clipboard?.writeText(order.orderNumber).catch(() => undefined);
  };

  return (
    <Modal isOpen={Boolean(order)} onClose={onClose} size="sm" disableOutsideClose>
      <div className="p-6 sm:p-8 text-center">
        <div className="relative w-20 h-20 mx-auto mb-5">
          <span className="absolute -inset-2 rounded-full bg-success-soft animate-ping" />
          <span className="relative w-full h-full rounded-full bg-success-soft border-2 border-success grid place-items-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </span>
        </div>

        <h2 className="mnr-h1 text-2xl mnr-gradient-text">تم استلام طلبك بنجاح</h2>
        <p className="text-sm font-bold text-ink mt-1.5">شكراً لتسوّقك من مركز المنار للموبايل M.N.R</p>
        <p className="text-xs text-ink-3 mt-1">طلبك الآن قيد المراجعة والتجهيز في مستودعاتنا المركزية.</p>

        {/* الرقم المرجعي */}
        <div className="mt-5 p-4 rounded-xl border border-line bg-surface-2">
          <p className="text-[11px] text-ink-3">الرقم المرجعي للطلب</p>
          <div className="flex items-center justify-center gap-2.5 mt-1.5">
            <span className="mnr-num text-xl sm:text-2xl font-extrabold text-gold tracking-wider">
              {order.orderNumber}
            </span>
            <button
              type="button"
              onClick={copyOrderNumber}
              aria-label="نسخ رقم الطلب"
              className="w-8 h-8 grid place-items-center rounded-lg border border-line text-ink-3 hover:text-brand-ink hover:bg-brand-soft transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* الملخّص */}
        <dl className="mt-3 p-4 rounded-xl border border-line bg-surface-2 text-xs space-y-2 text-right">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">اسم المستلم</dt>
            <dd className="font-extrabold text-ink">{order.customerName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">محافظة التسليم</dt>
            <dd className="font-extrabold text-ink">{order.governorate} — {order.city}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">أقرب نقطة دالة</dt>
            <dd className="font-extrabold text-ink">{order.nearestLandmark}</dd>
          </div>
          <div className="flex justify-between gap-3 pt-2 border-t border-line">
            <dt className="text-ink-2 font-bold">الإجمالي (مع التوصيل)</dt>
            <dd className="text-sm font-extrabold text-gold mnr-num">{formatIQD(order.total)}</dd>
          </div>
        </dl>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-success font-semibold">
          <ShieldCheck className="w-4 h-4" />
          مشمول بضمان M.N.R وحق الفحص قبل استلام الشحنة
        </p>

        <div className="grid sm:grid-cols-2 gap-2.5 mt-6">
          <button
            type="button"
            onClick={() => onTrackOrder(order.orderNumber, order.phone)}
            className="mnr-btn mnr-btn-primary h-12 text-xs"
          >
            <Truck className="w-4 h-4" />
            متابعة وتتبع الطلب
          </button>
          <button type="button" onClick={onClose} className="mnr-btn mnr-btn-soft h-12 text-xs">
            العودة للمتجر
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
