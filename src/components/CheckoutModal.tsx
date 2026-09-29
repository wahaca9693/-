import React, { useState } from 'react';
import { CartItem, Order } from '../types/store';
import { IRAQ_GOVERNORATES } from '../data/initialData';
import {
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
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatIQD } from '../lib/format';

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

type FieldKey =
  | 'customerName'
  | 'phone'
  | 'governorate'
  | 'city'
  | 'district'
  | 'address'
  | 'nearestLandmark';

const validateIraqiPhone = (value: string) => /^07[3-9][0-9]{8}$/.test(value.replace(/\s+/g, ''));

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  deliveryFee,
  onClose,
  onSubmitOrder,
}) => {
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [values, setValues] = useState({
    customerName: '',
    phone: '',
    governorate: IRAQ_GOVERNORATES[0],
    city: '',
    district: '',
    address: '',
    nearestLandmark: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const itemsCount = cart.reduce((s, i) => s + i.quantity, 0);

  const set = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<FieldKey, string>> = {};

    if (values.customerName.trim().length < 3) next.customerName = 'يرجى كتابة الاسم الثلاثي بشكل صحيح';
    if (!values.phone.trim()) next.phone = 'رقم الهاتف مطلوب لتأكيد التوصيل';
    else if (!validateIraqiPhone(values.phone)) next.phone = 'الرقم يجب أن يبدأ بـ 07 ويتكون من 11 رقماً (07801234567)';
    if (!values.city.trim()) next.city = 'يرجى إدخال المدينة أو القضاء';
    if (!values.district.trim()) next.district = 'يرجى إدخال المنطقة أو الحي';
    if (!values.address.trim()) next.address = 'يرجى إدخال تفاصيل العنوان (الشارع / الزقاق / الدار)';
    if (!values.nearestLandmark.trim()) next.nearestLandmark = 'يرجى كتابة أقرب نقطة دالة لتسهيل وصول المندوب';

    setErrors(next);
    if (Object.keys(next).length === 0) setStep('review');
  };

  const submit = () =>
    onSubmitOrder({
      customerName: values.customerName.trim(),
      phone: values.phone.trim().replace(/\s+/g, ''),
      governorate: values.governorate,
      city: values.city.trim(),
      district: values.district.trim(),
      address: values.address.trim(),
      nearestLandmark: values.nearestLandmark.trim(),
      notes: values.notes.trim(),
      paymentMethod: 'cod',
    });

  const field = (
    key: FieldKey,
    label: string,
    icon: React.ElementType,
    placeholder: string,
    extra = ''
  ) => (
    <div>
      <label className="mnr-label" htmlFor={`chk-${key}`}>
        {label} <span className="text-danger">*</span>
      </label>
      <div className="relative">
        <input
          id={`chk-${key}`}
          type={key === 'phone' ? 'tel' : 'text'}
          dir={key === 'phone' ? 'ltr' : undefined}
          value={values[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          className={`mnr-field ${extra} ${errors[key] ? 'border-danger' : ''} pr-10`}
        />
        {React.createElement(icon, { className: 'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none' })}
      </div>
      {errors[key] && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-danger">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      disableOutsideClose={step === 'review'}
      title={step === 'form' ? 'طلب التوصيل المنزلي' : 'مراجعة وتأكيد الطلب'}
      subtitle={
        step === 'form'
          ? 'املأ بيانات التوصيل وسيتواصل معك المندوب'
          : 'التدقيق النهائي للمنتجات والعنوان'
      }
      icon={step === 'form' ? Truck : CheckCircle2}
    >
      <div className="p-5 sm:p-7 space-y-5">
        {/* لافتة الدفع */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-success-soft border border-success/25">
          <span className="w-9 h-9 rounded-lg bg-success text-white grid place-items-center shrink-0">
            <Banknote className="w-4.5 h-4.5" />
          </span>
          <div>
            <h4 className="text-sm font-extrabold text-success">
              طريقة الدفع الوحيدة: الدفع كاش عند استلام ومعاينة الطلب
            </h4>
            <p className="text-xs text-ink-2 leading-relaxed mt-1">
              لا تدفع أي مبلغ مسبقاً. تدفع نقداً للمندوب عند وصول الطلب، بعد فحص المنتج والتأكد من
              سلامته ومطابقته للطلب تماماً.
            </p>
          </div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleReview} className="space-y-4">
            {field('customerName', 'الاسم الكامل للزبون (الثلاثي)', User, 'مثال: أحمد محمد الكعبي')}
            {field('phone', 'رقم الهاتف (للتواصل وتأكيد الشحنة)', Phone, '07801234567', 'mnr-num')}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="mnr-label mb-0" htmlFor="chk-governorate">
                  المحافظة <span className="text-danger">*</span>
                </label>
                <span className="text-[11px] font-bold text-brand-ink">الشحن: 5,000 د.ع ثابتة</span>
              </div>
              <div className="relative">
                <select
                  id="chk-governorate"
                  value={values.governorate}
                  onChange={(e) => set('governorate', e.target.value)}
                  className="mnr-field pr-10"
                >
                  {IRAQ_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {field('city', 'المدينة / القضاء', Building, 'مثال: الكرادة')}
              {field('district', 'المنطقة / الحي', Home, 'مثال: حي الحسين')}
            </div>

            {field('nearestLandmark', 'أقرب نقطة دالة', Flag, 'مثال: قرب جامع المصطفى')}

            <div>
              <label className="mnr-label" htmlFor="chk-address">
                العنوان بالتفصيل <span className="text-danger">*</span>
              </label>
              <input
                id="chk-address"
                type="text"
                value={values.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="مثال: شارع الرواد، محلة 602، زقاق 14، دار 8"
                className={`mnr-field ${errors.address ? 'border-danger' : ''}`}
              />
              {errors.address && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-danger">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="mnr-label" htmlFor="chk-notes">
                ملاحظات إضافية للتوصيل (اختياري)
              </label>
              <input
                id="chk-notes"
                type="text"
                value={values.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة"
                className="mnr-field"
              />
            </div>

            {/* الملخّص */}
            <div className="pt-4 border-t border-line space-y-2">
              <div className="flex justify-between text-xs text-ink-2">
                <span>مجموع المواد ({itemsCount} قطعة)</span>
                <span className="font-extrabold text-ink mnr-num">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-2">
                <span>أجور الشحن لكل المحافظات</span>
                <span className="font-extrabold text-brand-ink mnr-num">{formatIQD(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-line">
                <div>
                  <p className="text-sm font-extrabold text-ink">المبلغ الإجمالي كاش عند الاستلام</p>
                  <p className="text-[11px] text-success font-bold">تدفعه نقداً عند وصول الشحنة</p>
                </div>
                <span className="text-2xl font-extrabold text-gold mnr-num">{formatIQD(total)}</span>
              </div>
            </div>

            <button type="submit" className="mnr-btn mnr-btn-primary w-full h-12">
              <span>متابعة مراجعة الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* المنتجات */}
            <ul className="p-4 rounded-xl border border-line bg-surface-2 space-y-3 max-h-48 overflow-y-auto">
              <h4 className="text-xs font-extrabold text-ink-2 pb-2 border-b border-line">
                المنتجات المطلوبة ({cart.length})
              </h4>
              {cart.map((item) => (
                <li key={item.product.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-ink line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-ink-3 mnr-num">
                        {item.quantity} × {formatIQD(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gold mnr-num shrink-0">
                    {formatIQD(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* العنوان */}
            <div className="p-4 rounded-xl border border-line bg-surface-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
                <h4 className="text-xs font-extrabold text-ink">بيانات عنوان التوصيل</h4>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-[11px] font-bold text-brand-ink hover:underline"
                >
                  تعديل العنوان
                </button>
              </div>
              <dl className="grid sm:grid-cols-2 gap-2 text-xs text-ink-2">
                <div><dt className="inline text-ink-3">الاسم: </dt><dd className="inline font-bold text-ink">{values.customerName}</dd></div>
                <div><dt className="inline text-ink-3">الهاتف: </dt><dd className="inline font-bold text-ink mnr-num">{values.phone}</dd></div>
                <div><dt className="inline text-ink-3">المحافظة: </dt><dd className="inline font-bold text-ink">{values.governorate}</dd></div>
                <div><dt className="inline text-ink-3">المدينة/الحي: </dt><dd className="inline font-bold text-ink">{values.city} — {values.district}</dd></div>
                <div className="sm:col-span-2"><dt className="inline text-ink-3">العنوان: </dt><dd className="inline font-bold text-ink">{values.address}</dd></div>
                <div className="sm:col-span-2"><dt className="inline text-ink-3">نقطة دالة: </dt><dd className="inline font-bold text-ink">{values.nearestLandmark}</dd></div>
              </dl>
            </div>

            {/* الإجمالي */}
            <div className="p-4 rounded-xl bg-brand-soft border border-brand/25 space-y-2">
              <div className="flex justify-between text-xs text-ink-2">
                <span>قيمة المشتريات</span>
                <span className="font-extrabold text-ink mnr-num">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-2">
                <span>أجور الشحن (توصيل باب البيت)</span>
                <span className="font-extrabold text-brand-ink mnr-num">{formatIQD(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-brand/20">
                <div>
                  <p className="text-sm font-extrabold text-ink">المبلغ الإجمالي المستحق</p>
                  <p className="text-[11px] text-success font-bold">الدفع نقداً عند استلام الشحنة</p>
                </div>
                <span className="text-2xl font-extrabold text-gold mnr-num">{formatIQD(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setStep('form')} className="mnr-btn mnr-btn-soft h-12 text-xs">
                <ArrowRight className="w-4 h-4" />
                رجوع للتعديل
              </button>
              <button type="button" onClick={submit} className="mnr-btn mnr-btn-primary h-12 col-span-2 text-sm">
                <CheckCircle2 className="w-4.5 h-4.5" />
                تأكيد الطلب الآن
              </button>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-3">
              <Package className="w-3.5 h-3.5" />
              عند تأكيد الطلب سيصلك رقم مرجعي لتتبع الشحنة
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
