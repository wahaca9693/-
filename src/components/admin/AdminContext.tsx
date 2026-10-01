import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Product,
  Order,
  OrderStatus,
  Customer,
  Offer,
  StoreSettings,
} from '../../types/store';
import { storeStorage } from '../../services/storeStorage';
import { deliveryService } from '../../services/deliveryService';
import type { DeliverySettings } from '../../types/store';
import { soundFX } from '../../utils/audio';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'products'
  | 'delivery'
  | 'offers'
  | 'customers'
  | 'settings';

interface AdminContextValue {
  tab: AdminTab;
  setTab: (tab: AdminTab) => void;

  products: Product[];
  orders: Order[];
  customers: Customer[];
  offers: Offer[];
  settings: StoreSettings;
  delivery: DeliverySettings;

  refreshAll: () => void;

  // منتجات
  saveProduct: (product: Product) => void;
  createProduct: (product: Omit<Product, 'id'>) => Product;
  removeProducts: (ids: string[]) => number;
  restock: (id: string, amount: number) => void;

  // طلبات
  setOrderStatus: (id: string, status: OrderStatus, note?: string) => void;

  // عروض
  createOffer: (offer: Omit<Offer, 'id'>) => void;
  removeOffer: (id: string) => void;

  // إعدادات
  saveStoreSettings: (next: StoreSettings) => void;
  saveDelivery: (next: DeliverySettings) => void;

  // إشعارات
  notify: (message: string, tone?: 'success' | 'danger' | 'info') => void;
  toast: { id: number; message: string; tone: 'success' | 'danger' | 'info' } | null;
  newOrder: Order | null;
  dismissNewOrder: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin يجب أن يُستخدم داخل AdminProvider');
  return ctx;
};

let toastId = 0;

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<AdminTab>('overview');

  const [products, setProducts] = useState<Product[]>(() => storeStorage.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storeStorage.getOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => storeStorage.getCustomers());
  const [offers, setOffers] = useState<Offer[]>(() => storeStorage.getOffers());
  const [settings, setSettings] = useState<StoreSettings>(() => storeStorage.getSettings());
  const [delivery, setDelivery] = useState<DeliverySettings>(() => deliveryService.getSettings());

  const [toast, setToast] = useState<AdminContextValue['toast']>(null);
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  /* مزامنة مع طبقة التخزين */
  useEffect(() => {
    const unsubs = [
      storeStorage.subscribe('products-updated', (d) => setProducts([...(d as Product[])])),
      storeStorage.subscribe('orders-updated', (d) => setOrders([...(d as Order[])])),
      storeStorage.subscribe('customers-updated', (d) => setCustomers([...(d as Customer[])])),
      storeStorage.subscribe('offers-updated', (d) => setOffers([...(d as Offer[])])),
      storeStorage.subscribe('settings-updated', (d) => setSettings(d as StoreSettings)),
      storeStorage.subscribe('new-order', (d) => setNewOrder(d as Order)),
      deliveryService.subscribe(setDelivery),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const refreshAll = useCallback(() => {
    setProducts(storeStorage.getProducts());
    setOrders(storeStorage.getOrders());
    setCustomers(storeStorage.getCustomers());
    setOffers(storeStorage.getOffers());
    setSettings(storeStorage.getSettings());
    setDelivery(deliveryService.getSettings());
  }, []);

  const notify = useCallback((message: string, tone: 'success' | 'danger' | 'info' = 'success') => {
    setToast({ id: ++toastId, message, tone });
    if (tone === 'success') soundFX.playClick();
    window.setTimeout(() => setToast((t) => (t && t.id === toastId ? null : t)), 2600);
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      tab,
      setTab,
      products,
      orders,
      customers,
      offers,
      settings,
      delivery,
      refreshAll,

      saveProduct: (product) => storeStorage.updateProduct(product),
      createProduct: (product) => storeStorage.addProduct(product),
      removeProducts: (ids) => storeStorage.deleteProducts(ids),
      restock: (id, amount) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        const stock = Math.max(0, product.stock + amount);
        storeStorage.updateProduct({
          ...product,
          stock,
          status: stock === 0 ? 'out_of_stock' : product.status === 'out_of_stock' ? 'in_stock' : product.status,
        });
      },

      setOrderStatus: (id, status, note) => storeStorage.updateOrderStatus(id, status, note),

      createOffer: (offer) => storeStorage.addOffer(offer),
      removeOffer: (id) => storeStorage.deleteOffer(id),

      saveStoreSettings: (next) => storeStorage.saveSettings(next),
      saveDelivery: (next) => deliveryService.saveSettings(next),

      notify,
      toast,
      newOrder,
      dismissNewOrder: () => setNewOrder(null),
    }),
    [tab, products, orders, customers, offers, settings, delivery, refreshAll, notify, toast, newOrder]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
