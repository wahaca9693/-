import React, { useState } from 'react';
import { CartItem, Order } from '../types/store';
import { IRAQ_GOVERNORATES } from '../data/initialData';
import { X, Check, Truck, ShieldCheck, ArrowLeft, ArrowRight, User, Phone, MapPin, Building, Home, Flag, Edit, AlertCircle } from 'lucide-react';

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
    paymentMethod: 'cod' | 'zaincash' | 'card';
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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'zaincash' | 'card'>('cod');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  // Strict Iraqi Phone Validation (07XXXXXXXXX - exactly 11 digits, starts with 07)
  const validateIraqiPhone = (val: string): boolean => {
    const clean = val.replace(/\s+/g, '');
    const iraqiRegex = /^07[3-9][0-9]{8}$/;
    return iraqiRegex.test(clean);
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 3) {
      newErrors.customerName = 'يرجى إدخال الاسم الكامل الثلاثي للزبون';
    }

    if (!phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب للتواصل وتأكيد الشحنة';
    } else if (!validateIraqiPhone(phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح! يجب أن يبدأ بـ 07 ويتكون من 11 رقماً (مثال: 07801234567 أو 07701234567)';
    }

    if (!governorate) {
      newErrors.governorate = 'يرجى اختيار المحافظة';
    }

    if (!city.trim()) {
      newErrors.city = 'يرجى إدخال القضاء أو المدينة';
    }

    if (!district.trim()) {
      newErrors.district = 'يرجى إدخال المنطقة أو الحي';
    }

    if (!address.trim()) {
      newErrors.address = 'يرجى إدخال العنوان بالتفصيل (رقم المحلة / الزقاق / الدار)';
    }

    if (!nearestLandmark.trim()) {
      newErrors.nearestLandmark = 'يرجى كتابة أقرب نقطة دالة (مثال: قرب جامع كذا، مقابل مدرسة كذا)';
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
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/30 shadow-2xl p-5 sm:p-8 text-right text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {step === 'form' ? 'معلومات التوصيل والزبون' : 'مراجعة وتأكيد الطلب'}
              </h2>
              <span className="text-xs text-[#99907c]">
                {step === 'form' ? 'الخطوة 1 من 2: تعبئة البيانات' : 'الخطوة 2 من 2: التدقيق النهائي'}
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

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleProceedToReview} className="space-y-4">
            {/* Customer Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                الاسم الكامل للزبون <span className="text-[#ffd700]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد محمد الكعبي"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors"
                />
                <User className="absolute top-3 right-3 w-4 h-4 text-[#d4af37]" />
              </div>
              {errors.customerName && (
                <p className="text-xs text-[#ff6b6b] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* Iraqi Phone Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#d0c5af]">
                  رقم الهاتف العراقي <span className="text-[#ffd700]">*</span>
                </label>
                <span className="text-[11px] text-[#99907c]">آسيا / زين / كورك</span>
              </div>
              <div className="relative" dir="ltr">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full h-11 px-3.5 pl-14 text-left rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors font-mono"
                />
                <span className="absolute left-3 top-3 text-xs font-bold text-[#ffd700]">+964</span>
                <Phone className="absolute right-3 top-3.5 w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="text-[11px] text-[#99907c] mt-1">
                الصيغة المعتمدة: يبدأ بـ 07 ويتكون من 11 رقماً (مثال: 07801234567)
              </p>
              {errors.phone && (
                <p className="text-xs text-[#ff6b6b] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Iraqi Governorate Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#d0c5af]">
                  المحافظة <span className="text-[#ffd700]">*</span>
                </label>
                <span className="text-[11px] text-[#ffd700]">أجور الشحن ثابتة: 5,000 د.ع</span>
              </div>
              <div className="relative">
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors appearance-none cursor-pointer"
                >
                  {IRAQ_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov} className="bg-[#121212] text-[#f5f5f7]">
                      {gov} (5,000 د.ع توصيل)
                    </option>
                  ))}
                </select>
                <MapPin className="absolute top-3 right-3 w-4 h-4 text-[#d4af37] pointer-events-none" />
              </div>
            </div>

            {/* City & District (Two-columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                  المدينة / القضاء <span className="text-[#ffd700]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: الكرادة / المنصور / المركز"
                    className="w-full h-11 px-3.5 pr-9 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                  <Building className="absolute top-3 right-3 w-4 h-4 text-[#d4af37]" />
                </div>
                {errors.city && <p className="text-xs text-[#ff6b6b] mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                  المنطقة / الحي <span className="text-[#ffd700]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: حي الحسين / حي الجامعة"
                    className="w-full h-11 px-3.5 pr-9 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                  <Home className="absolute top-3 right-3 w-4 h-4 text-[#d4af37]" />
                </div>
                {errors.district && <p className="text-xs text-[#ff6b6b] mt-1">{errors.district}</p>}
              </div>
            </div>

            {/* Nearest Landmark */}
            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                أقرب نقطة دالة <span className="text-[#ffd700]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="مثال: قرب جامع المصطفى، أو مقابل مستشفى الكندي"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors"
                />
                <Flag className="absolute top-3 right-3 w-4 h-4 text-[#d4af37]" />
              </div>
              {errors.nearestLandmark && (
                <p className="text-xs text-[#ff6b6b] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.nearestLandmark}</span>
                </p>
              )}
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                العنوان بالتفصيل <span className="text-[#ffd700]">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: شارع الرواد، محلة 602، زقاق 14، دار 8"
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors"
              />
              {errors.address && (
                <p className="text-xs text-[#ff6b6b] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                ملاحظات إضافية للتوصيل (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أوقات مفضلة للاستلام، أو ملاحظة خاصة لمندوب الشحن..."
                rows={2}
                className="w-full p-3 rounded-xl bg-[#121212] border border-[#d4af37]/25 text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] transition-colors resize-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#d0c5af] mb-2">
                طريقة الدفع المعتمدة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1e190e] border-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#121212] border-[#d4af37]/20 text-[#a1a1a6]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#ffd700]">الدفع عند الاستلام (COD)</span>
                  <span className="text-[10px] text-[#99907c] mt-1">نقداً بالدينار بعد معاينة الطلب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('zaincash')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    paymentMethod === 'zaincash'
                      ? 'bg-[#1e190e] border-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#121212] border-[#d4af37]/20 text-[#a1a1a6]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#ffd700]">زين كاش (ZainCash)</span>
                  <span className="text-[10px] text-[#99907c] mt-1">تحويل مباشر وسريع</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'bg-[#1e190e] border-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#121212] border-[#d4af37]/20 text-[#a1a1a6]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#ffd700]">ماستركارد / كي كارد</span>
                  <span className="text-[10px] text-[#99907c] mt-1">بوابة دفع آمنة 3D Secure</span>
                </button>
              </div>
            </div>

            {/* Submit to Review Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>متابعة لمراجعة الطلب قبل الإرسال</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ORDER REVIEW */}
        {step === 'review' && (
          <div className="space-y-5">
            {/* Customer Details Review Card */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/15">
                <span className="text-xs font-bold text-[#ffd700]">بيانات المستلم وعنوان التوصيل</span>
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#ffd700] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>تعديل المعلومات</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#99907c]">اسم الزبون: </span>
                  <span className="font-bold text-[#f5f5f7]">{customerName}</span>
                </div>
                <div>
                  <span className="text-[#99907c]">رقم الهاتف: </span>
                  <span className="font-bold text-[#ffd700] font-mono" dir="ltr">{phone}</span>
                </div>
                <div>
                  <span className="text-[#99907c]">المحافظة: </span>
                  <span className="font-bold text-[#f5f5f7]">{governorate}</span>
                </div>
                <div>
                  <span className="text-[#99907c]">المدينة / الحي: </span>
                  <span className="font-bold text-[#f5f5f7]">{city} - {district}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#99907c]">أقرب نقطة دالة: </span>
                  <span className="font-bold text-[#ffd700]">{nearestLandmark}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#99907c]">العنوان التفصيلي: </span>
                  <span className="font-medium text-[#f5f5f7]">{address}</span>
                </div>
                {notes && (
                  <div className="sm:col-span-2">
                    <span className="text-[#99907c]">ملاحظات الزبون: </span>
                    <span className="text-[#d0c5af]">{notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2.5 max-h-52 overflow-y-auto">
              <span className="text-xs font-bold text-[#ffd700] block mb-1">
                المنتجات المطلوبة ({cart.length}):
              </span>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#181818] border border-[#d4af37]/10 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#0a0a0a]"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-[#f5f5f7] block truncate">
                        {item.product.name}
                      </span>
                      <span className="text-[#99907c] text-[10px]">
                        الكمية: {item.quantity} × {formatIQD(item.product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#ffd700] shrink-0 mr-2">
                    {formatIQD(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Ledger */}
            <div className="p-4 rounded-2xl bg-[#18150c] border border-[#d4af37]/30 space-y-2 text-xs">
              <div className="flex justify-between text-[#d0c5af]">
                <span>قيمة المنتجات الإجمالية:</span>
                <span className="font-bold text-[#f5f5f7]">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[#d0c5af]">
                <span className="flex items-center gap-1 text-[#ffd700]">
                  <Truck className="w-3.5 h-3.5" />
                  <span>أجور الشحن والتوصيل ({governorate}):</span>
                </span>
                <span className="font-bold text-[#ffd700]">{formatIQD(deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between items-baseline text-sm">
                <span className="font-bold text-[#f5f5f7]">المجموع الكلي المطلوب:</span>
                <span className="text-xl font-black text-[#ffd700]">{formatIQD(total)}</span>
              </div>
              <p className="text-[10px] text-[#99907c] text-center pt-1">
                طريقة الدفع: {paymentMethod === 'cod' ? 'نقد عند الاستلام بعد معاينة وفحص الشحنة' : paymentMethod === 'zaincash' ? 'زين كاش' : 'بطاقة إلكترونية'}
              </p>
            </div>

            {/* Actions: Confirm and Send vs Edit */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="h-12 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#d4af37]/30 text-[#d0c5af] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>تعديل المعلومات</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="h-12 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8860b] text-[#0a0a0a] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد وإرسال الطلب</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
