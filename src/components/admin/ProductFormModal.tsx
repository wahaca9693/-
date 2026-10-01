import React, { useState } from 'react';
import { Save, Plus, X, Tag, Package, Info, CircleDollarSign, ListChecks } from 'lucide-react';
import { Product, ProductCategory, ProductStatus } from '../../types/store';
import { CATEGORIES_LIST } from '../../data/initialData';
import { Modal } from '../ui/Modal';
import { Field, SegmentedControl } from './ui';
import { ImageUploader } from './ImageUploader';
import { formatIQD } from '../../lib/format';

interface ProductFormModalProps {
  isOpen: boolean;
  /** null = إضافة منتج جديد */
  product: Product | null;
  existingBrands: string[];
  onClose: () => void;
  onSave: (product: Product) => void;
  onCreate: (product: Omit<Product, 'id'>) => void;
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'in_stock', label: 'متوفر' },
  { value: 'out_of_stock', label: 'نفد' },
  { value: 'coming_soon', label: 'قريباً' },
];

const emptyDraft = (): Partial<Product> => ({
  name: '',
  nameEn: '',
  brand: '',
  category: 'phones',
  price: 0,
  oldPrice: undefined,
  rating: 4.8,
  reviewsCount: 0,
  stock: 5,
  status: 'in_stock',
  image: '',
  description: '',
  specs: [],
  warranty: 'ضمان الوكيل الرسمي 12 شهر',
  badge: '',
  featured: false,
});

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  existingBrands,
  onClose,
  onSave,
  onCreate,
}) => {
  const [draft, setDraft] = useState<Partial<Product>>(
    product ?? emptyDraft()
  );
  const [specText, setSpecText] = useState((product?.specs ?? []).join('\n'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // إعادة التهيئة عند تغيّر المنتج
  const productId = product?.id ?? 'new';
  const [lastId, setLastId] = useState(productId);
  if (lastId !== productId) {
    setLastId(productId);
    setDraft(product ?? emptyDraft());
    setSpecText((product?.specs ?? []).join('\n'));
    setErrors({});
  }

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.name?.trim()) next.name = 'اسم المنتج مطلوب';
    if (!draft.brand?.trim()) next.brand = 'اسم الماركة مطلوب';
    if (!draft.description?.trim()) next.description = 'الوصف مطلوب — هو ما يظهر للزبون';
    if (!draft.price || draft.price <= 0) next.price = 'السعر يجب أن يكون أكبر من صفر';
    if (draft.oldPrice && draft.oldPrice > 0 && draft.oldPrice <= (draft.price ?? 0)) {
      next.oldPrice = 'السعر القديم يجب أن يكون أعلى من السعر الحالي';
    }
    if (draft.stock === undefined || draft.stock < 0) next.stock = 'الكمية غير صحيحة';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const specs = specText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...draft,
      specs,
      price: Number(draft.price),
      oldPrice: draft.oldPrice && Number(draft.oldPrice) > 0 ? Number(draft.oldPrice) : undefined,
      stock: Number(draft.stock ?? 0),
      rating: Number(draft.rating ?? 4.8),
      reviewsCount: Number(draft.reviewsCount ?? 0),
      name: draft.name!.trim(),
      brand: draft.brand!.trim(),
      description: draft.description!.trim(),
      warranty: draft.warranty?.trim() || 'ضمان الوكيل الرسمي 12 شهر',
    } as Product;

    if (product) onSave({ ...payload, id: product.id });
    else onCreate(payload as Omit<Product, 'id'>);

    onClose();
  };

  const discount =
    draft.oldPrice && draft.oldPrice > 0 && draft.price
      ? Math.round((1 - (draft.price as number) / draft.oldPrice) * 100)
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      subtitle={product ? product.name : 'سيظهر المنتج مباشرة في المتجر بعد الحفظ'}
      icon={product ? Package : Plus}
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* الصورة */}
        <div className="p-4 rounded-xl border border-line bg-surface-2">
          <p className="mnr-label mb-3">صورة المنتج</p>
          <ImageUploader
            value={draft.image ?? ''}
            onChange={(dataUrl) => set('image', dataUrl)}
            productName={draft.name || 'منتج'}
          />
        </div>

        {/* الهوية */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم المنتج بالعربية" required error={errors.name} className="sm:col-span-2">
            <input
              value={draft.name ?? ''}
              onChange={(e) => set('name', e.target.value)}
              placeholder="مثال: iPhone 17 Pro Max 256GB — تيتانيوم ذهبي"
              className={`mnr-field ${errors.name ? 'border-danger' : ''}`}
            />
          </Field>

          <Field label="الاسم بالإنجليزية" hint="يظهر تحت الاسم العربي في نافذة المنتج">
            <input
              value={draft.nameEn ?? ''}
              onChange={(e) => set('nameEn', e.target.value)}
              dir="ltr"
              className="mnr-field mnr-num"
              placeholder="Apple iPhone 17 Pro Max 256GB"
            />
          </Field>

          <Field label="الماركة" required error={errors.brand}>
            <input
              list="admin-brand-list"
              value={draft.brand ?? ''}
              onChange={(e) => set('brand', e.target.value)}
              placeholder="Apple"
              className={`mnr-field ${errors.brand ? 'border-danger' : ''}`}
            />
            <datalist id="admin-brand-list">
              {existingBrands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Field>

          <Field label="القسم">
            <select
              value={draft.category}
              onChange={(e) => set('category', e.target.value as ProductCategory)}
              className="mnr-field"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="شارة المنتج" hint="مثال: الأكثر طلباً — تُعرض فوق الصورة">
            <input
              value={draft.badge ?? ''}
              onChange={(e) => set('badge', e.target.value)}
              placeholder="الأكثر طلباً"
              className="mnr-field"
            />
          </Field>
        </div>

        {/* السعر */}
        <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-4">
          <p className="mnr-label mb-0 flex items-center gap-1.5">
            <CircleDollarSign className="w-4 h-4" />
            السعر والنشر
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="السعر الحالي (د.ع)" required error={errors.price}>
              <input
                type="number"
                min={0}
                step={1000}
                value={draft.price ?? 0}
                onChange={(e) => set('price', Number(e.target.value))}
                dir="ltr"
                className={`mnr-field mnr-num ${errors.price ? 'border-danger' : ''}`}
              />
            </Field>

            <Field label="السعر قبل الخصم" error={errors.oldPrice} hint={errors.oldPrice ? undefined : 'اتركه فارغاً إن لم يوجد خصم'}>
              <input
                type="number"
                min={0}
                step={1000}
                value={draft.oldPrice ?? ''}
                onChange={(e) =>
                  set('oldPrice', e.target.value === '' ? undefined : Number(e.target.value))
                }
                dir="ltr"
                className={`mnr-field mnr-num ${errors.oldPrice ? 'border-danger' : ''}`}
              />
            </Field>

            <Field label="الكمية بالمخزن" error={errors.stock}>
              <input
                type="number"
                min={0}
                value={draft.stock ?? 0}
                onChange={(e) => set('stock', Number(e.target.value))}
                dir="ltr"
                className={`mnr-field mnr-num ${errors.stock ? 'border-danger' : ''}`}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <Field label="حالة النشر">
              <SegmentedControl
                value={(draft.status ?? 'in_stock') as ProductStatus}
                options={STATUS_OPTIONS}
                onChange={(v) => set('status', v)}
              />
            </Field>

            <Field label="التقييم">
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={draft.rating ?? 4.8}
                onChange={(e) => set('rating', Number(e.target.value))}
                dir="ltr"
                className="mnr-field mnr-num"
              />
            </Field>

            <div className="flex items-center gap-2 pb-2">
              <input
                id="admin-featured"
                type="checkbox"
                checked={Boolean(draft.featured)}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[var(--mnr-brand)]"
              />
              <label htmlFor="admin-featured" className="text-xs font-bold text-ink-2">
                منتج مميّز (يظهر أولاً)
              </label>
            </div>
          </div>

          {discount > 0 && (
            <p className="text-[11px] text-success font-bold">
              نسبة الخصم المحسوبة تلقائياً: {discount}% — تُعرض كشارة حمراء على صورة المنتج.
            </p>
          )}
        </div>

        {/* الوصف والمواصفات */}
        <Field label="وصف المنتج" required error={errors.description} hint="الوصف الظاهر للزبون في نافذة التفاصيل">
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="اكتب وصفاً واضحاً يشرح أهم مزايا المنتج للزبون..."
            className={`mnr-field h-auto py-2.5 leading-relaxed ${errors.description ? 'border-danger' : ''}`}
          />
        </Field>

        <Field
          label="المواصفات الفنية"
          hint="سطر لكل مواصفة — تُعرض كقائمة بعلامات صح"
        >
          <textarea
            value={specText}
            onChange={(e) => setSpecText(e.target.value)}
            rows={4}
            placeholder={'شاشة 6.9 إنش Super Retina XDR OLED\nذاكرة 256GB\nكاميرا 48MP'}
            className="mnr-field h-auto py-2.5 leading-relaxed"
          />
        </Field>

        <Field label="الضمان">
          <input
            value={draft.warranty ?? ''}
            onChange={(e) => set('warranty', e.target.value)}
            placeholder="ضمان الوكيل الرسمي 12 شهر مع استبدال فوري"
            className="mnr-field"
          />
        </Field>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-line">
          <button type="submit" className="mnr-btn mnr-btn-primary h-12 flex-1">
            <Save className="w-4 h-4" />
            {product ? 'حفظ التعديلات' : 'نشر المنتج في المتجر'}
          </button>
          <button type="button" onClick={onClose} className="mnr-btn mnr-btn-soft h-12">
            <X className="w-4 h-4" />
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* أيقونات مستخدمة في العنوان */
export const FORM_ICONS = { Tag, Info, ListChecks };
