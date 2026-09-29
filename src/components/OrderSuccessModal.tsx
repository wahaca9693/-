import React from 'react';
import { Order } from '../types/store';
import { CheckCircle2, Copy, Truck, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string, phone: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    alert('تم نسخ رقم الطلب بنجاح: ' + order.orderNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#141414] to-[#080808] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.25)] p-6 sm:p-8 text-center text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Golden Check Crest */}
        <div className="relative w-20 h-20 mx-auto rounded-full bg-[#1c180e] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.4)] mb-4">
          <CheckCircle2 className="w-10 h-10 animate-scale" />
          <div className="absolute -inset-1 rounded-full bg-[#ffd700]/20 animate-ping pointer-events-none" />
        </div>

        {/* Success Headings */}
        <h2 className="text-2xl font-black gold-gradient-text">
          تم استلام طلبك بنجاح ✓
        </h2>
        <p className="text-sm text-[#e5e2e1] font-semibold mt-1">
          شكراً لتسوقك من مركز المنار للموبايل M.N.R
        </p>
        <p className="text-xs text-[#99907c] mt-1">
          طلبك الآن قيد المراجعة والتجهيز في مستودعاتنا المركزية.
        </p>

        {/* Unique Order Code Box */}
        <div className="mt-5 p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/30 space-y-2">
          <span className="text-xs text-[#99907c] block">الرقم المرجعي الموحد للطلب:</span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-[#ffd700] font-mono tracking-wider" dir="ltr">
              {order.orderNumber}
            </span>
            <button
              onClick={copyOrderNumber}
              className="p-1.5 rounded-lg bg-[#1c1b1b] hover:bg-[#252012] border border-[#d4af37]/20 text-[#d4af37] transition-colors"
              title="نسخ رقم الطلب"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Brief Ledger */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#0d0d0d] border border-[#d4af37]/15 text-xs text-right space-y-2">
          <div className="flex justify-between">
            <span className="text-[#99907c]">اسم المستلم:</span>
            <span className="font-bold text-[#f5f5f7]">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#99907c]">محافظة التسليم:</span>
            <span className="font-bold text-[#f5f5f7]">{order.governorate} ({order.city})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#99907c]">أقرب نقطة دالة:</span>
            <span className="text-[#ffd700] font-medium">{order.nearestLandmark}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#d4af37]/15 font-bold">
            <span className="text-[#d0c5af]">الإجمالي المطلوب (مع التوصيل):</span>
            <span className="text-sm text-[#ffd700]">{formatIQD(order.total)}</span>
          </div>
        </div>

        {/* Trust Note */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#30d158]">
          <ShieldCheck className="w-4 h-4" />
          <span>مشمول بضمان M.N.R الذهبي وحق الفحص قبل استلام الشحنة</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => {
              onTrackOrder(order.orderNumber, order.phone);
              onClose();
            }}
            className="h-12 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>متابعة وتتبع الطلب</span>
          </button>

          <button
            onClick={onClose}
            className="h-12 rounded-xl bg-[#141414] hover:bg-[#1a160d] border border-[#d4af37]/30 text-[#f5f5f7] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>العودة للمتجر</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
