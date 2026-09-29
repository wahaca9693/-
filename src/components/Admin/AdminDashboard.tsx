import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus, Customer, Offer, StoreSettings, ProductCategory } from '../../types/store';
import { storeStorage } from '../../services/storeStorage';
import { soundFX } from '../../utils/audio';
import { IRAQ_GOVERNORATES, CATEGORIES_LIST } from '../../data/initialData';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Boxes,
  Tag,
  Settings,
  X,
  Bell,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Printer,
  ChevronDown,
  Volume2,
  VolumeX,
  Save,
  KeyRound,
  ExternalLink,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'inventory' | 'customers' | 'offers' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live Data States
  const [orders, setOrders] = useState<Order[]>(() => storeStorage.getOrders());
  const [products, setProducts] = useState<Product[]>(() => storeStorage.getProducts());
  const [customers, setCustomers] = useState<Customer[]>(() => storeStorage.getCustomers());
  const [offers, setOffers] = useState<Offer[]>(() => storeStorage.getOffers());
  const [settings, setSettings] = useState<StoreSettings>(() => storeStorage.getSettings());

  // Real-time toast alert for newly arrived orders
  const [latestNewOrder, setLatestNewOrder] = useState<Order | null>(null);

  // Selected Order for Full Detailed Inspection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Orders Filter and Search States
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [governorateFilter, setGovernorateFilter] = useState<string>('all');

  // Product Add / Edit Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    nameEn: '',
    brand: 'Apple',
    category: 'phones',
    price: 150000,
    oldPrice: 180000,
    discountPercent: 0,
    stock: 10,
    status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop',
    description: '',
    specs: ['مواصفة أصلية 1', 'مواصفة أصلية 2'],
    warranty: 'ضمان الوكيل الرسمي 12 شهر',
    badge: 'جديد',
  });

  // Settings Temp Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [pinChangeMessage, setPinChangeMessage] = useState('');

  // New Offer Form
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    code: 'PROMO10',
    targetCategory: 'all',
    active: true,
  });

  // Subscribe to reactive store events
  useEffect(() => {
    const unsubOrders = storeStorage.subscribe('orders-updated', (data) => {
      setOrders([...(data as Order[])]);
    });
    const unsubProducts = storeStorage.subscribe('products-updated', (data) => {
      setProducts([...(data as Product[])]);
    });
    const unsubCustomers = storeStorage.subscribe('customers-updated', (data) => {
      setCustomers([...(data as Customer[])]);
    });
    const unsubOffers = storeStorage.subscribe('offers-updated', (data) => {
      setOffers([...(data as Offer[])]);
    });
    const unsubSettings = storeStorage.subscribe('settings-updated', (data) => {
      setSettings(data as StoreSettings);
      setSettingsForm(data as StoreSettings);
    });

    const unsubNewOrder = storeStorage.subscribe('new-order', (newOrd) => {
      setLatestNewOrder(newOrd as Order);
      if (settings.audioNotifications) {
        soundFX.playOrderNotification();
      }
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubCustomers();
      unsubOffers();
      unsubSettings();
      unsubNewOrder();
    };
  }, [settings.audioNotifications]);

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const inPrepOrdersCount = orders.filter((o) => o.status === 'processing').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'cancelled').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesGov = governorateFilter === 'all' || o.governorate === governorateFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.governorate.toLowerCase().includes(q);

    return matchesStatus && matchesGov && matchesSearch;
  });

  // Handle Order Status Shift
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = storeStorage.updateOrderStatus(orderId, newStatus);
    if (updated) {
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  // Handle Product Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      storeStorage.updateProduct({
        ...editingProduct,
        ...productForm,
      } as Product);
      setEditingProduct(null);
    } else if (isAddingProduct) {
      storeStorage.addProduct({
        name: productForm.name || 'منتج جديد',
        nameEn: productForm.nameEn || 'New Product',
        brand: productForm.brand || 'Apple',
        category: (productForm.category as ProductCategory) || 'phones',
        price: Number(productForm.price) || 50000,
        oldPrice: Number(productForm.oldPrice) || 0,
        discountPercent: Number(productForm.discountPercent) || 0,
        rating: 4.8,
        reviewsCount: 1,
        stock: Number(productForm.stock) || 10,
        status: (productForm.status as any) || 'in_stock',
        image: productForm.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
        description: productForm.description || '',
        specs: productForm.specs || ['أصلي 100%'],
        warranty: productForm.warranty || 'ضمان الوكيل 12 شهر',
        badge: productForm.badge || '',
      });
      setIsAddingProduct(false);
    }
  };

  // Quick Restock
  const handleQuickRestock = (productId: string, amount: number) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      storeStorage.updateProduct({
        ...prod,
        stock: prod.stock + amount,
        status: 'in_stock',
      });
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeStorage.saveSettings(settingsForm);
    setPinChangeMessage('تم حفظ إعدادات المتجر بنجاح ✓');
    setTimeout(() => setPinChangeMessage(''), 3000);
  };

  // Add Offer
  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerForm.title) {
      storeStorage.addOffer({
        title: offerForm.title,
        description: offerForm.description || '',
        discountType: offerForm.discountType || 'percentage',
        discountValue: Number(offerForm.discountValue) || 10,
        code: offerForm.code || 'SALE',
        targetCategory: offerForm.targetCategory as any,
        active: true,
      });
      setOfferForm({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        code: '',
        targetCategory: 'all',
        active: true,
      });
    }
  };

  const statusBadge = (st: OrderStatus) => {
    const map: Record<OrderStatus, { text: string; bg: string; color: string }> = {
      new: { text: 'جديد', bg: 'bg-[#ffd700]/20', color: 'text-[#ffd700]' },
      reviewing: { text: 'قيد المراجعة', bg: 'bg-[#0071e3]/20', color: 'text-[#2997ff]' },
      confirmed: { text: 'تم التأكيد', bg: 'bg-[#bf5af2]/20', color: 'text-[#bf5af2]' },
      processing: { text: 'قيد التجهيز', bg: 'bg-[#ff9f0a]/20', color: 'text-[#ff9f0a]' },
      shipped: { text: 'خرج للتوصيل', bg: 'bg-[#64d2ff]/20', color: 'text-[#64d2ff]' },
      delivered: { text: 'تم التسليم', bg: 'bg-[#30d158]/20', color: 'text-[#30d158]' },
      cancelled: { text: 'ملغي', bg: 'bg-[#ff453a]/20', color: 'text-[#ff453a]' },
    };
    const c = map[st] || map.new;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.color} border border-current/30`}>
        {c.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-[#f5f5f7] overflow-hidden animate-fadeIn">
      {/* Top Admin Header Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#0a0a0a] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#ffd700] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#ffd700]">
                لوحة تحكم مركز المنار M.N.R
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#ffd700]/15 text-[#ffd700] text-[10px] font-bold">
                Admin Suite
              </span>
            </div>
            <span className="text-[11px] text-[#99907c]">
              إدارة المتجر، الطلبات، المخزون والتوصيل المباشر لكافة محافظات العراق
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Chime Notification Toggle */}
          <button
            onClick={() => {
              const updated = !settings.audioNotifications;
              const nextSettings = { ...settings, audioNotifications: updated };
              setSettings(nextSettings);
              setSettingsForm(nextSettings);
              storeStorage.saveSettings(nextSettings);
              if (updated) soundFX.playOrderNotification();
            }}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              settings.audioNotifications
                ? 'bg-[#1e190e] border-[#ffd700] text-[#ffd700]'
                : 'bg-[#181818] border-[#333] text-[#666]'
            }`}
            title={settings.audioNotifications ? 'صوت التنبيه مفعل' : 'صوت التنبيه صامت'}
          >
            {settings.audioNotifications ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* New Orders Count Badge */}
          {newOrdersCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-xs font-bold animate-pulse">
              <Bell className="w-4 h-4" />
              <span>طلبات جديدة: {newOrdersCount}</span>
            </div>
          )}

          {/* Exit Dashboard */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#d4af37]/30 text-xs font-bold text-[#d0c5af] hover:text-[#ffd700] transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للمتجر</span>
          </button>
        </div>
      </header>

      {/* Live Order Incoming Toast Alert */}
      {latestNewOrder && (
        <div className="bg-gradient-to-r from-[#1f190a] via-[#332a10] to-[#1f190a] border-b border-[#ffd700]/60 p-3 px-6 flex items-center justify-between animate-slideDown shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#ffd700] animate-ping" />
            <div className="text-xs">
              <span className="font-bold text-[#ffd700]">وصل طلب جديد الآن! </span>
              <span className="font-mono text-[#f5f5f7] mr-1">{latestNewOrder.orderNumber}</span>
              <span className="text-[#d0c5af] mr-2">
                — {latestNewOrder.customerName} ({latestNewOrder.governorate}) • {formatIQD(latestNewOrder.total)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedOrder(latestNewOrder);
                setActiveTab('orders');
                setLatestNewOrder(null);
              }}
              className="px-3 py-1 rounded-lg bg-[#ffd700] text-[#0a0a0a] text-xs font-black shadow-md hover:brightness-110"
            >
              معاينة الطلب
            </button>
            <button
              onClick={() => setLatestNewOrder(null)}
              className="p-1 text-[#99907c] hover:text-[#f5f5f7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-48 sm:w-56 bg-[#0a0a0a] border-l border-[#d4af37]/20 flex flex-col justify-between shrink-0 p-3 space-y-1 overflow-y-auto">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>لوحة الإحصائيات</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>إدارة الطلبات</span>
              </div>
              {newOrdersCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'orders' ? 'bg-[#0a0a0a] text-[#ffd700]' : 'bg-[#ffd700] text-[#0a0a0a]'
                  }`}
                >
                  {newOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>المنتجات ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4" />
                <span>المخزون</span>
              </div>
              {lowStockCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ff453a] text-white">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>الزبائن ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'offers'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>العروض والتخفيضات</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full h-11 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#141414] hover:text-[#ffd700]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات المتجر</span>
            </button>
          </nav>

          {/* Quick Support Footnote */}
          <div className="p-3 rounded-xl bg-[#121212] border border-[#d4af37]/20 text-[11px] text-[#99907c] space-y-1">
            <span className="font-bold text-[#ffd700] block">مركز الدعم الفني</span>
            <span>هاتف: 0770 123 4567</span>
          </div>
        </aside>

        {/* Content Body Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#070707]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2">
                  <div className="flex items-center justify-between text-[#99907c] text-xs">
                    <span>إجمالي المبيعات المحققة</span>
                    <TrendingUp className="w-4 h-4 text-[#ffd700]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#ffd700] tracking-tight">
                    {formatIQD(totalRevenue)}
                  </div>
                  <span className="text-[11px] text-[#30d158] font-semibold">
                    صافي كافة الطلبات المؤكدة
                  </span>
                </div>

                {/* New Orders */}
                <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2">
                  <div className="flex items-center justify-between text-[#99907c] text-xs">
                    <span>الطلبات الجديدة الواردة</span>
                    <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-ping" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#ffd700]">
                    {newOrdersCount}
                  </div>
                  <span className="text-[11px] text-[#d0c5af]">
                    بانتظار المراجعة والاتصال بالزبون
                  </span>
                </div>

                {/* In Processing */}
                <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2">
                  <div className="flex items-center justify-between text-[#99907c] text-xs">
                    <span>قيد التجهيز والتغليف</span>
                    <Clock className="w-4 h-4 text-[#ff9f0a]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#ff9f0a]">
                    {inPrepOrdersCount}
                  </div>
                  <span className="text-[11px] text-[#99907c]">
                    بالمستودع لفحص السيريال والشحن
                  </span>
                </div>

                {/* Delivered Orders */}
                <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-2">
                  <div className="flex items-center justify-between text-[#99907c] text-xs">
                    <span>تم التسليم بنجاح</span>
                    <CheckCircle className="w-4 h-4 text-[#30d158]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#30d158]">
                    {deliveredOrdersCount}
                  </div>
                  <span className="text-[11px] text-[#99907c]">
                    تم استلام المبلغ نقداً من الزبائن
                  </span>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#99907c]">إجمالي أصناف المنتجات:</span>
                    <span className="text-xl font-bold text-[#f5f5f7]">{products.length} صنف</span>
                  </div>
                  <Package className="w-8 h-8 text-[#d4af37] opacity-50" />
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#99907c]">منتجات منخفضة المخزون:</span>
                    <span className="text-xl font-bold text-[#ff453a]">{lowStockCount} منتج حرِج</span>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-[#ff453a] opacity-50" />
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#99907c]">طلبات ملغاة:</span>
                    <span className="text-xl font-bold text-[#99907c]">{cancelledOrdersCount} طلب</span>
                  </div>
                  <X className="w-8 h-8 text-[#666] opacity-50" />
                </div>
              </div>

              {/* Latest Incoming Orders Table Preview */}
              <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#ffd700]">
                    آخر الطلبات الواردة فوراً
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    عرض كل الطلبات ({orders.length}) ←
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-[#222] text-[#99907c]">
                        <th className="py-2.5 px-3">رقم الطلب</th>
                        <th className="py-2.5 px-3">الزبون</th>
                        <th className="py-2.5 px-3">الهاتف</th>
                        <th className="py-2.5 px-3">المحافظة</th>
                        <th className="py-2.5 px-3">الإجمالي</th>
                        <th className="py-2.5 px-3">الحالة</th>
                        <th className="py-2.5 px-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1c]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#181818]/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#ffd700]" dir="ltr">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#f5f5f7]">{ord.customerName}</td>
                          <td className="py-3 px-3 font-mono text-[#d0c5af]" dir="ltr">
                            {ord.phone}
                          </td>
                          <td className="py-3 px-3 text-[#d0c5af]">{ord.governorate}</td>
                          <td className="py-3 px-3 font-bold text-[#ffd700]">
                            {formatIQD(ord.total)}
                          </td>
                          <td className="py-3 px-3">{statusBadge(ord.status)}</td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#1e1b12] hover:bg-[#282215] border border-[#d4af37]/30 text-[#ffd700] text-[11px] font-bold"
                            >
                              معاينة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Controls: Search & Filters Bar */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="البحث برقم الطلب، اسم العميل، رقم الهاتف أو المحافظة..."
                      className="w-full h-11 px-4 pr-10 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-xs sm:text-sm text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                    />
                    <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-[#d4af37]" />
                  </div>

                  {/* Governorate Filter */}
                  <div className="w-full md:w-56">
                    <select
                      value={governorateFilter}
                      onChange={(e) => setGovernorateFilter(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-xs text-[#f5f5f7] focus:outline-none focus:border-[#ffd700] cursor-pointer"
                    >
                      <option value="all">كل المحافظات ({orders.length})</option>
                      {IRAQ_GOVERNORATES.map((gov) => {
                        const count = orders.filter((o) => o.governorate === gov).length;
                        return (
                          <option key={gov} value={gov}>
                            {gov} ({count})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {[
                    { id: 'all', label: 'كل الطلبات', count: orders.length },
                    { id: 'new', label: 'الجديدة', count: newOrdersCount },
                    { id: 'reviewing', label: 'قيد المراجعة', count: orders.filter((o) => o.status === 'reviewing').length },
                    { id: 'confirmed', label: 'تم التأكيد', count: orders.filter((o) => o.status === 'confirmed').length },
                    { id: 'processing', label: 'قيد التجهيز', count: inPrepOrdersCount },
                    { id: 'shipped', label: 'خرجت للتوصيل', count: orders.filter((o) => o.status === 'shipped').length },
                    { id: 'delivered', label: 'تم التسليم', count: deliveredOrdersCount },
                    { id: 'cancelled', label: 'الملغاة', count: cancelledOrdersCount },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                        statusFilter === tab.id
                          ? 'bg-[#ffd700] text-[#0a0a0a] shadow-sm'
                          : 'bg-[#181818] text-[#99907c] hover:text-[#f5f5f7]'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-[#222] text-[#99907c]">
                        <th className="py-3 px-3">رقم الطلب</th>
                        <th className="py-3 px-3">الزبون</th>
                        <th className="py-3 px-3">الهاتف</th>
                        <th className="py-3 px-3">المحافظة</th>
                        <th className="py-3 px-3">المنتجات</th>
                        <th className="py-3 px-3">المجموع</th>
                        <th className="py-3 px-3">الحالة</th>
                        <th className="py-3 px-3">إجراء وتفاصيل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-[#99907c]">
                            لا توجد طلبات مطابقة للفلتر المحدد
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr
                            key={ord.id}
                            className={`hover:bg-[#181818] transition-colors cursor-pointer ${
                              selectedOrder?.id === ord.id ? 'bg-[#1e190e]/80 border-r-2 border-[#ffd700]' : ''
                            }`}
                            onClick={() => setSelectedOrder(ord)}
                          >
                            <td className="py-3.5 px-3 font-mono font-bold text-[#ffd700]" dir="ltr">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-3 font-bold text-[#f5f5f7]">{ord.customerName}</td>
                            <td className="py-3.5 px-3 font-mono text-[#d0c5af]" dir="ltr">
                              {ord.phone}
                            </td>
                            <td className="py-3.5 px-3 text-[#d0c5af]">
                              {ord.governorate} - {ord.city}
                            </td>
                            <td className="py-3.5 px-3 text-[#99907c]">
                              {ord.items.length} أصناف ({ord.items.map((i) => i.productName.slice(0, 15)).join(', ')}...)
                            </td>
                            <td className="py-3.5 px-3 font-bold text-[#ffd700]">
                              {formatIQD(ord.total)}
                            </td>
                            <td className="py-3.5 px-3">{statusBadge(ord.status)}</td>
                            <td className="py-3.5 px-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(ord);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#ffd700]/15 hover:bg-[#ffd700]/30 border border-[#ffd700]/40 text-[#ffd700] text-xs font-bold"
                              >
                                فتح الطلب
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Full Detail Inspector Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                  <div
                    className="relative w-full max-w-2xl my-auto rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/40 shadow-2xl p-5 sm:p-8 text-right text-[#f5f5f7]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-bold text-[#ffd700]" dir="ltr">
                              {selectedOrder.orderNumber}
                            </span>
                            {statusBadge(selectedOrder.status)}
                          </div>
                          <span className="text-xs text-[#99907c]">
                            تاريخ ووقت الطلب: {new Date(selectedOrder.createdAt).toLocaleString('ar-IQ')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-8 h-8 rounded-lg bg-[#181818] border border-[#d4af37]/20 flex items-center justify-center text-[#99907c] hover:text-[#ffd700]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                      {/* Customer Info Box */}
                      <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/20 space-y-2.5 text-xs">
                        <span className="font-bold text-[#ffd700] block pb-1 border-b border-[#222]">
                          معلومات وبيانات العميل:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[#99907c]">الاسم: </span>
                            <span className="font-bold text-[#f5f5f7]">{selectedOrder.customerName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[#99907c]">الهاتف: </span>
                              <span className="font-mono font-bold text-[#ffd700]" dir="ltr">
                                {selectedOrder.phone}
                              </span>
                            </div>
                            <a
                              href={`tel:${selectedOrder.phone}`}
                              className="px-2 py-0.5 rounded bg-[#30d158]/20 text-[#30d158] font-bold text-[11px] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>اتصال</span>
                            </a>
                          </div>
                          <div>
                            <span className="text-[#99907c]">المحافظة: </span>
                            <span className="font-bold text-[#f5f5f7]">{selectedOrder.governorate}</span>
                          </div>
                          <div>
                            <span className="text-[#99907c]">المدينة / الحي: </span>
                            <span className="font-medium text-[#f5f5f7]">{selectedOrder.city} - {selectedOrder.district}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[#99907c]">أقرب نقطة دالة: </span>
                            <span className="font-bold text-[#ffd700]">{selectedOrder.nearestLandmark}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[#99907c]">العنوان الكامل: </span>
                            <span className="text-[#d0c5af]">{selectedOrder.address}</span>
                          </div>
                          {selectedOrder.notes && (
                            <div className="sm:col-span-2 bg-[#181818] p-2 rounded-lg">
                              <span className="text-[#99907c]">ملاحظات الزبون: </span>
                              <span className="text-[#f5f5f7]">{selectedOrder.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items in Order */}
                      <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/20 space-y-2 text-xs">
                        <span className="font-bold text-[#ffd700] block pb-1 border-b border-[#222]">
                          المنتجات المطلوبة ({selectedOrder.items.length}):
                        </span>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#1c1c1c]">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-9 h-9 rounded-lg object-cover bg-[#0a0a0a]"
                              />
                              <div>
                                <span className="font-bold text-[#f5f5f7] block">{item.productName}</span>
                                <span className="text-[10px] text-[#99907c]">
                                  {item.quantity} × {formatIQD(item.unitPrice)}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-[#ffd700]">{formatIQD(item.totalPrice)}</span>
                          </div>
                        ))}

                        <div className="pt-2 space-y-1 text-xs">
                          <div className="flex justify-between text-[#99907c]">
                            <span>مجموع قيمة المنتجات:</span>
                            <span className="font-bold text-[#f5f5f7]">{formatIQD(selectedOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-[#99907c]">
                            <span>أجور التوصيل الثابتة:</span>
                            <span className="font-bold text-[#ffd700]">{formatIQD(selectedOrder.deliveryFee)}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-[#d4af37]/20 font-bold text-sm">
                            <span className="text-[#f5f5f7]">المجموع المطلوب تحصيله:</span>
                            <span className="text-base text-[#ffd700]">{formatIQD(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Transition Control (Timeline Updater) */}
                      <div className="p-4 rounded-2xl bg-[#18150c] border border-[#d4af37]/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#ffd700]">تحديث مرحلة الطلب:</span>
                          <span className="text-[11px] text-[#99907c]">التحديث ينعكس فورياً في تتبع الزبون</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {(['new', 'reviewing', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => {
                            const isCurrent = selectedOrder.status === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleStatusChange(selectedOrder.id, st)}
                                className={`p-2 rounded-xl font-bold border transition-all text-center ${
                                  isCurrent
                                    ? 'bg-[#ffd700] text-[#0a0a0a] border-[#ffd700] shadow-md'
                                    : 'bg-[#141414] hover:bg-[#1e1b12] text-[#d0c5af] border-[#d4af37]/20 hover:border-[#ffd700]/50'
                                }`}
                              >
                                {statusBadge(st)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons: Print / Call / Close */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => window.print()}
                          className="h-11 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#d4af37]/30 text-xs font-bold text-[#f5f5f7] flex items-center justify-center gap-2"
                        >
                          <Printer className="w-4 h-4 text-[#ffd700]" />
                          <span>طباعة فاتورة / بوليصة</span>
                        </button>

                        <a
                          href={`https://wa.me/964${selectedOrder.phone.replace(/^0/, '')}?text=مرحباً ${selectedOrder.customerName}، معكم مركز المنار للموبايل M.N.R بخصوص طلبكم ${selectedOrder.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-11 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110"
                        >
                          <span>واتساب العميل</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#ffd700]">كتالوج المنتجات</h3>
                  <span className="text-xs text-[#99907c]">إضافة وتعديل الأسعار والمخزون وحالة التوفر</span>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      nameEn: '',
                      brand: 'Apple',
                      category: 'phones',
                      price: 150000,
                      oldPrice: 180000,
                      discountPercent: 0,
                      stock: 10,
                      status: 'in_stock',
                      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
                      description: '',
                      specs: ['أصلي 100%'],
                      warranty: 'ضمان الوكيل الرسمي 12 شهر',
                      badge: 'جديد',
                    });
                    setIsAddingProduct(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-[#222] text-[#99907c]">
                      <th className="py-2.5 px-3">المنتج</th>
                      <th className="py-2.5 px-3">العلامة</th>
                      <th className="py-2.5 px-3">القسم</th>
                      <th className="py-2.5 px-3">السعر (د.ع)</th>
                      <th className="py-2.5 px-3">المخزون</th>
                      <th className="py-2.5 px-3">الحالة</th>
                      <th className="py-2.5 px-3">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#181818] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#0a0a0a]"
                            />
                            <div className="max-w-[200px]">
                              <span className="font-bold text-[#f5f5f7] block truncate">{p.name}</span>
                              <span className="text-[10px] text-[#99907c] truncate block">{p.nameEn}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#ffd700]">{p.brand}</td>
                        <td className="py-3 px-3 text-[#d0c5af]">{p.category}</td>
                        <td className="py-3 px-3 font-bold text-[#ffd700]">{formatIQD(p.price)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold ${
                              p.stock <= 0 ? 'text-[#ff453a]' : p.stock <= 5 ? 'text-[#ff9f0a]' : 'text-[#30d158]'
                            }`}
                          >
                            {p.stock} قطع
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'in_stock'
                                ? 'bg-[#30d158]/20 text-[#30d158]'
                                : p.status === 'out_of_stock'
                                ? 'bg-[#ff453a]/20 text-[#ff453a]'
                                : 'bg-[#ffd700]/20 text-[#ffd700]'
                            }`}
                          >
                            {p.status === 'in_stock' ? 'متوفر' : p.status === 'out_of_stock' ? 'نفذ المخزون' : 'قريباً'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm(p);
                                setIsAddingProduct(false);
                              }}
                              className="p-1.5 rounded-lg bg-[#1a160d] text-[#ffd700] hover:bg-[#252012]"
                              title="تعديل"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف المنتج: ${p.name}؟`)) {
                                  storeStorage.deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-[#221010] text-[#ff453a] hover:bg-[#331515]"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product Add / Edit Modal Drawer */}
              {(isAddingProduct || editingProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                  <div
                    className="relative w-full max-w-xl my-auto rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/40 p-6 text-right space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                      <h4 className="text-base font-bold text-[#ffd700]">
                        {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                      </h4>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setIsAddingProduct(false);
                        }}
                        className="p-1 rounded-lg bg-[#181818] text-[#99907c]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#d0c5af] mb-1 font-semibold">اسم المنتج بالعربية:</label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">العلامة التجارية:</label>
                          <input
                            type="text"
                            value={productForm.brand || ''}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">القسم:</label>
                          <select
                            value={productForm.category || 'phones'}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                          >
                            {CATEGORIES_LIST.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">السعر بالدينار (IQD):</label>
                          <input
                            type="number"
                            required
                            value={productForm.price || ''}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] font-bold focus:outline-none focus:border-[#ffd700]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">السعر القديم (خصم):</label>
                          <input
                            type="number"
                            value={productForm.oldPrice || ''}
                            onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#99907c] focus:outline-none focus:border-[#ffd700]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">كمية المخزون:</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock || 0}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">حالة التوفر:</label>
                          <select
                            value={productForm.status || 'in_stock'}
                            onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                          >
                            <option value="in_stock">متوفر بالمستودع</option>
                            <option value="out_of_stock">نفذ المخزون</option>
                            <option value="coming_soon">قريباً</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#d0c5af] mb-1 font-semibold">شارة تميز (Badge):</label>
                          <input
                            type="text"
                            placeholder="مثال: الأكثر طلباً"
                            value={productForm.badge || ''}
                            onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] focus:outline-none focus:border-[#ffd700]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#d0c5af] mb-1 font-semibold">رابط صورة المنتج (URL):</label>
                        <input
                          type="url"
                          required
                          value={productForm.image || ''}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                        />
                      </div>

                      <div className="pt-3 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs flex items-center justify-center gap-1 shadow-md hover:brightness-110"
                        >
                          <Save className="w-4 h-4" />
                          <span>حفظ بيانات المنتج</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsAddingProduct(false);
                          }}
                          className="px-4 h-11 rounded-xl bg-[#181818] text-[#99907c] font-semibold text-xs"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-[#ffd700]" />
                    <h3 className="text-base font-bold text-[#ffd700]">مراقبة المخزون الفعلي</h3>
                  </div>
                  <span className="text-xs text-[#99907c]">يتم خصم المخزون آلياً مع كل طلب حقيقي</span>
                </div>
                <p className="text-xs text-[#d0c5af]">
                  إذا نفذ المخزون (0 قطع)؛ يتحول المنتج تلقائياً إلى حالة "نفذ المخزون" في واجهة المتجر ولا يمكن للزبون طلبه.
                </p>
              </div>

              {/* Inventory Table */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-[#222] text-[#99907c]">
                      <th className="py-2.5 px-3">المنتج</th>
                      <th className="py-2.5 px-3">السعر</th>
                      <th className="py-2.5 px-3">الكمية الحالية</th>
                      <th className="py-2.5 px-3">مستوى المخزون</th>
                      <th className="py-2.5 px-3">تزويد سريع (+Stock)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c]">
                    {products.map((p) => {
                      const isLow = p.stock <= 5;
                      const isOut = p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#181818] transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#f5f5f7] block">{p.name}</span>
                            <span className="text-[10px] text-[#d4af37]">{p.brand}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-[#ffd700]">{formatIQD(p.price)}</td>
                          <td className="py-3 px-3 font-mono font-bold text-sm">
                            <span className={isOut ? 'text-[#ff453a]' : isLow ? 'text-[#ff9f0a]' : 'text-[#30d158]'}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {isOut ? (
                              <span className="px-2 py-0.5 rounded bg-[#ff453a]/20 text-[#ff453a] font-bold text-[10px]">
                                نفاذ حرج
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded bg-[#ff9f0a]/20 text-[#ff9f0a] font-bold text-[10px]">
                                مخزون منخفض
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-[#30d158]/20 text-[#30d158] font-bold text-[10px]">
                                متوفر بشكل كافي
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickRestock(p.id, 5)}
                                className="px-2.5 py-1 rounded bg-[#1c180e] hover:bg-[#282215] border border-[#d4af37]/30 text-[#ffd700] font-bold text-[11px]"
                              >
                                +5 قطع
                              </button>
                              <button
                                onClick={() => handleQuickRestock(p.id, 10)}
                                className="px-2.5 py-1 rounded bg-[#1c180e] hover:bg-[#282215] border border-[#d4af37]/30 text-[#ffd700] font-bold text-[11px]"
                              >
                                +10 قطع
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#ffd700]">سجل العملاء والزبائن</h3>
                  <span className="text-xs text-[#99907c]">يتم تحديث إجمالي مشتريات كل عميل تلقائياً مع كل طلب</span>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#121212] border border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
                  {customers.length} زبون مسجل
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/25 overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-[#222] text-[#99907c]">
                      <th className="py-2.5 px-3">اسم الزبون</th>
                      <th className="py-2.5 px-3">الهاتف العراقي</th>
                      <th className="py-2.5 px-3">المحافظة</th>
                      <th className="py-2.5 px-3">عدد الطلبات</th>
                      <th className="py-2.5 px-3">إجمالي المشتريات</th>
                      <th className="py-2.5 px-3">آخر طلب</th>
                      <th className="py-2.5 px-3">اتصال</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#181818] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#f5f5f7]">{c.name}</td>
                        <td className="py-3 px-3 font-mono text-[#ffd700]" dir="ltr">
                          {c.phone}
                        </td>
                        <td className="py-3 px-3 text-[#d0c5af]">{c.governorate} ({c.city})</td>
                        <td className="py-3 px-3 font-bold text-[#f5f5f7]">{c.totalOrders} طلبات</td>
                        <td className="py-3 px-3 font-black text-[#ffd700]">{formatIQD(c.totalSpent)}</td>
                        <td className="py-3 px-3 text-[#99907c]">{c.lastOrderDate}</td>
                        <td className="py-3 px-3">
                          <a
                            href={`tel:${c.phone}`}
                            className="p-1.5 rounded-lg bg-[#30d158]/20 text-[#30d158] inline-flex items-center"
                            title="اتصال"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create Offer Form */}
                <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3">
                  <h4 className="text-sm font-bold text-[#ffd700]">إنشاء كود أو حملة خصم جديدة</h4>
                  <form onSubmit={handleAddOffer} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">عنوان العرض:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: خصم الصيف الحصري"
                        value={offerForm.title || ''}
                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] focus:outline-none focus:border-[#ffd700]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">كوبون الخصم (Promo Code):</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: GOLD20"
                        value={offerForm.code || ''}
                        onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] font-mono focus:outline-none focus:border-[#ffd700]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[#d0c5af] mb-1 font-semibold">نوع الخصم:</label>
                        <select
                          value={offerForm.discountType || 'percentage'}
                          onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value as any })}
                          className="w-full h-10 px-2 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7]"
                        >
                          <option value="percentage">نسبة مئوية (%)</option>
                          <option value="fixed">مبلغ ثابت (د.ع)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#d0c5af] mb-1 font-semibold">قيمة الخصم:</label>
                        <input
                          type="number"
                          required
                          value={offerForm.discountValue || ''}
                          onChange={(e) => setOfferForm({ ...offerForm, discountValue: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
                    >
                      <Plus className="w-4 h-4" />
                      <span>تفعيل العرض فوراً</span>
                    </button>
                  </form>
                </div>

                {/* Active Offers List */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-3">
                  <h4 className="text-sm font-bold text-[#ffd700]">العروض والحملات المفعلة ({offers.length})</h4>
                  <div className="space-y-2.5">
                    {offers.map((off) => (
                      <div
                        key={off.id}
                        className="p-3.5 rounded-xl bg-[#181818] border border-[#d4af37]/15 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#f5f5f7] text-sm">{off.title}</span>
                            {off.code && (
                              <span className="px-2 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-mono font-bold">
                                {off.code}
                              </span>
                            )}
                          </div>
                          <p className="text-[#99907c]">{off.description}</p>
                          <span className="text-[#30d158] font-bold">
                            قيمة الخصم: {off.discountValue} {off.discountType === 'percentage' ? '%' : 'د.ع'}
                          </span>
                        </div>

                        <button
                          onClick={() => storeStorage.deleteOffer(off.id)}
                          className="p-2 rounded-lg bg-[#221010] text-[#ff453a] hover:bg-[#331515]"
                          title="حذف العرض"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-6">
              <div className="p-5 rounded-2xl bg-[#121212] border border-[#d4af37]/25 space-y-4">
                <h3 className="text-sm font-bold text-[#ffd700]">إعدادات المتجر والتوصيل والأمان</h3>

                <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#d0c5af] mb-1 font-semibold">اسم المتجر الرسمي:</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#d0c5af] mb-1 font-semibold">شعار ووصف المتجر:</label>
                    <input
                      type="text"
                      value={settingsForm.subtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">
                        أجور التوصيل الثابتة (د.ع):
                      </label>
                      <input
                        type="number"
                        value={settingsForm.fixedDeliveryFee}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, fixedDeliveryFee: Number(e.target.value) })
                        }
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">
                        رمز PIN للدخول للإدارة (4 أرقام):
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={settingsForm.adminPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#ffd700] font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">هاتف المتجر المعتمد:</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] font-mono"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[#d0c5af] mb-1 font-semibold">رقم الواتساب:</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#181818] border border-[#d4af37]/25 text-[#f5f5f7] font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {pinChangeMessage && (
                    <p className="text-xs text-[#30d158] font-bold animate-fadeIn">
                      {pinChangeMessage}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
