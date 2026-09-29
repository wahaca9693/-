import { Product, Order, OrderStatus, Customer, Offer, StoreSettings, CartItem } from '../types/store';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_OFFERS, DEFAULT_SETTINGS } from '../data/initialData';
import { soundFX } from '../utils/audio';

const STORAGE_KEYS = {
  PRODUCTS: 'mnr_store_products',
  ORDERS: 'mnr_store_orders',
  CUSTOMERS: 'mnr_store_customers',
  OFFERS: 'mnr_store_offers',
  SETTINGS: 'mnr_store_settings',
  CART: 'mnr_store_cart',
  WISHLIST: 'mnr_store_wishlist',
};

class StoreStorageService {
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor() {
    this.initDefaults();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.ORDERS) {
          this.emit('orders-updated', this.getOrders());
        }
      });
    }
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  // Event Subscription
  subscribe(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data?: unknown) {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit('products-updated', products);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  updateProduct(updated: Product) {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === updated.id);
    if (idx !== -1) {
      products[idx] = updated;
      this.saveProducts(products);
    }
  }

  addProduct(newProduct: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
    };
    products.unshift(product);
    this.saveProducts(products);
    return product;
  }

  deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit('orders-updated', orders);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id || o.orderNumber === id);
  }

  // Create a brand new Order
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timelineNotes'>): Order {
    const orders = this.getOrders();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Count orders today for sequential number
    const todayOrdersCount = orders.filter((o) => o.orderNumber.includes(dateStr)).length + 1;
    const seqStr = String(todayOrdersCount).padStart(3, '0');
    const orderNumber = `MNR-${dateStr}-${seqStr}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timelineNotes: [
        {
          status: 'new',
          timestamp: now.toISOString(),
          note: 'تم تسجيل الطلب واستلام البيانات بنجاح',
        }
      ],
    };

    // 1. Decrement Stock for each item
    const products = this.getProducts();
    let productsUpdated = false;

    newOrder.items.forEach((item) => {
      const pIndex = products.findIndex((p) => p.id === item.productId);
      if (pIndex !== -1) {
        const p = products[pIndex];
        const newStock = Math.max(0, p.stock - item.quantity);
        products[pIndex] = {
          ...p,
          stock: newStock,
          status: newStock === 0 ? 'out_of_stock' : p.status,
        };
        productsUpdated = true;
      }
    });

    if (productsUpdated) {
      this.saveProducts(products);
    }

    // 2. Add or update Customer
    this.updateCustomerRecord(newOrder);

    // 3. Save Order
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // 4. Trigger audio chime & notify listeners
    const settings = this.getSettings();
    if (settings.audioNotifications) {
      soundFX.playOrderNotification();
    }
    this.emit('new-order', newOrder);

    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, customNote?: string): Order | undefined {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) return undefined;

    const order = orders[idx];
    const now = new Date().toISOString();

    const statusLabels: Record<OrderStatus, string> = {
      new: 'طلب جديد وارد الآن',
      reviewing: 'قيد التدقيق الفني والمراجعة',
      confirmed: 'تم تأكيد الطلب مع الزبون هاتفياً',
      processing: 'قيد التجهيز وفحص السيريال والتغليف في المخزن',
      shipped: 'خرج للتوصيل مع مندوب الشحن السريع',
      delivered: 'تم تسليم الشحنة للزبون وتحصيل المبلغ',
      cancelled: 'تم إلغاء الطلب',
    };

    const timelineNotes = order.timelineNotes ? [...order.timelineNotes] : [];
    timelineNotes.push({
      status: newStatus,
      timestamp: now,
      note: customNote || statusLabels[newStatus] || `تغيير الحالة إلى ${newStatus}`,
    });

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      updatedAt: now,
      timelineNotes,
    };

    orders[idx] = updatedOrder;
    this.saveOrders(orders);
    this.emit('order-status-changed', updatedOrder);
    return updatedOrder;
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }

  saveCustomers(customers: Customer[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.emit('customers-updated', customers);
  }

  private updateCustomerRecord(order: Order) {
    const customers = this.getCustomers();
    const existingIdx = customers.findIndex(
      (c) => c.phone.replace(/\s+/g, '') === order.phone.replace(/\s+/g, '')
    );

    const nowStr = new Date().toISOString().slice(0, 10);

    if (existingIdx !== -1) {
      const c = customers[existingIdx];
      customers[existingIdx] = {
        ...c,
        name: order.customerName,
        governorate: order.governorate,
        city: order.city,
        totalOrders: c.totalOrders + 1,
        totalSpent: c.totalSpent + order.total,
        lastOrderDate: nowStr,
      };
    } else {
      customers.unshift({
        id: `cust-${Date.now()}`,
        name: order.customerName,
        phone: order.phone,
        governorate: order.governorate,
        city: order.city,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: nowStr,
      });
    }

    this.saveCustomers(customers);
  }

  // --- OFFERS ---
  getOffers(): Offer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return data ? JSON.parse(data) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  }

  saveOffers(offers: Offer[]) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    this.emit('offers-updated', offers);
  }

  addOffer(newOffer: Omit<Offer, 'id'>): Offer {
    const offers = this.getOffers();
    const offer: Offer = {
      ...newOffer,
      id: `off-${Date.now()}`,
    };
    offers.unshift(offer);
    this.saveOffers(offers);
    return offer;
  }

  deleteOffer(id: string) {
    const offers = this.getOffers().filter((o) => o.id !== id);
    this.saveOffers(offers);
  }

  // --- SETTINGS ---
  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: StoreSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.emit('settings-updated', settings);
  }

  // --- CART ---
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.emit('cart-updated', cart);
  }

  addToCart(product: Product, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + quantity);
    } else {
      cart.push({ product, quantity: Math.min(product.stock, quantity) });
    }

    this.saveCart(cart);
    soundFX.playClick();
    return cart;
  }

  updateCartQuantity(productId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.product.id !== productId);
    } else {
      const item = cart.find((i) => i.product.id === productId);
      if (item) {
        item.quantity = Math.min(item.product.stock, quantity);
      }
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.saveCart(cart);
    return cart;
  }

  clearCart(): CartItem[] {
    this.saveCart([]);
    return [];
  }

  // --- WISHLIST ---
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const idx = list.indexOf(productId);
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    this.emit('wishlist-updated', list);
    soundFX.playClick();
    return list;
  }
}

export const storeStorage = new StoreStorageService();
