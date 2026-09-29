import React, { useState } from 'react';
import { CartItem, Order } from '../types/store';
import { IRAQ_GOVERNORATES } from '../data/initialData';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Home, 
  Flag, 
  AlertCircle,
  Banknote,
  CheckCircle2
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  deliveryFee: number;
  onClose: () => void;
  onSubmitOrder: (orderData: {
    customerName: string;
    phone: string;
    governorate: string;
    city: string;
    district: string;
    address: string;
    nearestLandmark: string;
    notes?: string;
    paymentMethod: 'cod';
  }) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  deliveryFee,
  onClose,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  // Checkout step: 'form' | 'review'
  const [step, setStep] = useState<'form' | 'review'>('form');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(IRAQ_GOVERNORATES[0]);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');
  const [notes, setNotes] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  // Iraqi Phone Validation (07XXXXXXXXX - 11 digits)
  const validateIraqiPhone = (val: string): boolean => {
    const clean = val.replace(/\s+/g, '');
    const iraqiRegex = /^07[3-9][0-9]{8}$/;
    return iraqiRegex.test(clean);
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 3) {
      newErrors.customerName = 'يرجى كتابة الاسم الثلاثي للزبون بشكل صحيح';
    }

    if (!phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب لتأكيد التوصيل';
    } else if (!validateIraqiPhone(phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقماً (مثال: 07801234567)';
    }

    if (!governorate) {
      newErrors.governorate = 'يرجى اختيار المحافظة';
    }

    if (!city.trim()) {
      newErrors.city = 'يرجى إدخال المدينة أو القضاء';
    }

    if (!district.trim()) {
      newErrors.district = 'يرجى إدخال المنطقة أو الحي';
    }

    if (!address.trim()) {
      newErrors.address = 'يرجى إدخال تفاصيل العنوان (الشارع / الزقاق / الدار)';
    }

    if (!nearestLandmark.trim()) {
      newErrors.nearestLandmark = 'يرجى كتابة أقرب نقطة دالة لتسهيل وصول المندوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep('review');
  };

  const handleFinalSubmit = () => {
    onSubmitOrder({
      customerName: customerName.trim(),
      phone: phone.trim().replace(/\s+/g, ''),
      governorate,
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
      nearestLandmark: nearestLandmark.trim(),
      notes: notes.trim(),
      paymentMethod: 'cod',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-[#0e0e0e] border border-[#d4af37]/40 shadow-2xl p-5 sm:p-8 text-right text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#f5f5f7]">
                {step === 'form' ? 'طلب التوصيل المنزلي' : 'مراجعة وتأكيد الطلب'}
              </h2>
              <span className="text-xs text-[#8e8e93]">
                {step === 'form' ? 'املأ بيانات التوصيل وسيتواصل معك المندوب' : 'التدقيق النهائي للمنتجات والعنوان'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-[#181818] border border-[#2b2b2b] flex items-center justify-center text-[#8e8e93] hover:text-[#ffd700] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROMINENT REASSURING CASH ON DELIVERY BANNER */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#17140b] to-[#121008] border-2 border-[#ffd700]/60 flex items-start gap-3 text-right">
          <div className="w-9 h-9 rounded-xl bg-[#ffd700] text-[#0a0a0a] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <Banknote className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#ffd700]">
              طريقة الدفع الوحيدة: الدفع كاش عند استلام ومعاينة الطلب
            </h4>
            <p className="text-xs text-[#d0c5af] leading-relaxed">
              <strong className="text-white">ملاحظة هامة:</strong> لا تدفع أي مبلغ مسبقاً. تدفع المبلغ نقداً (كاش) لمندوب الشحن عند وصول الطلب إلى باب بيتك، بعد فحص المنتج والتأكد من سلامته ومطابقته للطلب تماماً.
            </p>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleProceedToReview} className="space-y-4">
            {/* Customer Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                الاسم الكامل للزبون (الثلاثي) <span className="text-[#ffd700]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد محمد الكعبي"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors"
                />
                <User className="absolute top-3 right-3 w-4 h-4 text-[#8e8e93]" />
              </div>
              {errors.customerName && (
                <p className="text-xs text-[#ff453a] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* Iraqi Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                رقم الهاتف (للتواصل وتأكيد الشحنة) <span className="text-[#ffd700]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07801234567"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors font-mono"
                />
                <Phone className="absolute top-3 right-3 w-4 h-4 text-[#8e8e93]" />
              </div>
              {errors.phone && (
                <p className="text-xs text-[#ff453a] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Iraqi Governorate Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#d0c5af]">
                  المحافظة <span className="text-[#ffd700]">*</span>
                </label>
                <span className="text-xs font-bold text-[#ffd700]">كلفة الشحن: 5,000 د.ع ثابتة</span>
              </div>
              <div className="relative">
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {IRAQ_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov} className="bg-[#141414] text-[#f5f5f7]">
                      {gov} (توصيل سريع 5,000 د.ع)
                    </option>
                  ))}
                </select>
                <MapPin className="absolute top-3 right-3 w-4 h-4 text-[#ffd700] pointer-events-none" />
              </div>
            </div>

            {/* City & District (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                  المدينة / القضاء <span className="text-[#ffd700]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: الكرادة / المنصور / المركز"
                    className="w-full h-11 px-3.5 pr-9 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors"
                  />
                  <Building className="absolute top-3 right-3 w-4 h-4 text-[#8e8e93]" />
                </div>
                {errors.city && <p className="text-xs text-[#ff453a] mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                  المنطقة / الحي <span className="text-[#ffd700]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: حي الحسين / حي الجامعة"
                    className="w-full h-11 px-3.5 pr-9 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors"
                  />
                  <Home className="absolute top-3 right-3 w-4 h-4 text-[#8e8e93]" />
                </div>
                {errors.district && <p className="text-xs text-[#ff453a] mt-1">{errors.district}</p>}
              </div>
            </div>

            {/* Nearest Landmark */}
            <div>
              <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                أقرب نقطة دالة <span className="text-[#ffd700]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="مثال: قرب جامع المصطفى، أو مقابل مستشفى الكندي"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors"
                />
                <Flag className="absolute top-3 right-3 w-4 h-4 text-[#8e8e93]" />
              </div>
              {errors.nearestLandmark && (
                <p className="text-xs text-[#ff453a] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.nearestLandmark}</span>
                </p>
              )}
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                العنوان بالتفصيل <span className="text-[#ffd700]">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: شارع الرواد، محلة 602، زقاق 14، دار 8"
                className="w-full h-11 px-3.5 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-sm text-[#f5f5f7] focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-xs text-[#ff453a] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#d0c5af] mb-1.5">
                ملاحظات إضافية للتوصيل (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة"
                className="w-full h-10 px-3.5 rounded-xl bg-[#141414] border border-[#2e2e2e] focus:border-[#ffd700] text-xs text-[#f5f5f7] focus:outline-none transition-colors"
              />
            </div>

            {/* Price Summary Breakdown */}
            <div className="pt-3 border-t border-[#222] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8e8e93]">
                <span>مجموع المواد ({cart.reduce((s, i) => s + i.quantity, 0)} قطع):</span>
                <span className="font-bold text-[#f5f5f7]">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8e8e93]">
                <span>أجور الشحن لكافة المحافظات:</span>
                <span className="font-bold text-[#ffd700]">{formatIQD(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                <div>
                  <span className="text-sm font-extrabold text-[#f5f5f7] block">المبلغ الإجمالي كاش عند الاستلام:</span>
                  <span className="text-[11px] text-[#30d158] font-bold">تدفعه نقداً للمندوب عند وصول الشحنة</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#ffd700]">
                  {formatIQD(total)}
                </span>
              </div>
            </div>

            {/* Submit Step 1 Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#ffd700] hover:bg-[#e6c200] text-[#0a0a0a] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,215,0,0.3)] active:scale-95 transition-all cursor-pointer"
              >
                <span>متابعة مراجعة الطلب</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW & CONFIRM */}
        {step === 'review' && (
          <div className="space-y-4 text-right">
            {/* Items in Order */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3 max-h-52 overflow-y-auto">
              <h4 className="text-xs font-bold text-[#8e8e93] pb-1 border-b border-[#222]">
                المنتجات المطلوبة ({cart.length}):
              </h4>
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#0a0a0a] border border-[#2b2b2b]"
                    />
                    <div>
                      <div className="font-bold text-[#f5f5f7] line-clamp-1">{item.product.name}</div>
                      <div className="text-[11px] text-[#8e8e93]">الكمية: {item.quantity} × {formatIQD(item.product.price)}</div>
                    </div>
                  </div>
                  <span className="font-bold text-[#ffd700]">
                    {formatIQD(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Destination Summary */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2 text-xs">
              <h4 className="text-xs font-bold text-[#ffd700] pb-1 border-b border-[#222] flex items-center justify-between">
                <span>بيانات عنوان التوصيل:</span>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-[#ffd700] hover:underline cursor-pointer"
                >
                  تعديل العنوان ✎
                </button>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#d0c5af]">
                <div><span className="text-[#8e8e93]">الاسم:</span> {customerName}</div>
                <div><span className="text-[#8e8e93]">الهاتف:</span> <span dir="ltr">{phone}</span></div>
                <div><span className="text-[#8e8e93]">المحافظة:</span> {governorate}</div>
                <div><span className="text-[#8e8e93]">المدينة/الحي:</span> {city} - {district}</div>
                <div className="col-span-2"><span className="text-[#8e8e93]">العنوان:</span> {address}</div>
                <div className="col-span-2"><span className="text-[#8e8e93]">نقطة دالة:</span> {nearestLandmark}</div>
              </div>
            </div>

            {/* Final Grand Total Math */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17140b] to-[#121008] border-2 border-[#ffd700] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8e8e93]">
                <span>قيمة المشتريات:</span>
                <span className="font-bold text-[#f5f5f7]">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8e8e93]">
                <span>أجور الشحن (توصيل باب البيت):</span>
                <span className="font-bold text-[#ffd700]">{formatIQD(deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#ffd700]/30 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-[#f5f5f7] block">المبلغ الإجمالي المستحق:</span>
                  <span className="text-xs font-bold text-[#30d158]">الدفع نقداً (كاش) عند استلام الشحنة</span>
                </div>
                <span className="text-2xl font-black text-[#ffd700]">
                  {formatIQD(total)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="col-span-1 h-12 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] text-xs sm:text-sm font-bold text-[#d0c5af] flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع للتعديل</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="col-span-2 h-12 rounded-xl bg-[#ffd700] hover:bg-[#e6c200] text-[#0a0a0a] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,215,0,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>تأكيد الطلب الآن (الدفع كاش)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
