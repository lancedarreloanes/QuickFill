import React, { useState, useEffect } from 'react';
import { CartItem, ChatMessage, MachineColor, NavigationPage, Order, OrderStatus, ScentOption, UserAccount } from './types';
import { MACHINE_PRODUCT, BRIGHTWASH_SCENTS } from './data/refillaData';
import { cloudStore } from './services/cloudStore';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustStrip } from './components/TrustStrip';
import { BrandStory } from './components/BrandStory';
import { Bestsellers } from './components/Bestsellers';
import { FeatureBlocks } from './components/FeatureBlocks';
import { HowItWorks } from './components/HowItWorks';
import { ProductionProcessSection } from './components/ProductionProcessSection';
import { DeliveryTable } from './components/DeliveryTable';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PurVendoProductPage } from './components/PurVendoProductPage';
import { BrightwashProductPage } from './components/BrightwashProductPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { TrackOrderPage } from './components/TrackOrderPage';
import { FAQPage } from './components/FAQPage';
import { ProcurementPage } from './components/ProcurementPage';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { SellerDashboard } from './components/SellerDashboard';
import { ChatWidget } from './components/ChatWidget';
import { MyOrdersPage } from './components/MyOrdersPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedBrightwashScent, setSelectedBrightwashScent] = useState<ScentOption>('lemon');
  const [selectedMachineColor, setSelectedMachineColor] = useState<MachineColor>('green');

  // ── AUTH STATE ───────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('refilla_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [pendingPage, setPendingPage] = useState<NavigationPage | null>(null);
  const [pendingOpenCart, setPendingOpenCart] = useState(false);
  const [authRedirectMessage, setAuthRedirectMessage] = useState<string>('');

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('refilla_cart_v3_fresh');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(item =>
        item.productId === 'machine'
          ? {
            ...item,
            price: MACHINE_PRODUCT.price,
            image: item.selectedColor === 'green' ? '/images/machine-green-v2.jpg' : item.image
          }
          : item.image === '/images/brightwash-green.jpg'
            ? { ...item, image: '/images/brightwash-green-v2.jpg' }
            : item
      );
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cloud-synced Users, Orders & Messages state
  const [users, setUsers] = useState<UserAccount[]>(() => cloudStore.getState().users);
  const [orders, setOrders] = useState<Order[]>(() => cloudStore.getState().orders);
  const [messages, setMessages] = useState<ChatMessage[]>(() => cloudStore.getState().messages);

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Subscribe to real-time Cloud Store updates
  useEffect(() => {
    const unsubscribe = cloudStore.subscribe((cloudState) => {
      setUsers(cloudState.users);
      setOrders(cloudState.orders);
      setMessages(cloudState.messages);
    });
    return unsubscribe;
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('refilla_cart_v3_fresh', JSON.stringify(cartItems));
    } catch { }
  }, [cartItems]);

  // ── BROWSER HISTORY (BACK / FORWARD BUTTON SUPPORT) ──────────────────────────
  useEffect(() => {
    // Initialize current history state so Back button returns here cleanly
    if (!window.history.state) {
      window.history.replaceState(
        {
          page: currentPage,
          showAuthGate: false,
          machineColor: selectedMachineColor,
          brightwashScent: selectedBrightwashScent
        },
        '',
        window.location.pathname
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      setIsCartOpen(false);
      if (!state) {
        setShowAuthGate(false);
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (state.machineColor) {
        setSelectedMachineColor(state.machineColor);
      }
      if (state.brightwashScent) {
        setSelectedBrightwashScent(state.brightwashScent);
      }

      if (state.showAuthGate) {
        setShowAuthGate(true);
      } else {
        setShowAuthGate(false);
        setCurrentPage(state.page || 'home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const pushBrowserHistory = (
    page: NavigationPage,
    authGate = false,
    color = selectedMachineColor,
    scent = selectedBrightwashScent
  ) => {
    const hash = authGate ? '#account' : page === 'home' ? window.location.pathname : `#${page}`;
    window.history.pushState(
      {
        page,
        showAuthGate: authGate,
        machineColor: color,
        brightwashScent: scent
      },
      '',
      hash
    );
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setShowAuthGate(false);
    setAuthRedirectMessage('');
    const targetDestination: NavigationPage =
      user.role === 'seller'
        ? 'seller-dashboard'
        : pendingPage || currentPage;

    setCurrentPage(targetDestination);
    window.history.replaceState(
      {
        page: targetDestination,
        showAuthGate: false,
        machineColor: selectedMachineColor,
        brightwashScent: selectedBrightwashScent
      },
      '',
      targetDestination === 'home' ? window.location.pathname : `#${targetDestination}`
    );
    setPendingPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pendingOpenCart && user.role !== 'seller') {
      setPendingOpenCart(false);
      setIsCartOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('refilla_current_user');
    setCurrentUser(null);
    setCurrentPage('home');
    setShowAuthGate(false);
    pushBrowserHistory('home', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pages that require the customer to sign in / sign up first
  const PROTECTED_PAGES: NavigationPage[] = [
    'shop-machine',
    'shop-brightwash',
    'my-orders',
    'checkout',
    'track-order',
    'procurement'
  ];

  const navigateTo = (page: NavigationPage) => {
    // Keep Seller strictly inside Customer & Order Management (no Checkout or Customer Order views)
    if (
      currentUser?.role === 'seller' &&
      (page === 'checkout' || page === 'my-orders' || page === 'shop-machine' || page === 'shop-brightwash')
    ) {
      setCurrentPage('seller-dashboard');
      pushBrowserHistory('seller-dashboard', false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!currentUser && PROTECTED_PAGES.includes(page)) {
      setPendingPage(page);
      setAuthRedirectMessage(
        page === 'shop-machine'
          ? 'Please sign in or create a Refilla account to view and purchase the QuickFill Kart.'
          : page === 'shop-brightwash'
            ? 'Please sign in or create a Refilla account to view and purchase Brightwash Refill packs.'
            : 'Please sign in or create a Refilla account to continue with your transaction.'
      );
      setShowAuthGate(true);
      pushBrowserHistory(currentPage, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(page);
    pushBrowserHistory(page, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCartClick = () => {
    if (currentUser?.role === 'seller') {
      navigateTo('seller-dashboard');
      return;
    }
    if (!currentUser) {
      setPendingOpenCart(true);
      setAuthRedirectMessage('Please sign in or create an account to view your shopping bag and checkout.');
      setShowAuthGate(true);
      pushBrowserHistory(currentPage, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsCartOpen(true);
  };

  // When a visitor clicks Shop, any item, Cart, or Sign In while logged out → show AuthPage
  if (!currentUser && showAuthGate) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBackToHome={() => {
          setShowAuthGate(false);
          setPendingPage(null);
          setPendingOpenCart(false);
          if (window.location.hash === '#account') {
            window.history.back();
          }
        }}
        redirectMessage={authRedirectMessage}
      />
    );
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart actions (pure immutable state update so React StrictMode never double-increments)
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item =>
        item.productId === newItem.productId &&
        item.selectedColor === newItem.selectedColor &&
        item.includedFreeScent === newItem.includedFreeScent &&
        item.selectedScent === newItem.selectedScent &&
        item.selectedSize === newItem.selectedSize
      );

      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [newItem, ...prev];
    });

    setIsCartOpen(true);
  };

  const handleBuyNow = (newItem: CartItem) => {
    handleAddToCart(newItem);
    setIsCartOpen(false);
    setCurrentPage('checkout');
    pushBrowserHistory('checkout', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateFreeScent = (id: string, scent: ScentOption) => {
    const scentObj = BRIGHTWASH_SCENTS.find(s => s.id === scent) || BRIGHTWASH_SCENTS[0];
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const colorObj = MACHINE_PRODUCT.colors.find(c => c.id === item.selectedColor) || MACHINE_PRODUCT.colors[0];
        return {
          ...item,
          includedFreeScent: scent,
          title: `${MACHINE_PRODUCT.name} (${colorObj.name}) + Free 15L Brightwash ${scentObj.name}`
        };
      })
    );
  };

  const handleAddRecommended = () => {
    const recommendedItem: CartItem = {
      id: `brightwash-calamansi-15L-${Date.now()}`,
      productId: 'brightwash',
      title: 'Brightwash Dishwashing Powder (Calamansi Fresh) – 15L Pack',
      image: '/images/brightwash-green-v2.jpg',
      price: 299,
      quantity: 1,
      selectedScent: 'calamansi',
      selectedSize: '15L'
    };
    handleAddToCart(recommendedItem);
  };

  const handleOrderPlaced = (order: Order) => {
    cloudStore.addOrder(order);
    setConfirmedOrder(order);
    setCartItems([]);
    setIsConfirmationOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, sellerNote?: string) => {
    cloudStore.updateOrderStatus(orderId, status, sellerNote);
  };

  const sellerUnreadCount = messages.filter(m => !m.readBySeller && m.senderRole === 'customer').length;
  const sellerActiveOrderCount = orders.filter(o => o.currentStatus !== 'delivered').length;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-emerald-700 selection:text-white">

      {/* 1. Header (Fybelle Beauty top white header with left menu, centered REFILLA brand, right account & bag) */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        cartCount={totalCartCount}
        onOpenCart={handleOpenCartClick}
        currentUser={currentUser}
        onLogout={handleLogout}
        sellerBadgeCount={sellerUnreadCount + sellerActiveOrderCount}
        onRequireAuth={() => {
          setAuthRedirectMessage('Sign in or create a Refilla account to shop the QuickFill Kart and manage your orders.');
          setShowAuthGate(true);
          pushBrowserHistory(currentPage, true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Announcement Bar (customer storefront only) */}
      {currentUser?.role !== 'seller' && <AnnouncementBar />}

      {/* Main Page Content Body */}
      <main className="flex-1">
        {/* SELLER ACCOUNT: Dedicated 100% Customer & Order Management Portal (No Customer Checkout / Shopping) */}
        {currentUser?.role === 'seller' ? (
          <SellerDashboard
            currentUser={currentUser}
            users={users}
            orders={orders}
            messages={messages}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendSellerMessage={(threadId, customerName, customerEmail, text, orderId) => {
              cloudStore.sendMessage({
                threadId,
                customerName,
                customerEmail,
                senderRole: 'seller',
                senderName: currentUser.fullName || 'Refilla Official Seller',
                text,
                orderId
              });
            }}
            onMarkThreadRead={(threadId) => cloudStore.markThreadRead(threadId, 'seller')}
          />
        ) : (
          <>
            {/* VIEW 1: HOME PAGE (Fybelle Beauty D2C Brand Experience) */}
            {currentPage === 'home' && (
              <>
                <HeroBanner
                  onNavigate={navigateTo}
                  onSelectMachineColor={(c) => setSelectedMachineColor(c)}
                />
                <TrustStrip />
                <BrandStory />
                <Bestsellers
                  onNavigate={navigateTo}
                  onSelectBrightwashScent={(s) => setSelectedBrightwashScent(s)}
                  onSelectMachineColor={(c) => setSelectedMachineColor(c)}
                />
                <FeatureBlocks onNavigate={navigateTo} />
                <ProductionProcessSection onNavigate={navigateTo} />
                <HowItWorks onNavigate={navigateTo} />
                <DeliveryTable />
                <WhyChooseUs />
              </>
            )}

            {/* VIEW 2: SHOP MACHINE (Pur Vendo Machine Product Page) */}
            {currentPage === 'shop-machine' && (
              <PurVendoProductPage
                initialColor={selectedMachineColor}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            )}

            {/* VIEW 3: SHOP BRIGHTWASH (Brightwash Refills Product Page) */}
            {currentPage === 'shop-brightwash' && (
              <BrightwashProductPage
                initialScent={selectedBrightwashScent}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            )}

            {/* VIEW 4: HOW IT WORKS PAGE */}
            {currentPage === 'how-it-works' && (
              <div className="py-8">
                <HowItWorks onNavigate={navigateTo} />
                <ProductionProcessSection onNavigate={navigateTo} />
                <DeliveryTable />
                <WhyChooseUs />
              </div>
            )}

            {/* VIEW 5: FAQ PAGE */}
            {currentPage === 'faq' && (
              <FAQPage />
            )}

            {/* VIEW 5B: CUSTOMER MY ORDERED ITEMS PAGE */}
            {currentPage === 'my-orders' && (
              <MyOrdersPage
                currentUser={currentUser}
                orders={orders}
                onTrackSpecificOrder={(order) => {
                  setConfirmedOrder(order);
                  navigateTo('track-order');
                }}
                onNavigate={navigateTo}
              />
            )}

            {/* VIEW 6: TRACK YOUR ORDER */}
            {currentPage === 'track-order' && (
              <TrackOrderPage
                orders={orders}
                activeOrder={confirmedOrder}
                onViewMyOrders={() => navigateTo('my-orders')}
                onExit={() => navigateTo('home')}
              />
            )}

            {/* VIEW 7: CHECKOUT PAGE (E-PAYMENT & E-CONTRACT) */}
            {currentPage === 'checkout' && (
              <CheckoutPage
                cartItems={cartItems}
                onOrderPlaced={handleOrderPlaced}
                onBackToShopping={() => navigateTo('home')}
                currentUser={currentUser}
                onUpdateFreeScent={handleUpdateFreeScent}
              />
            )}

            {/* VIEW 8: BULK & BUSINESS ORDERS (E-PROCUREMENT PLACEHOLDER) */}
            {currentPage === 'procurement' && (
              <ProcurementPage />
            )}
          </>
        )}
      </main>

      {/* Customer ↔ Seller Live Cloud Chat Widget */}
      <ChatWidget
        currentUser={currentUser}
        messages={messages}
        customerOrders={orders.filter(
          o => currentUser && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
        )}
        onSendMessage={(text, orderId) => {
          if (!currentUser) return;
          cloudStore.sendMessage({
            threadId: currentUser.email.toLowerCase(),
            customerName: currentUser.fullName,
            customerEmail: currentUser.email.toLowerCase(),
            senderRole: 'customer',
            senderName: currentUser.fullName,
            text,
            orderId
          });
        }}
        onMarkRead={() => {
          if (currentUser) {
            cloudStore.markThreadRead(currentUser.email.toLowerCase(), 'customer');
          }
        }}
        onRequireAuth={() => {
          setAuthRedirectMessage('Please sign in or create a Customer account to chat with the Refilla Seller.');
          setShowAuthGate(true);
          pushBrowserHistory(currentPage, true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Slide-in Cart Drawer (Customers only) */}
      {currentUser?.role !== 'seller' && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onAddRecommended={handleAddRecommended}
          onProceedToCheckout={() => navigateTo('checkout')}
        />
      )}

      {/* Order Confirmation Modal (Customers only) */}
      {currentUser?.role !== 'seller' && (
        <OrderConfirmationModal
          order={confirmedOrder}
          isOpen={isConfirmationOpen}
          onClose={() => {
            setIsConfirmationOpen(false);
            if (currentPage === 'checkout') {
              navigateTo('home');
            }
          }}
          onTrackOrder={() => {
            setIsConfirmationOpen(false);
            navigateTo('track-order');
          }}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
      />

    </div>
  );
}

export default App;
