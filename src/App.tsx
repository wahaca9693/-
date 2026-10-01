import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Product, ProductCategory, CartItem, Order } from './types/store';
import { storeStorage } from './services/storeStorage';
import { CATEGORIES_LIST, IRAQ_GOVERNORATES } from './data/initialData';
import { deliveryService } from './services/deliveryService';
import { useTheme } from './hooks/useTheme';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { MaintenanceSection } from './components/MaintenanceSection';
import { WhyUsSection } from './components/WhyUsSection';
import { OffersSection } from './components/OffersSection';
import { AboutContactSection } from './components/AboutContactSection';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SectionHeader } from './components/ui/SectionHeader';

import { CheckCircle2, LayoutGrid, PackageSearch, RotateCcw } from 'lucide-react';

type SortBy = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const BRANDS = ['all', 'Apple', 'Samsung', 'Anker', 'Sony', 'M.N.R'];

const SORTS: { value: SortBy; label: string }[] = [
  { value: 'featured', label: 'الأكثر طلباً' },
  { value: 'price-asc', label: 'السعر: من الأقل' },
  { value: 'price-desc', label: 'السعر: من الأعلى' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutGovernorate, setCheckoutGovernorate] = useState(IRAQ_GOVERNORATES[0]);

  /* ---------------------------- البيانات ---------------------------- */
  const [products, setProducts] = useState<Product[]>(() => storeStorage.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => storeStorage.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storeStorage.getWishlist());
  const [offers, setOffers] = useState(() => storeStorage.getOffers());
  const [settings, setSettings] = useState(() => storeStorage.getSettings());

  /* --------------------------- التصفية والفرز --------------------------- */
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('featured');

  /* ------------------------- النوافذ والأدراج ------------------------- */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const deliveryFee = deliveryService.quote(checkoutGovernorate, 0).fee || settings.fixedDeliveryFee || 5000;

  /* ------------------------ مزامنة التخزين ------------------------ */
  useEffect(() => {
    const unsubs = [
      storeStorage.subscribe('products-updated', (d) => setProducts([...(d as Product[])])),
      storeStorage.subscribe('cart-updated', (d) => setCart([...(d as CartItem[])])),
      storeStorage.subscribe('wishlist-updated', (d) => setWishlist([...(d as string[])])),
      storeStorage.subscribe('offers-updated', (d) => setOffers([...(d as any[])])),
      storeStorage.subscribe('settings-updated', (d) => setSettings(d as any)),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  /* --------------------------- إشعارات صغيرة --------------------------- */
  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 2400);
  }, []);

  /* ------------------------ تصفية وفرز المنتجات ------------------------ */
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
      return matchCategory && matchBrand;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [products, selectedCategory, selectedBrand, sortBy]);

  const currentCategory = CATEGORIES_LIST.find((c) => c.id === selectedCategory);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ----------------------------- المعالجات ----------------------------- */
  const addToCart = (product: Product, quantity = 1) => {
    storeStorage.addToCart(product, quantity);
    showToast(`تمت إضافة «${product.name.slice(0, 20)}» إلى السلة`);
  };

  const quickBuy = (product: Product, quantity = 1) => {
    storeStorage.addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const toggleWishlist = (productId: string) => {
    const saved = wishlist.includes(productId);
    storeStorage.toggleWishlist(productId);
    showToast(saved ? 'تمت الإزالة من المفضلة' : 'تم حفظ المنتج في المفضلة');
  };

  const submitOrder = (data: {
    customerName: string;
    phone: string;
    governorate: string;
    city: string;
    district: string;
    address: string;
    nearestLandmark: string;
    notes?: string;
    paymentMethod: 'cod';
  }): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = storeStorage.createOrder({
      ...data,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        unitPrice: item.product.price,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
      })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'new',
    });

    storeStorage.clearCart();
    setIsCheckoutOpen(false);
    setSuccessOrder(order);
    return order;
  };

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = CATEGORIES_LIST.find((c) => c.id === id);
    if (target) {
      setSelectedCategory(target.id);
    }
    document.getElementById(id === 'products' ? 'products-catalog' : id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* إشعار علوي */}
      {toast && (
        <div className="fixed top-24 left-1/2 z-[70] pointer-events-none animate-toast">
          <div className="mnr-glass flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line shadow-float text-xs sm:text-sm font-bold text-ink">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        activeCategory={selectedCategory}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onScrollToSection={scrollToSection}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 flex flex-col w-full pt-[136px] sm:pt-[148px] pb-24 lg:pb-0">
        <Hero
          onShopNow={() => document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' })}
          onOpenTracking={() => setIsTrackingOpen(true)}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
          totalProductsCount={products.length}
        />

        {/* شبكة المنتجات */}
        <section
          id="products-catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 scroll-mt-32"
        >
          <SectionHeader
            eyebrow={currentCategory ? currentCategory.name : 'المتجر'}
            eyebrowIcon={LayoutGrid}
            title={selectedCategory === 'all' ? 'كافة المنتجات المتوفرة' : `قسم ${currentCategory?.name}`}
            description={`عرض ${filteredProducts.length} منتج • جميع الأسعار الرسمية بالدينار العراقي`}
            className="mb-5"
            action={
              <div className="flex flex-wrap items-center gap-2">
                {/* الماركات */}
                <div className="flex items-center gap-1 overflow-x-auto mnr-no-scrollbar">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-2.5 h-8 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                        selectedBrand === brand
                          ? 'bg-brand text-on-brand'
                          : 'bg-surface-2 text-ink-2 border border-line hover:border-brand/40 hover:text-ink'
                      }`}
                    >
                      {brand === 'all' ? 'كل الماركات' : brand}
                    </button>
                  ))}
                </div>

                {/* الفرز */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  aria-label="ترتيب المنتجات"
                  className="mnr-field h-8 py-0 text-xs w-auto min-w-[9rem]"
                >
                  {SORTS.map((sort) => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </select>
              </div>
            }
          />

          {filteredProducts.length > 0 ? (
            <div
              key={`${selectedCategory}-${selectedBrand}-${sortBy}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-rise"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onAddToCart={(p) => addToCart(p, 1)}
                  onQuickBuy={(p) => quickBuy(p, 1)}
                  onToggleWishlist={toggleWishlist}
                  onOpenDetails={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-line bg-surface-2">
              <PackageSearch className="w-10 h-10 text-ink-3 mx-auto" />
              <p className="text-sm text-ink-2">لا توجد منتجات مطابقة للقسم أو الماركة المحددة.</p>
              <button type="button" onClick={resetFilters} className="mnr-btn mnr-btn-soft h-10 text-xs">
                <RotateCcw className="w-4 h-4" />
                إعادة ضبط الفلتر وعرض الكل
              </button>
            </div>
          )}
        </section>

        <OffersSection
          offers={offers}
          onApplyCategoryFilter={(cat) => {
            setSelectedCategory(cat as ProductCategory);
            document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <WhyUsSection />

        <MaintenanceSection
          onContactWhatsApp={() =>
            window.open(
              'https://wa.me/9647701234567?text=' +
                encodeURIComponent('مرحبا، أود الاستفسار عن صيانة هاتفي لدى مركز المنار'),
              '_blank'
            )
          }
        />

        <AboutContactSection />
      </main>

      <Footer
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <MobileBottomNav
        cartCount={cartCount}
        onGoHome={() => scrollToSection('hero')}
        onGoCategories={() => scrollToSection('categories')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
      />

      {/* النوافذ */}
      <ProductModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onQuickBuy={quickBuy}
        onToggleWishlist={toggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        deliveryFee={deliveryFee}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={storeStorage.updateCartQuantity}
        onRemoveItem={storeStorage.removeFromCart}
        onClearCart={storeStorage.clearCart}
        governorate={checkoutGovernorate}
        onSelectGovernorate={setCheckoutGovernorate}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        wishlistIds={wishlist}
        allProducts={products}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={toggleWishlist}
        onAddToCart={(p) => addToCart(p, 1)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p) => addToCart(p, 1)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        deliveryFee={deliveryFee}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={submitOrder}
      />

      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
        onTrackOrder={() => {
          setSuccessOrder(null);
          setIsTrackingOpen(true);
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        initialOrderNumber={successOrder?.orderNumber}
        initialPhone={successOrder?.phone}
        onClose={() => setIsTrackingOpen(false)}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        correctPin={settings.adminPin || '1234'}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminDashboardOpen(true);
        }}
        onClose={() => setIsAdminAuthOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}
