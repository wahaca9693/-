import React, { useState } from 'react';
import { Plus, Trash2, Tag, Save, Gift, Percent, Banknote } from 'lucide-react';
import { Offer, ProductCategory } from '../../../types/store';
import { CATEGORIES_LIST } from '../../../data/initialData';
import { formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, EmptyState, Field, SegmentedControl } from '../ui';
import { ConfirmDialog } from '../ConfirmDialog';

export const OffersTab: React.FC = () => {
  const { offers, createOffer, removeOffer, notify } = useAdmin();
  const [draft, setDraft] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    targetCategory: 'all',
    code: '',
    active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Offer | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title?.trim()) return setError('عنوان العرض مطلوب');
    if (!draft.discountValue || draft.discountValue <= 0) return setError('قيمة الخصم يجب أن تكون أكبر من صفر');

    createOffer({
      title: draft.title!.trim(),
      description: draft.description?.trim() ?? '',
      discountType: (draft.discountType ?? 'percentage') as 'percentage' | 'fixed',
      discountValue: Number(draft.discountValue),
      targetCategory: (draft.targetCategory ?? 'all') as ProductCategory | 'all',
      code: draft.code?.trim() ? draft.code.trim().toUpperCase() : undefined,
      active: true,
    });

    setDraft({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      targetCategory: 'all',
      code: '',
      active: true,
    });
    setError(null);
    notify('تمت إضافة العرض');
  };

  return (
    <div className="space-y-4">
      <Panel title="إضافة عرض جديد" description="العرض يظهر في قسم «العروض» بواجهة المتجر مباشرة">
        <form onSubmit={handleCreate} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="عنوان العرض" required error={error ?? undefined}>
            <input
              value={draft.title ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="خصم الشواحن"
              className={`mnr-field ${error ? 'border-danger' : ''}`}
            />
          </Field>

          <Field label="الوصف المختصر">
            <input
              value={draft.description ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="على جميع شواحن أنكر الأصلية"
              className="mnr-field"
            />
          </Field>

          <Field label="كود الخصم" hint="اتركه فارغاً إن لم ترغب بكود">
            <input
              value={draft.code ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
              dir="ltr"
              placeholder="GOLD25"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field label="نوع الخصم">
            <SegmentedControl
              value={(draft.discountType ?? 'percentage') as 'percentage' | 'fixed'}
              options={[
                { value: 'percentage', label: 'نسبة مئوية %' },
                { value: 'fixed', label: 'مبلغ ثابت د.ع' },
              ]}
              onChange={(v) => setDraft((d) => ({ ...d, discountType: v }))}
            />
          </Field>

          <Field
            label="قيمة الخصم"
            hint={draft.discountType === 'fixed' ? 'بالدينار العراقي' : 'نسبة من 1 إلى 100'}
          >
            <input
              type="number"
              min={0}
              value={draft.discountValue ?? 0}
              onChange={(e) => setDraft((d) => ({ ...d, discountValue: Number(e.target.value) }))}
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field label="يستهدف">
            <select
              value={draft.targetCategory ?? 'all'}
              onChange={(e) => setDraft((d) => ({ ...d, targetCategory: e.target.value as ProductCategory }))}
              className="mnr-field"
            >
              <option value="all">كل الأقسام</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2 lg:col-span-3">
            <button type="submit" className="mnr-btn mnr-btn-primary h-11">
              <Plus className="w-4 h-4" />
              إضافة العرض
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="العروض الحالية" description={`${formatNumber(offers.length)} عرض`}>
        {offers.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="لا توجد عروض بعد"
            description="أضف أول عرض من النموذج أعلاه ليظهر في واجهة المتجر."
          />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {offers.map((offer) => (
              <li key={offer.id} className="p-4 rounded-xl border border-line bg-surface-2 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-ink line-clamp-1">{offer.title}</h4>
                    <p className="text-[11px] text-ink-3 line-clamp-1 mt-0.5">{offer.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleting(offer)}
                    aria-label="حذف العرض"
                    className="w-8 h-8 grid place-items-center rounded-lg text-ink-3 hover:text-danger hover:bg-danger-soft transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t border-line">
                  <span className="mnr-badge mnr-badge-success">
                    {offer.discountType === 'percentage' ? (
                      <Percent className="w-3 h-3" />
                    ) : (
                      <Banknote className="w-3 h-3" />
                    )}
                    {formatNumber(offer.discountValue)}
                    {offer.discountType === 'percentage' ? '%' : ' د.ع'}
                  </span>

                  <span className="mnr-badge mnr-badge-neutral">
                    <Tag className="w-3 h-3" />
                    {offer.targetCategory === 'all'
                      ? 'كل الأقسام'
                      : CATEGORIES_LIST.find((c) => c.id === offer.targetCategory)?.name}
                  </span>

                  {offer.code && (
                    <span className="mnr-badge mnr-badge-brand mnr-num">{offer.code}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        title="حذف هذا العرض؟"
        body={`سيُحذف العرض «${deleting?.title ?? ''}» من واجهة المتجر.`}
        confirmLabel="تأكيد الحذف"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            removeOffer(deleting.id);
            notify('تم حذف العرض');
          }
          setDeleting(null);
        }}
      />
    </div>
  );
};
