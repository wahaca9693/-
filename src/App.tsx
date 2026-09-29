import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem, Order } from './types/store';
import { storeStorage } from './services/storeStorage';
import { CATEGORIES_LIST } from './data/initialData';
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
import { OffersSection } from './components/OffersSection';
import { AboutContactSection } from './components/AboutContactSection';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminAuthModal } from './components/Admin/AdminAuthModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Sparkles, SlidersHorizontal, CheckCircle2, ArrowUpDown } from 'lucide-react';

export default function App() {
  // Loading Screen State
  const [isLoading, setIsLoading] = useState(true);

  // Core Data States (Synchronized via reactive subscriptions)
  const [products, setProducts] = useState<Product[]>(() => storeStorage.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => storeStorage.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storeStorage.getWishlist());
  const [offers, setOffers] = useState(() => storeStorage.getOffers());
  const [settings, setSettings] = useState(() => storeStorage.getSettings());

  // Category & Brand & Sorting Filtering
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals & Drawers Toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Created Order for Success Screen
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Toast Notification for Micro-interactions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Subscribe to storage changes
  useEffect(() => {
    const unsubProducts = storeStorage.subscribe('products-updated', (data) => {
      setProducts([...(data as Product[])]);
    });
    const unsubCart = storeStorage.subscribe('cart-updated', (data) => {
      setCart([...(data as CartItem[])]);
    });
    const unsubWishlist = storeStorage.subscribe('wishlist-updated', (data) => {
      setWishlist([...(data as string[])]);
    });
    const unsubOffers = storeStorage.subscribe('offers-updated', (data) => {
      setOffers([...(data as any[])]);
    });
    const unsubSettings = storeStorage.subscribe('settings-updated', (data) => {
      setSettings(data as any);
    });

    return () => {
      unsubProducts();
      unsubCart();
      unsubWishlist();
      unsubOffers();
      unsubSettings();
    };
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
      return matchCat && matchBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });

  // Unique Brands in catalog
  const availableBrands = ['all', 'Apple', 'Samsung', 'Anker', 'Sony', 'M.N.R'];

  // Current category metadata
  const currentCategoryInfo = CATEGORIES_LIST.find((c) => c.id === selectedCategory);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    storeStorage.addToCart(product, quantity);
    showToast(`تمت إضافة ${product.name.slice(0, 22)}... إلى السلة بنجاح ✓`);
  };

  const handleQuickBuy = (product: Product, quantity = 1) => {
    storeStorage.addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    storeStorage.updateCartQuantity(productId, quantity);
  };

  const handleRemoveFromCart = (productId: string) => {
    storeStorage.removeFromCart(productId);
  };

  const handleClearCart = () => {
    storeStorage.clearCart();
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    const isSaved = wishlist.includes(productId);
    storeStorage.toggleWishlist(productId);
    showToast(isSaved ? 'تمت إزالة المنتج من المفضلة' : 'تم حفظ المنتج في المفضلة ❤️');
  };

  // Order Submission Handler
  const handleOrderSubmitted = (orderData: {
    customerName: string;
    phone: string;
    governorate: string;
    city: string;
    district: string;
    address: string;
    nearestLandmark: string;
    notes?: string;
    paymentMethod: 'cod' | 'zaincash' | 'card';
  }): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      unitPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
    }));

    const newOrder = storeStorage.createOrder({
      customerName: orderData.customerName,
      phone: orderData.phone,
      governorate: orderData.governorate,
      city: orderData.city,
      district: orderData.district,
      address: orderData.address,
      nearestLandmark: orderData.nearestLandmark,
      notes: orderData.notes,
      items: orderItems,
      subtotal,
      deliveryFee: settings.fixedDeliveryFee || 5000,
      total: subtotal + (settings.fixedDeliveryFee || 5000),
      status: 'new',
      paymentMethod: orderData.paymentMethod,
    });

    // Clear cart & close checkout
    storeStorage.clearCart();
    setIsCheckoutOpen(false);
    setSuccessOrder(newOrder);

    return newOrder;
  };

  // Smooth Section Scroller
  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f7] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#ffd700]">
      {/* 1. Cinematic Loading Screen on initial entry */}
      {isLoading && (
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      )}

      {/* Floating Micro-interaction Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-slideDown">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#181818]/95 border border-[#d4af37]/50 text-xs sm:text-sm font-bold text-[#ffd700] shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-[#30d158]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Sticky Luxury Navbar with smart auto-hide on scroll down */}
      <Navbar
        cartCount={totalCartItemsCount}
        wishlistCount={wishlist.length}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToSection('products-catalog');
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 3. Main Content Flow - padding top offset for fixed navbar */}
      <main className="flex-1 flex flex-col w-full pt-16 sm:pt-20 pb-20 lg:pb-0">
        {/* Hero Section */}
        <Hero
          onShopNow={() => scrollToSection('products-catalog')}
          onExploreProducts={() => scrollToSection('categories')}
          onOpenTracking={() => setIsTrackingOpen(true)}
        />

        {/* Categories Bar & Live Filter (Organized Section) */}
        <section id="categories" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToSection('products-catalog');
            }}
            totalProductsCount={products.length}
          />
        </section>

        {/* Products Grid Section with Motion Transitions & Controls */}
        <section id="products-catalog" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 mb-6 pb-3 border-b border-[#222] text-right">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                {selectedCategory === 'all' ? (
                  <span>كافة المنتجات المتوفرة</span>
                ) : (
                  <span>قسم {currentCategoryInfo?.name}</span>
                )}
              </h2>
              <p className="text-xs text-[#8e8e93] mt-0.5">
                عرض {filteredProducts.length} منتج • جميع الأسعار رسمية ومفصولة بالدينار العراقي (IQD)
              </p>
            </div>

            {/* Controls: Brand Selector & Sorting Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Brand Selector */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                <span className="text-[#8e8e93] ml-1 shrink-0 text-[11px]">الماركة:</span>
                {availableBrands.map((brand) => {
                  const isSel = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#ffd700] text-[#0a0a0a]'
                          : 'bg-[#121212] hover:bg-[#1a1a1a] text-[#8e8e93] hover:text-[#f5f5f7] border border-[#2a2a2a]'
                      }`}
                    >
                      {brand === 'all' ? 'الكل' : brand}
                    </button>
                  );
                })}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-8.5 px-3 pr-7 rounded-lg bg-[#141414] border border-[#333] text-xs font-medium text-[#ffd700] focus:outline-none focus:border-[#ffd700] appearance-none cursor-pointer"
                >
                  <option value="featured">الأكثر طلباً</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
                <ArrowUpDown className="absolute top-2.5 right-2 w-3 h-3 text-[#ffd700] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Animated Products Grid with key for smooth transition */}
          <div
            key={`${selectedCategory}-${selectedBrand}-${sortBy}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-slide"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickBuy={(p) => handleQuickBuy(p, 1)}
                onToggleWishlist={handleToggleWishlist}
                onOpenDetails={setSelectedProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center text-sm text-[#99907c] bg-[#121212] rounded-3xl border border-[#d4af37]/20 space-y-3">
              <p>لا توجد منتجات مطابقة للقسم أو الماركة المحددة حالياً.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#ffd700] text-[#0a0a0a] text-xs font-bold shadow-md hover:brightness-110"
              >
                إعادة ضبط الفلتر وعرض الكل
              </button>
            </div>
          )}
        </section>

        {/* Flash Deals & Offers Banner */}
        <OffersSection
          offers={offers}
          onApplyCategoryFilter={(cat) => {
            setSelectedCategory(cat as any);
            scrollToSection('products-catalog');
          }}
        />

        {/* Maintenance & Repair Services Section (Matching uploaded poster) */}
        <MaintenanceSection
          onContactWhatsApp={() => {
            window.open('https://wa.me/9647701234567?text=مرحبا، أود الاستفسار عن صيانة هاتفي لدى مركز المنار', '_blank');
          }}
        />

        {/* About & Contact Section */}
        <AboutContactSection />
      </main>

      {/* 4. Luxury Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 5. Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={totalCartItemsCount}
        onGoHome={() => scrollToSection('hero')}
        onGoCategories={() => scrollToSection('categories')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
      />

      {/* 6. Modals & Drawers */}
      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onQuickBuy={handleQuickBuy}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        deliveryFee={settings.fixedDeliveryFee || 5000}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        wishlistIds={wishlist}
        allProducts={products}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Real-time Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* 2-Step Checkout & Order Review Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        deliveryFee={settings.fixedDeliveryFee || 5000}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleOrderSubmitted}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
        onTrackOrder={(orderNumber, phone) => {
          setSuccessOrder(null);
          setIsTrackingOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        initialOrderNumber={successOrder?.orderNumber || 'MNR-20260929-001'}
        initialPhone={successOrder?.phone || '07801234567'}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Admin 4-Digit PIN Security Keypad */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        correctPin={settings.adminPin || '1234'}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminDashboardOpen(true);
        }}
        onClose={() => setIsAdminAuthOpen(false)}
      />

      {/* Full Admin Management Suite Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}
