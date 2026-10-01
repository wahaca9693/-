import React, { useState } from 'react';
import {
  Truck,
  Save,
  MapPin,
  Clock,
  Gift,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { DeliveryZone } from '../../../types/store';
import { deliveryService } from '../../../services/deliveryService';
import { formatIQD, formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, StatCard, Field, EmptyState } from '../ui';

export const DeliveryTab: React.FC = () => {
  const { delivery, saveDelivery, notify } = useAdmin();
  const [draft, setDraft] = useState(delivery);
  const [search, setSearch] = useState('');

  const setZone = (governorate: string, patch: Partial<DeliveryZone>) =>
    setDraft((d) => ({
      ...d,
      zones: d.zones.map((z) => (z.governorate === governorate ? { ...z, ...patch } : z)),
    }));

  const visibleZones = draft.zones.filter((z) =>
    z.governorate.includes(search.trim())
  );

  const activeZones = draft.zones.filter((z) => z.enabled);
  const avgEta = activeZones.length
    ? (activeZones.reduce((s, z) => s + z.etaDays, 0) / activeZones.length).toFixed(1)
    : '0';

  const handleSave = () => {
    saveDelivery(draft);
    notify('تم حفظ إعدادات التوصيل');
  };

  const handleReset = () => {
    const fresh = deliveryService.reset();
    setDraft(fresh);
    notify('تمت استعادة إعدادات التوصيل الافتراضية', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={MapPin}
          label="محافظات مفعّلة"
          value={`${activeZones.length} / ${draft.zones.length}`}
          tone="brand"
        />
        <StatCard
          icon={Clock}
          label="متوسط زمن التوصيل"
          value={`${avgEta} يوم`}
          tone="info"
        />
        <StatCard
          icon={Truck}
          label="الأجور العامة"
          value={formatIQD(draft.defaultFee)}
          tone="gold"
        />
        <StatCard
          icon={Gift}
          label="الشحن المجاني"
          value={draft.freeShippingThreshold ? formatIQD(draft.freeShippingThreshold) : 'معطّل'}
          tone="success"
        />
      </div>

      {/* الإعدادات العامة */}
      <Panel
        title="الإعدادات العامة للتوصيل"
        description="تُطبَّق على كل المحافظات التي لم تُحدَّد لها أجور خاصة"
        action={
          <div className="flex gap-2">
            <button type="button" onClick={handleReset} className="mnr-btn mnr-btn-ghost h-9 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              استعادة
            </button>
            <button type="button" onClick={handleSave} className="mnr-btn mnr-btn-primary h-9 text-xs">
              <Save className="w-4 h-4" />
              حفظ
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="أجور التوصيل الافتراضية (د.ع)" hint="للمحافظات غير المدرجة أسفله">
            <input
              type="number"
              min={0}
              step={500}
              value={draft.defaultFee}
              onChange={(e) => setDraft((d) => ({ ...d, defaultFee: Number(e.target.value) }))}
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field label="مدة التوصيل الافتراضية (أيام)">
            <input
              type="number"
              min={1}
              max={30}
              value={draft.defaultEtaDays}
              onChange={(e) => setDraft((d) => ({ ...d, defaultEtaDays: Number(e.target.value) }))}
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field
            label="حد الشحن المجاني (د.ع)"
            hint="0 = تعطيل الشحن المجاني. يتجاوز هذا المبلغ يصبح التوصيل مجانياً لكل المحافظات."
          >
            <input
              type="number"
              min={0}
              step={50_000}
              value={draft.freeShippingThreshold}
              onChange={(e) =>
                setDraft((d) => ({ ...d, freeShippingThreshold: Number(e.target.value) }))
              }
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>
        </div>
      </Panel>

      {/* جدول المحافظات */}
      <Panel
        title="أجور التوصيل حسب المحافظة"
        description="عدّل الأجر ومدة التوصيل لكل محافظة، أو عطّل التوصيل إليها مؤقتاً"
        bodyClassName="p-4"
        action={
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن محافظة..."
              className="mnr-field h-9 pr-9 w-48"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
          </div>
        }
      >
        {visibleZones.length === 0 ? (
          <EmptyState icon={MapPin} title="لا توجد محافظة مطابقة" description="جرّب اسماً آخر." />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-5">
            <table className="w-full text-xs min-w-[720px]">
              <thead>
                <tr className="text-ink-3 border-b border-line">
                  <th className="text-right font-bold py-2.5 px-4">المحافظة</th>
                  <th className="text-right font-bold py-2.5 px-3">أجر التوصيل</th>
                  <th className="text-right font-bold py-2.5 px-3">شحن مجاني فوق</th>
                  <th className="text-center font-bold py-2.5 px-3">مدة التوصيل</th>
                  <th className="text-center font-bold py-2.5 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visibleZones.map((zone) => (
                  <tr key={zone.governorate} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-extrabold text-ink">{zone.governorate}</span>
                    </td>

                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min={0}
                        step={500}
                        value={zone.fee}
                        disabled={!zone.enabled}
                        onChange={(e) => setZone(zone.governorate, { fee: Number(e.target.value) })}
                        dir="ltr"
                        className="mnr-field h-9 w-28 mnr-num disabled:opacity-50"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min={0}
                        step={50_000}
                        value={zone.freeAbove}
                        disabled={!zone.enabled}
                        onChange={(e) => setZone(zone.governorate, { freeAbove: Number(e.target.value) })}
                        dir="ltr"
                        className="mnr-field h-9 w-32 mnr-num disabled:opacity-50"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={zone.etaDays}
                          disabled={!zone.enabled}
                          onChange={(e) => setZone(zone.governorate, { etaDays: Number(e.target.value) })}
                          dir="ltr"
                          className="mnr-field h-9 w-16 mnr-num text-center disabled:opacity-50"
                        />
                        <span className="text-ink-3 text-[10px]">يوم</span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => setZone(zone.governorate, { enabled: !zone.enabled })}
                        className={`mnr-badge ${zone.enabled ? 'mnr-badge-success' : 'mnr-badge-neutral'}`}
                      >
                        {zone.enabled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            مفعّل
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            موقوف
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="pt-3 text-[11px] text-ink-3">
          المجموع: {formatNumber(activeZones.length)} محافظة متاحة للتوصيل.
          متوسط الزمن أعلاه يُحسب من المحافظات المفعّلة فقط، والمدة تظهر للزبون في صفحة الدفع.
        </p>
      </Panel>
    </div>
  );
};
