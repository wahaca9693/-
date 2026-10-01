import React from 'react';
import {
  Banknote,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  PackageX,
  Users,
  TrendingUp,
  ArrowLeft,
  Bell,
  MapPin,
  X,
} from 'lucide-react';
import { formatIQD, formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, StatCard, EmptyState, OrderStatusBadge, ORDER_STATUS_META } from '../ui';

export const OverviewTab: React.FC = () => {
  const { orders, products, customers, setTab, newOrder, dismissNewOrder, setOrderStatus, notify } = useAdmin();

  const valid = orders.filter((o) => o.status !== 'cancelled');
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === today);
  const revenueToday = todayOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  const newCount = orders.filter((o) => o.status === 'new').length;
  const preparing = orders.filter((o) => o.status === 'processing').length;
  const shipped = orders.filter((o) => o.status === 'shipped').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outStock = products.filter((p) => p.stock <= 0);

  const recent = orders.slice(0, 6);
  const topProducts = [...products]
    .sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount)
    .slice(0, 5);

  const byGov = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.governorate] = (acc[o.governorate] ?? 0) + 1;
    return acc;
  }, {});
  const topGovs = Object.entries(byGov).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxGov = topGovs[0]?.[1] ?? 1;

  return (
    <div className="space-y-4">
      {/* تنبيه الطلب الجديد */}
      {newOrder && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-brand-soft border border-brand/35 animate-rise">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-brand text-on-brand grid place-items-center shrink-0 animate-pulse">
              <Bell className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-ink">وصل طلب جديد الآن</p>
              <p className="text-[11px] text-ink-2 truncate">
                <span className="mnr-num">{newOrder.orderNumber}</span> — {newOrder.customerName} •{' '}
                {newOrder.governorate} • {formatIQD(newOrder.total)}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setOrderStatus(newOrder.id, 'reviewing');
                setTab('orders');
                dismissNewOrder();
                notify('تم استلام الطلب ونقله للمراجعة');
              }}
              className="mnr-btn mnr-btn-primary h-9 text-xs"
            >
              استلام الطلب
            </button>
            <button
              type="button"
              onClick={dismissNewOrder}
              aria-label="إخفاء"
              className="w-9 h-9 grid place-items-center rounded-lg text-ink-3 hover:bg-surface-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* المؤشرات الرئيسية */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          icon={Banknote}
          label="إجمالي المبيعات"
          value={formatIQD(revenue)}
          hint={`${formatNumber(valid.length)} طلب مكتمل`}
          tone="gold"
        />
        <StatCard
          icon={TrendingUp}
          label="مبيعات اليوم"
          value={formatIQD(revenueToday)}
          hint={`${formatNumber(todayOrders.length)} طلب اليوم`}
          tone="success"
        />
        <StatCard
          icon={Clock}
          label="طلبات تحتاج إجراء"
          value={formatNumber(newCount + preparing + shipped)}
          hint={`${newCount} جديد • ${preparing} تجهيز • ${shipped} شحن`}
          tone="warn"
        />
        <StatCard
          icon={Users}
          label="الزبائن"
          value={formatNumber(customers.length)}
          hint={`${formatNumber(customers.filter((c) => c.totalOrders > 1).length)} زبون مكرر`}
          tone="brand"
        />
      </div>

      {/* تنبيهات المخزون */}
      {(lowStock.length > 0 || outStock.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {lowStock.length > 0 && (
            <button
              type="button"
              onClick={() => setTab('products')}
              className="flex items-center gap-3 p-4 rounded-2xl bg-warn-soft border border-warn/25 text-right hover:border-warn/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-warn/15 text-warn grid place-items-center shrink-0">
                <Package className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-ink">
                  {formatNumber(lowStock.length)} منتج قارب على النفاد
                </p>
                <p className="text-[11px] text-ink-2 truncate">
                  {lowStock.slice(0, 3).map((p) => p.name.split(' - ')[0]).join('، ')}
                  {lowStock.length > 3 ? ' وغيرها' : ''}
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-ink-3 shrink-0" />
            </button>
          )}

          {outStock.length > 0 && (
            <button
              type="button"
              onClick={() => setTab('products')}
              className="flex items-center gap-3 p-4 rounded-2xl bg-danger-soft border border-danger/25 text-right hover:border-danger/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-danger/15 text-danger grid place-items-center shrink-0">
                <PackageX className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-ink">
                  {formatNumber(outStock.length)} منتج نفد من المخزون
                </p>
                <p className="text-[11px] text-ink-2 truncate">
                  {outStock.slice(0, 3).map((p) => p.name.split(' - ')[0]).join('، ')}
                  {outStock.length > 3 ? ' وغيرها' : ''}
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-ink-3 shrink-0" />
            </button>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* آخر الطلبات */}
        <Panel
          title="آخر الطلبات"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <button
              type="button"
              onClick={() => setTab('orders')}
              className="text-[11px] font-bold text-brand-ink hover:underline"
            >
              عرض الكل
            </button>
          }
        >
          {recent.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="لا توجد طلبات بعد" />
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((order) => (
                <li key={order.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="mnr-num text-xs font-extrabold text-ink">{order.orderNumber}</p>
                    <p className="text-[11px] text-ink-3 truncate">
                      {order.customerName} • {order.governorate}
                    </p>
                  </div>
                  <span className="mnr-num text-xs font-extrabold text-gold whitespace-nowrap shrink-0">
                    {formatIQD(order.total)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* التوزيع الجغرافي */}
        <Panel title="أكثر المحافظات طلباً" bodyClassName="p-4 space-y-3">
          {topGovs.length === 0 ? (
            <EmptyState icon={MapPin} title="لا توجد بيانات" />
          ) : (
            topGovs.map(([gov, count]) => (
              <div key={gov}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-ink-2">{gov}</span>
                  <span className="mnr-num text-ink-3">{formatNumber(count)} طلب</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(count / maxGov) * 100}%`,
                      backgroundImage: 'linear-gradient(90deg, var(--mnr-brand), var(--mnr-brand-2))',
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </Panel>
      </div>

      {/* الأكثر مبيعاً */}
      <Panel title="المنتجات الأكثر طلباً" description="مرتّبة حسب التقييم وعدد التقييمات">
        {topProducts.length === 0 ? (
          <EmptyState icon={Package} title="لا توجد منتجات" />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topProducts.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3 p-3 rounded-xl border border-line bg-surface-2">
                <span className="mnr-num w-7 h-7 rounded-lg bg-brand-soft text-brand-ink grid place-items-center text-xs font-extrabold shrink-0">
                  {index + 1}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold text-ink line-clamp-1">{product.name}</p>
                  <p className="text-[10px] text-ink-3">
                    {product.brand} • {product.rating} ★ ({product.reviewsCount})
                  </p>
                </div>
                <span className="mnr-num text-[11px] font-extrabold text-gold shrink-0">
                  {formatIQD(product.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};
