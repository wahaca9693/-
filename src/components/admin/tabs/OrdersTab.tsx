import React, { useMemo, useState } from 'react';
import {
  Search,
  Package,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  XCircle,
  Printer,
  Inbox,
  Eye,
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types/store';
import { IRAQ_GOVERNORATES } from '../../../data/initialData';
import { formatIQD, formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, EmptyState, Field, OrderStatusBadge, ORDER_STATUS_META, ORDER_STATUS_FLOW } from '../ui';
import { Modal } from '../../ui/Modal';
import { ConfirmDialog } from '../ConfirmDialog';

export const OrdersTab: React.FC = () => {
  const { orders, setOrderStatus, notify } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [govFilter, setGovFilter] = useState('all');
  const [viewing, setViewing] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (govFilter !== 'all' && o.governorate !== govFilter) return false;
      if (q && !`${o.orderNumber} ${o.customerName} ${o.phone}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, search, statusFilter, govFilter]);

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const counts = useMemo(
    () =>
      orders.reduce<Record<string, number>>((acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      }, {}),
    [orders]
  );

  const openOrder = (order: Order | null) => {
    if (!order) return;
    setViewing(orders.find((o) => o.id === order.id) ?? order);
  };

  return (
    <div className="space-y-4">
      {/* شريط الحالات */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`mnr-badge h-8 px-3 ${statusFilter === 'all' ? 'mnr-badge-brand' : 'mnr-badge-neutral'}`}
        >
          الكل ({formatNumber(orders.length)})
        </button>
        {ORDER_STATUS_FLOW.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`mnr-badge h-8 px-3 ${
              statusFilter === status ? 'mnr-badge-brand' : 'mnr-badge-neutral'
            }`}
          >
            {ORDER_STATUS_META[status].label} ({counts[status] ?? 0})
          </button>
        ))}
      </div>

      <Panel
        title="الطلبات"
        description={`${filtered.length} طلب معروض • إجمالي المبيعات ${formatIQD(revenue)}`}
      >
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <Field label="بحث">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="رقم الطلب، اسم الزبون، أو الهاتف"
                className="mnr-field pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
            </div>
          </Field>

          <Field label="المحافظة">
            <select
              value={govFilter}
              onChange={(e) => setGovFilter(e.target.value)}
              className="mnr-field"
            >
              <option value="all">كل المحافظات</option>
              {IRAQ_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ملخص المبيعات">
            <div className="mnr-field h-11 flex items-center bg-surface-2">
              <span className="mnr-num font-extrabold text-gold">{formatIQD(revenue)}</span>
            </div>
          </Field>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="لا توجد طلبات مطابقة"
            description="غيّر عوامل التصفية أو بانتظار أول طلب من الزبائن."
          />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-5">
            <table className="w-full text-xs min-w-[900px]">
              <thead>
                <tr className="text-ink-3 border-b border-line">
                  <th className="text-right font-bold py-2.5 px-4">رقم الطلب</th>
                  <th className="text-right font-bold py-2.5 px-3">الزبون</th>
                  <th className="text-right font-bold py-2.5 px-3">الموقع</th>
                  <th className="text-right font-bold py-2.5 px-3">الإجمالي</th>
                  <th className="text-center font-bold py-2.5 px-3">الحالة</th>
                  <th className="text-left font-bold py-2.5 px-3">تغيير الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => openOrder(order)}
                        className="mnr-num font-extrabold text-brand-ink hover:underline"
                      >
                        {order.orderNumber}
                      </button>
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="font-bold text-ink">{order.customerName}</p>
                      <p className="mnr-num text-[10px] text-ink-3" dir="ltr">
                        {order.phone}
                      </p>
                    </td>

                    <td className="px-3 py-2.5 text-ink-2">
                      {order.governorate} — {order.city}
                    </td>

                    <td className="px-3 py-2.5">
                      <span className="mnr-num font-extrabold text-gold whitespace-nowrap">
                        {formatIQD(order.total)}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const next = e.target.value as OrderStatus;
                            if (next === 'cancelled') {
                              setCancelling(order);
                              return;
                            }
                            setOrderStatus(order.id, next);
                            notify(`تم تحديث الطلب إلى «${ORDER_STATUS_META[next].label}»`);
                          }}
                          className="mnr-field h-8 py-0 w-36 text-[11px]"
                        >
                          {Object.entries(ORDER_STATUS_META).map(([key, meta]) => (
                            <option key={key} value={key}>
                              {meta.label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => openOrder(order)}
                          aria-label="عرض التفاصيل"
                          className="w-8 h-8 grid place-items-center rounded-lg text-ink-3 hover:text-brand-ink hover:bg-brand-soft transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* تفاصيل الطلب */}
      <Modal
        isOpen={Boolean(viewing)}
        onClose={() => setViewing(null)}
        size="lg"
        title={viewing?.orderNumber}
        subtitle={viewing ? `${viewing.customerName} • ${viewing.governorate}` : undefined}
        icon={Package}
      >
        {viewing && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* المسار الزمني */}
            {viewing.status !== 'cancelled' && (
              <div>
                <p className="text-xs font-extrabold text-ink mb-2.5">مسار الطلب</p>
                <div className="flex flex-wrap gap-1.5">
                  {ORDER_STATUS_FLOW.map((status, idx) => {
                    const currentIndex = ORDER_STATUS_FLOW.indexOf(viewing.status);
                    const done = idx < currentIndex;
                    const current = idx === currentIndex;
                    return (
                      <React.Fragment key={status}>
                        <span
                          className={`mnr-badge ${
                            current
                              ? 'mnr-badge-brand'
                              : done
                                ? 'mnr-badge-success'
                                : 'mnr-badge-neutral'
                          }`}
                        >
                          {ORDER_STATUS_META[status].label}
                        </span>
                        {idx < ORDER_STATUS_FLOW.length - 1 && <span className="text-ink-3">←</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* بيانات التوصيل */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <InfoRow icon={Phone} label="الهاتف" value={viewing.phone} ltr />
              <InfoRow icon={MapPin} label="المحافظة والمدينة" value={`${viewing.governorate} — ${viewing.city}`} />
              <InfoRow icon={MapPin} label="المنطقة" value={viewing.district} />
              <InfoRow icon={Truck} label="نقطة دالة" value={viewing.nearestLandmark} />
              <div className="sm:col-span-2">
                <InfoRow icon={MapPin} label="العنوان" value={viewing.address} />
              </div>
              {viewing.notes && (
                <div className="sm:col-span-2">
                  <InfoRow icon={MessageSquare} label="ملاحظات الزبون" value={viewing.notes} />
                </div>
              )}
            </div>

            {/* المنتجات */}
            <div className="rounded-xl border border-line overflow-hidden">
              <p className="px-4 py-2.5 text-xs font-extrabold text-ink-2 border-b border-line bg-surface-2">
                المنتجات ({viewing.items.length})
              </p>
              <ul className="divide-y divide-line">
                {viewing.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 p-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-surface-2 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-ink line-clamp-1">{item.productName}</p>
                      <p className="mnr-num text-[10px] text-ink-3">
                        {item.quantity} × {formatIQD(item.unitPrice)}
                      </p>
                    </div>
                    <span className="mnr-num text-xs font-extrabold text-gold">
                      {formatIQD(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* الحساب */}
            <div className="rounded-xl bg-brand-soft border border-brand/25 p-4 space-y-2 text-xs">
              <Row label="مجموع المنتجات" value={formatIQD(viewing.subtotal)} />
              <Row label="أجور التوصيل" value={formatIQD(viewing.deliveryFee)} />
              <div className="pt-2 border-t border-brand/20 flex justify-between items-baseline">
                <span className="font-extrabold text-ink text-sm">المبلغ المطلوب تحصيله</span>
                <span className="mnr-num text-lg font-extrabold text-gold">{formatIQD(viewing.total)}</span>
              </div>
            </div>

            {/* السجل */}
            {viewing.timelineNotes && viewing.timelineNotes.length > 0 && (
              <div>
                <p className="text-xs font-extrabold text-ink mb-2">سجل الحالة</p>
                <ul className="space-y-1.5">
                  {[...viewing.timelineNotes].reverse().map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-ink-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                      <span className="flex-1">{note.note}</span>
                      <span className="text-ink-3 shrink-0">
                        {new Date(note.timestamp).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <a href={`tel:${viewing.phone}`} className="mnr-btn mnr-btn-soft h-11 text-xs">
                <Phone className="w-4 h-4 text-brand-ink" />
                اتصال بالزبون
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="mnr-btn mnr-btn-soft h-11 text-xs"
              >
                <Printer className="w-4 h-4" />
                طباعة الفاتورة
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(cancelling)}
        title="إلغاء هذا الطلب؟"
        body={`سيتم إلغاء الطلب ${cancelling?.orderNumber ?? ''} وإشعار الزبون بأن الطلب غير مكتمل.`}
        confirmLabel="تأكيد الإلغاء"
        onCancel={() => setCancelling(null)}
        onConfirm={() => {
          if (cancelling) {
            setOrderStatus(cancelling.id, 'cancelled');
            notify('تم إلغاء الطلب', 'danger');
          }
          setCancelling(null);
        }}
      />
    </div>
  );
}

const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  ltr?: boolean;
}> = ({ icon: Icon, label, value, ltr }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-3.5 h-3.5 text-ink-3 shrink-0 mt-0.5" />
    <div className="min-w-0">
      <p className="text-ink-3">{label}</p>
      <p className={`font-bold text-ink ${ltr ? 'mnr-num' : ''}`} dir={ltr ? 'ltr' : undefined}>
        {value}
      </p>
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-ink-2">
    <span>{label}</span>
    <span className="mnr-num font-extrabold text-ink">{value}</span>
  </div>
);
