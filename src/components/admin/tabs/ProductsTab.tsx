import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Package,
  PackageX,
  Minus,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';
import { Product, ProductCategory } from '../../../types/store';
import { CATEGORIES_LIST } from '../../../data/initialData';
import { storeStorage } from '../../../services/storeStorage';
import { downloadFile, readTextFile, todayStamp } from '../../../lib/image';
import { formatIQD, formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, EmptyState, Field, SegmentedControl } from '../ui';
import { ProductFormModal } from '../ProductFormModal';
import { ConfirmDialog } from '../ConfirmDialog';

type Filter = 'all' | ProductCategory | 'low-stock' | 'out-of-stock';

export const ProductsTab: React.FC = () => {
  const { products, saveProduct, createProduct, removeProducts, restock, notify, refreshAll } = useAdmin();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ title: string; body: string; ids?: string[] } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !`${p.name} ${p.nameEn} ${p.brand}`.toLowerCase().includes(q)) return false;
      if (filter === 'low-stock') return p.stock > 0 && p.stock <= 5;
      if (filter === 'out-of-stock') return p.stock <= 0 || p.status === 'out_of_stock';
      if (filter !== 'all') return p.category === filter;
      return true;
    });
  }, [products, search, filter]);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));

  /* ------------------------------ التصدير ------------------------------ */
  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const snapshot = { meta: { app: 'M.N.R Store', kind: 'products', exportedAt: new Date().toISOString() }, products };
      downloadFile(JSON.stringify(snapshot, null, 2), `mnr-products-${todayStamp()}.json`);
      notify(`تم تنزيل ${products.length} منتج بصيغة JSON`);
      return;
    }

    const header = [
      'id', 'name', 'nameEn', 'brand', 'category', 'price', 'oldPrice',
      'stock', 'status', 'rating', 'warranty', 'description',
    ];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = products.map((p) =>
      [p.id, p.name, p.nameEn, p.brand, p.category, p.price, p.oldPrice ?? '',
        p.stock, p.status, p.rating, p.warranty, p.description].map(escape).join(',')
    );
    // BOM حتى تفتح إكسل العربية بشكل صحيح
    downloadFile(`﻿${[header.join(','), ...rows].join('\n')}`, `mnr-products-${todayStamp()}.csv`, 'text/csv');
    notify(`تم تنزيل ${products.length} منتج بصيغة CSV`);
  };

  /* ------------------------------ الاستيراد ------------------------------ */
  const handleImport = async (file?: File) => {
    if (!file) return;
    setImportError(null);
    try {
      const text = await readTextFile(file);
      const parsed = JSON.parse(text);
      const incoming: Product[] = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(incoming)) throw new Error('صيغة الملف غير معروفة');

      const { added, updated } = storeStorage.mergeProducts(incoming);
      refreshAll();
      notify(`تم الاستيراد: ${added} جديد و${updated} محدّث`);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'تعذّر قراءة الملف');
    }
  };

  const handleReset = () =>
    setConfirm({
      title: 'استعادة الكتالوج الأصلي؟',
      body: 'سيتم حذف كل المنتجات المضافة والمعدّلة والعودة للمنتجات الأصلية المدموجة. لا يمكن التراجع.',
    });

  return (
    <div className="space-y-4">
      {/* المؤشرات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي المنتجات', value: formatNumber(products.length), tone: 'bg-brand-soft text-brand-ink', icon: Package },
          { label: 'قيمة المخزون', value: formatIQD(totalValue), tone: 'bg-gold-soft text-gold', icon: PackageCheck },
          { label: 'مخزون منخفض', value: formatNumber(lowStock), tone: 'bg-warn-soft text-warn', icon: PackageX },
          { label: 'نفد المخزون', value: formatNumber(outOfStock), tone: 'bg-danger-soft text-danger', icon: PackageX },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3.5 rounded-xl border border-line bg-surface flex items-center gap-3">
              <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${item.tone}`}>
                <Icon className="w-4.5 h-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-ink-3 truncate">{item.label}</p>
                <p className="mnr-num text-sm font-extrabold text-ink truncate">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* الأدوات */}
      <Panel
        title="كتالوج المنتجات"
        description={`${filtered.length} من ${products.length} منتج`}
        bodyClassName="p-4 space-y-3"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setIsFormOpen(true);
              }}
              className="mnr-btn mnr-btn-primary h-9 text-xs"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="بحث" className="lg:col-span-2">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الماركة..."
                className="mnr-field pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
            </div>
          </Field>

          <Field label="تصفية">
            <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="mnr-field">
              <option value="all">كل المنتجات</option>
              <option value="low-stock">مخزون منخفض (أقل من 5)</option>
              <option value="out-of-stock">نفد المخزون</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="نقل وتصدير">
            <div className="flex gap-1.5">
              <label className="mnr-btn mnr-btn-soft h-11 px-3 flex-1 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-xs">استيراد</span>
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => handleImport(e.target.files?.[0])}
                />
              </label>
              <button type="button" onClick={() => handleExport('json')} className="mnr-btn mnr-btn-soft h-11 px-3" title="تنزيل JSON">
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="mnr-btn mnr-btn-soft h-11 px-3 text-[11px]"
                title="تنزيل CSV لإكسل"
              >
                CSV
              </button>
            </div>
          </Field>
        </div>

        {importError && <p className="text-[11px] text-danger font-bold">{importError}</p>}

        {/* شريط الإجراءات الجماعية */}
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-brand-soft border border-brand/25">
            <span className="text-xs font-bold text-ink">
              تم تحديد {selected.length} منتج
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirm({
                    title: `حذف ${selected.length} منتج؟`,
                    body: 'سيتم حذف المنتجات المحددة نهائياً من المتجر.',
                    ids: selected,
                  });
                }}
                className="mnr-btn mnr-btn-danger h-8 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                حذف المحدد
              </button>
              <button type="button" onClick={() => setSelected([])} className="mnr-btn mnr-btn-ghost h-8 text-[11px]">
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}

        {/* الجدول */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="لا توجد منتجات مطابقة"
            description="جرّب تغيير البحث أو التصفية، أو أضف منتجاً جديداً."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
                className="mnr-btn mnr-btn-soft h-9 text-xs"
              >
                إعادة ضبط التصفية
              </button>
            }
          />
        ) : (
          <div className="-mx-4 sm:-mx-5 overflow-x-auto">
            <table className="w-full text-xs min-w-[820px]">
              <thead>
                <tr className="text-ink-3 border-b border-line">
                  <th className="text-right font-bold py-2.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selected.length > 0 && selected.length === filtered.length}
                      onChange={selectAll}
                      aria-label="تحديد الكل"
                      className="w-4 h-4 accent-[var(--mnr-brand)]"
                    />
                  </th>
                  <th className="text-right font-bold py-2.5 px-3">المنتج</th>
                  <th className="text-right font-bold py-2.5 px-3">القسم</th>
                  <th className="text-right font-bold py-2.5 px-3">السعر</th>
                  <th className="text-center font-bold py-2.5 px-3">المخزون</th>
                  <th className="text-center font-bold py-2.5 px-3">الحالة</th>
                  <th className="text-left font-bold py-2.5 px-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((product) => {
                  const isOut = product.stock <= 0 || product.status === 'out_of_stock';
                  return (
                    <tr key={product.id} className="hover:bg-surface-2 transition-colors">
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          aria-label={`تحديد ${product.name}`}
                          className="w-4 h-4 accent-[var(--mnr-brand)]"
                        />
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-surface-2 border border-line shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-ink line-clamp-1 max-w-[16rem]">{product.name}</p>
                            <p className="text-[10px] text-ink-3">{product.brand}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-ink-2">
                        {CATEGORIES_LIST.find((c) => c.id === product.category)?.name ?? product.category}
                      </td>

                      <td className="px-3 py-2.5">
                        <span className="mnr-num font-extrabold text-gold whitespace-nowrap">
                          {formatIQD(product.price)}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="mnr-num text-[10px] text-ink-3 line-through mr-1.5">
                            {formatIQD(product.oldPrice)}
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => restock(product.id, -1)}
                            aria-label="إنقاص"
                            className="w-6 h-6 grid place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            dir="ltr"
                            className={`mnr-num w-8 text-center font-extrabold ${
                              isOut ? 'text-danger' : product.stock <= 5 ? 'text-warn' : 'text-ink'
                            }`}
                          >
                            {product.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => restock(product.id, 1)}
                            aria-label="زيادة"
                            className="w-6 h-6 grid place-items-center rounded-md text-brand-ink hover:bg-brand-soft"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-center">
                        {isOut ? (
                          <span className="mnr-badge mnr-badge-danger">نفد</span>
                        ) : product.status === 'coming_soon' ? (
                          <span className="mnr-badge mnr-badge-warn">قريباً</span>
                        ) : (
                          <span className="mnr-badge mnr-badge-success">معروض</span>
                        )}
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(product);
                              setIsFormOpen(true);
                            }}
                            aria-label="تعديل"
                            className="w-8 h-8 grid place-items-center rounded-lg text-ink-3 hover:text-brand-ink hover:bg-brand-soft transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setConfirm({
                                title: 'حذف هذا المنتج؟',
                                body: `سيُحذف «${product.name}» نهائياً من المتجر.`,
                                ids: [product.id],
                              })
                            }
                            aria-label="حذف"
                            className="w-8 h-8 grid place-items-center rounded-lg text-ink-3 hover:text-danger hover:bg-danger-soft transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-2">
          <button type="button" onClick={handleReset} className="mnr-btn mnr-btn-ghost h-9 text-[11px] text-ink-3">
            <RotateCcw className="w-3.5 h-3.5" />
            استعادة الكتالوج الأصلي
          </button>
        </div>
      </Panel>

      <ProductFormModal
        isOpen={isFormOpen}
        product={editing}
        existingBrands={brands}
        onClose={() => {
          setIsFormOpen(false);
          setEditing(null);
        }}
        onSave={(product) => {
          saveProduct(product);
          notify('تم حفظ التعديلات');
        }}
        onCreate={(product) => {
          createProduct(product);
          notify('تم نشر المنتج في المتجر');
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(confirm)}
        title={confirm?.title ?? ''}
        body={confirm?.body ?? ''}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.ids) {
            const removed = removeProducts(confirm.ids);
            notify(`تم حذف ${removed} منتج`);
            setSelected([]);
          } else {
            storeStorage.resetProducts();
            refreshAll();
            notify('تمت استعادة الكتالوج الأصلي', 'info');
          }
          setConfirm(null);
        }}
      />
    </div>
  );
};
