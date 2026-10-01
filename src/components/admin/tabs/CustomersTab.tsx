import React, { useMemo, useState } from 'react';
import { Search, Users, Phone, MapPin, ShoppingBag, Crown } from 'lucide-react';
import { formatIQD, formatNumber } from '../../../lib/format';
import { useAdmin } from '../AdminContext';
import { Panel, EmptyState, Field, StatCard } from '../ui';

export const CustomersTab: React.FC = () => {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      `${c.name} ${c.phone} ${c.governorate} ${c.city}`.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const average = customers.length ? totalSpent / customers.length : 0;
  const repeat = customers.filter((c) => c.totalOrders > 1).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="إجمالي الزبائن" value={formatNumber(customers.length)} tone="brand" />
        <StatCard icon={Crown} label="زبائن متكررون" value={formatNumber(repeat)} tone="gold" />
        <StatCard icon={ShoppingBag} label="إجمالي المشتريات" value={formatIQD(totalSpent)} tone="success" />
        <StatCard icon={ShoppingBag} label="متوسط قيمة الزبون" value={formatIQD(average)} tone="info" />
      </div>

      <Panel
        title="قائمة الزبائن"
        description="تُبنى تلقائياً من الطلبات المؤكدة"
        bodyClassName="p-4"
        action={
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الهاتف..."
              className="mnr-field h-9 pr-9 w-56"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="لا يوجد زبائن مطابقون" description="جرّب اسماً أو رقماً آخر." />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-5">
            <table className="w-full text-xs min-w-[720px]">
              <thead>
                <tr className="text-ink-3 border-b border-line">
                  <th className="text-right font-bold py-2.5 px-4">الزبون</th>
                  <th className="text-right font-bold py-2.5 px-3">الهاتف</th>
                  <th className="text-right font-bold py-2.5 px-3">الموقع</th>
                  <th className="text-center font-bold py-2.5 px-3">الطلبات</th>
                  <th className="text-right font-bold py-2.5 px-3">إجمالي الشراء</th>
                  <th className="text-left font-bold py-2.5 px-3">آخر طلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-brand-soft text-brand-ink grid place-items-center text-[11px] font-extrabold shrink-0">
                          {customer.name.slice(0, 1)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-extrabold text-ink">{customer.name}</p>
                          {customer.totalOrders > 1 && (
                            <span className="mnr-badge mnr-badge-gold">زبون مميّز</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <a
                        href={`tel:${customer.phone}`}
                        className="mnr-num text-brand-ink hover:underline inline-flex items-center gap-1"
                        dir="ltr"
                      >
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </a>
                    </td>

                    <td className="px-3 py-2.5 text-ink-2">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ink-3" />
                        {customer.governorate} — {customer.city}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <span className="mnr-badge mnr-badge-neutral">{formatNumber(customer.totalOrders)}</span>
                    </td>

                    <td className="px-3 py-2.5">
                      <span className="mnr-num font-extrabold text-gold whitespace-nowrap">
                        {formatIQD(customer.totalSpent)}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-ink-3">{customer.lastOrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};
