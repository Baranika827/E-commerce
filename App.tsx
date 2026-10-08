import React, { useState, useMemo } from 'react';
import { 
  MOCK_PRODUCTS, MOCK_USER_PROFILE, MOCK_ORDERS, 
  MOCK_TRYON_HISTORY, MOCK_WARDROBE, MOCK_SAVED_LOOKS, MOCK_NOTIFICATIONS 
} from './constants';
import { 
  Product, CartItem, ViewMode, DashboardTab, UserProfile, 
  Order, TryOnResult, WardrobeItem, SavedLook, StyleNotification, ColorOption 
} from './types';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ProductDetail } from './components/ProductDetail';
import { VirtualTryOnStudio } from './components/VirtualTryOnStudio';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { ProductComparison } from './components/ProductComparison';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { AdminDashboard } from './components/AdminDashboard';
import { AIStylistChat } from './components/AIStylistChat';
import { ImageSearchModal } from './components/ImageSearchModal';

import { Star, Camera, Heart, Search, Filter, Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Landing);
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTab>(DashboardTab.Overview);
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Application Data State
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [tryOnHistory, setTryOnHistory] = useState<TryOnResult[]>(MOCK_TRYON_HISTORY);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(MOCK_WARDROBE);
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(MOCK_SAVED_LOOKS);
  const [notifications, setNotifications] = useState<StyleNotification[]>(MOCK_NOTIFICATIONS);

  // Modals & Overlays
  const [isTryOnStudioOpen, setIsTryOnStudioOpen] = useState(false);
  const [tryOnStudioGarment, setTryOnStudioGarment] = useState<Product | null>(null);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isStylistChatOpen, setIsStylistChatOpen] = useState(false);

  // Navigation Helper
  const handleNavigate = (view: ViewMode, dashboardTab?: DashboardTab) => {
    setCurrentView(view);
    if (dashboardTab) {
      setActiveDashboardTab(dashboardTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(ViewMode.ProductDetail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Actions
  const handleAddToCart = (product: Product, size: string, color: ColorOption, quantity: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { id: `cart_${Date.now()}`, product, selectedSize: size, selectedColor: color, quantity }];
    });
    setCurrentView(ViewMode.Cart);
  };

  const handleBuyNow = (product: Product, size: string, color: ColorOption, quantity: number) => {
    handleAddToCart(product, size, color, quantity);
    setCurrentView(ViewMode.Checkout);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Launch Try-On Studio
  const handleLaunchTryOnStudio = (product?: Product) => {
    setTryOnStudioGarment(product || selectedProduct || products[0]);
    setIsTryOnStudioOpen(true);
  };

  // Filtered Products for Catalog & Search
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        wishlistCount={wishlist.length}
        onNavigate={handleNavigate}
        activeView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenImageSearch={() => setIsImageSearchOpen(true)}
        onOpenStylist={() => setIsStylistChatOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === ViewMode.Landing && (
          <LandingPage
            products={products}
            onNavigate={handleNavigate}
            onLaunchTryOn={handleLaunchTryOnStudio}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {(currentView === ViewMode.Home || currentView === ViewMode.Catalog) && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-black text-white">OmniFit Garment Collection</h1>
                <p className="text-xs text-slate-400 mt-1">Explore Virtual Try-On enabled luxury fashion engineered with size precision.</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['All', 'Outerwear', 'Dresses', 'Tailored', 'Casual'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all border ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-4 transition-all hover:shadow-2xl cursor-pointer space-y-3 flex flex-col group"
                >
                  <div 
                    className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 relative"
                    onClick={() => handleSelectProduct(p)}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.hasTryOn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchTryOnStudio(p);
                        }}
                        className="absolute bottom-3 left-3 right-3 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <Camera size={14} /> Try Virtually
                      </button>
                    )}
                  </div>

                  <div onClick={() => handleSelectProduct(p)} className="space-y-1 flex-1">
                    <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                      {p.brand}
                    </span>
                    <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={12} fill="currentColor" />
                      <span className="text-slate-300 font-bold">{p.rating}</span>
                      <span className="text-slate-500 text-[10px]">({p.reviewCount})</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                    <span className="text-base font-extrabold text-white">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === ViewMode.ProductDetail && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            userProfile={userProfile}
            isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onLaunchTryOn={handleLaunchTryOnStudio}
            onNavigateCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentView(ViewMode.Catalog);
            }}
          />
        )}

        {currentView === ViewMode.Cart && (
          <CartView
            cart={cart}
            onUpdateQuantity={(idx, q) => {
              setCart(prev => {
                const updated = [...prev];
                updated[idx].quantity = q;
                return updated;
              });
            }}
            onRemoveItem={(idx) => {
              setCart(prev => prev.filter((_, i) => i !== idx));
            }}
            onLaunchTryOn={handleLaunchTryOnStudio}
            onProceedToCheckout={() => setCurrentView(ViewMode.Checkout)}
            onContinueShopping={() => setCurrentView(ViewMode.Catalog)}
          />
        )}

        {currentView === ViewMode.Checkout && (
          <CheckoutView
            cart={cart}
            userProfile={userProfile}
            onOrderComplete={(newOrd) => {
              setOrders(prev => [newOrd, ...prev]);
              setCart([]);
            }}
            onContinueShopping={() => handleNavigate(ViewMode.Dashboard, DashboardTab.Orders)}
          />
        )}

        {currentView === ViewMode.Dashboard && (
          <UserDashboard
            initialTab={activeDashboardTab}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            products={products}
            orders={orders}
            tryOnHistory={tryOnHistory}
            wardrobe={wardrobe}
            savedLooks={savedLooks}
            wishlist={wishlist}
            notifications={notifications}
            onLaunchTryOnStudio={handleLaunchTryOnStudio}
            onAddToCart={handleAddToCart}
            onRemoveFromWishlist={(p) => setWishlist(prev => prev.filter(item => item.id !== p.id))}
            onNavigateProduct={handleSelectProduct}
            onNavigateView={setCurrentView}
          />
        )}

        {currentView === ViewMode.Compare && (
          <ProductComparison
            products={products}
            onSelectProduct={handleSelectProduct}
            onLaunchTryOn={handleLaunchTryOnStudio}
          />
        )}

        {currentView === ViewMode.Admin && (
          <AdminDashboard
            products={products}
            orders={orders}
            onBackToStore={() => setCurrentView(ViewMode.Landing)}
          />
        )}
      </main>

      {/* Virtual Try-On Studio Overlay Modal */}
      {isTryOnStudioOpen && (
        <VirtualTryOnStudio
          initialProduct={tryOnStudioGarment || selectedProduct}
          allProducts={products}
          userProfile={userProfile}
          onClose={() => setIsTryOnStudioOpen(false)}
          onSaveToWardrobe={(res) => setTryOnHistory(prev => [res, ...prev])}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* AI Stylist Assistant Floating Modal */}
      <AIStylistChat
        isOpen={isStylistChatOpen}
        onClose={() => setIsStylistChatOpen(false)}
        userProfile={userProfile}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Visual Image Search Modal */}
      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
