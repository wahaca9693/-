import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Gift,
  Users,
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Menu,
  Lock,
  Volume2,
  VolumeX,
  Store,
} from 'lucide-react';
import { AdminProvider, useAdmin, AdminTab } from './AdminContext';
import { OverviewTab } from './tabs/OverviewTab';
import { OrdersTab } from './tabs/OrdersTab';
import { ProductsTab } from './tabs/ProductsTab';
import { DeliveryTab } from './tabs/DeliveryTab';
import { OffersTab } from './tabs/OffersTab';
import { CustomersTab } from './tabs/CustomersTab';
import { SettingsTab } from './tabs/SettingsTab';
import { Logo } from '../Logo';
import { formatNumber } from '../../lib/format';

const NAV: { id: AdminTab; label: string; icon: React.ElementType; badge?: 'orders' | 'products' }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'orders', label: 'الطلبات', icon: ShoppingCart, badge: 'orders' },
  { id: 'products', label: 'المنتجات', icon: Package, badge: 'products' },
  { id: 'delivery', label: 'التوصيل والشحن', icon: Truck },
  { id: 'offers', label: 'العروض والتخفيضات', icon: Gift },
  { id: 'customers', label: 'الزبائن', icon: Users },
  { id: 'settings', label: 'إعدادات المتجر', icon: Settings },
];

const Shell: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { tab, setTab, orders, products, settings, saveStoreSettings, toast, newOrder } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const newOrders = orders.filter((o) => o.status === 'new').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  // ESC لإغلاق اللوحة
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = (next: AdminTab) => {
    setTab(next);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-canvas flex flex-col animate-fade-in">
      {/* الترويسة */}
      <header className="h-16 shrink-0 border-b border-line bg-surface flex items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="القائمة"
            className="lg:hidden w-9 h-9 grid place-items-center rounded-lg text-ink-2 hover:bg-surface-2"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <Logo size="sm" showSubtitle={false} />
          </div>

          <div className="min-w-0">
            <h1 className="mnr-h2 text-sm sm:text-base text-ink truncate">لوحة تحكم M.N.R</h1>
            <p className="text-[10px] text-ink-3 truncate hidden sm:block">
              إدارة المنتجات والطلبات والتوصيل — كل شيء محفوظ على جهازك
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {newOrder && (
            <span className="mnr-badge mnr-badge-brand hidden sm:flex animate-pulse">
              طلب جديد وارد
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !settings.audioNotifications;
              saveStoreSettings({ ...settings, audioNotifications: next });
            }}
            aria-label="تنبيه صوتي"
            className="w-9 h-9 grid place-items-center rounded-lg text-ink-2 hover:bg-surface-2 transition-colors"
          >
            {settings.audioNotifications ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mnr-btn mnr-btn-soft h-9 text-xs"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للمتجر</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* القائمة الجانبية */}
        <aside
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:block absolute lg:relative inset-y-0 right-0 z-40 w-64 lg:w-56 shrink-0 border-l border-line bg-surface p-3 overflow-y-auto`}
        >
          <nav className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              const badgeValue =
                item.badge === 'orders' ? newOrders : item.badge === 'products' ? lowStock : 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`w-full h-11 px-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-[13px] font-bold transition-colors ${
                    active
                      ? 'bg-brand-soft text-brand-ink'
                      : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-right">{item.label}</span>
                  {badgeValue > 0 && (
                    <span className="mnr-num min-w-[20px] h-5 px-1 rounded-full bg-danger text-white text-[10px] font-extrabold grid place-items-center">
                      {formatNumber(badgeValue)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-line">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink-2">
              <Store className="w-3.5 h-3.5" />
              مركز المنار للموبايل
            </p>
            <p className="text-[10px] text-ink-3 mt-1 leading-relaxed">
              هذه اللوحة تعمل بالكامل داخل متصفح جهازك. نزّل نسخة احتياطية أسبوعياً من تبويب
              الإعدادات.
            </p>
          </div>
        </aside>

        {/* المحتوى */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'delivery' && <DeliveryTab />}
          {tab === 'offers' && <OffersTab />}
          {tab === 'customers' && <CustomersTab />}
          {tab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* نوشن داخلي */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] mnr-glass border rounded-xl px-4 py-2.5 shadow-float flex items-center gap-2 text-xs font-bold animate-toast ${
            toast.tone === 'danger'
              ? 'border-danger/40 text-danger'
              : toast.tone === 'info'
                ? 'border-info/40 text-info'
                : 'border-success/40 text-success'
          }`}
        >
          {toast.tone === 'danger' ? (
            <AlertCircle className="w-4 h-4" />
          ) : toast.tone === 'info' ? (
            <Info className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
};

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * لوحة الإدارة — بوابة الدخول-outline موجودة في App.tsx،
 * فهذه المكوّن يعرض الهيكل فقط بعد نجاح المصادقة.
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AdminProvider>
      <Shell onClose={onClose} />
    </AdminProvider>
  );
};
