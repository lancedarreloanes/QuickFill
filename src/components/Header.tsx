import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, LogOut, User, Store, ShieldCheck } from 'lucide-react';
import { NavigationPage, UserAccount } from '../types';
import { SocialLinks } from './SocialLinks';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSearch?: (query: string) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onRequireAuth?: () => void;
  sellerBadgeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onSearch,
  currentUser,
  onLogout,
  onRequireAuth,
  sellerBadgeCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close logout modal on Escape key
  useEffect(() => {
    if (!showLogoutConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutConfirm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const lower = searchQuery.toLowerCase();
    if (lower.includes('bright') || lower.includes('powder') || lower.includes('refill') || lower.includes('lemon') || lower.includes('calamansi')) {
      onNavigate('shop-brightwash');
    } else {
      onNavigate('shop-machine');
    }
    if (onSearch) onSearch(searchQuery);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-[0_4px_24px_-12px_rgba(27,77,46,0.12)] transition-all duration-300">
      {/* Subtle Top Eco-Green Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1b4d2e] via-emerald-500 to-[#1b4d2e]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fybelle-style 3-column header: Left Menu/Nav | Center Brand | Right Account & Cart */}
        <div className="h-20 grid grid-cols-3 items-center">
          
          {/* Left: Hamburger + Desktop Nav */}
          <div className="flex items-center gap-6">
            {currentUser?.role !== 'seller' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 rounded-xl text-gray-800 hover:text-[#1b4d2e] hover:bg-emerald-50/80 transition duration-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.75]" /> : <Menu className="w-6 h-6 stroke-[1.75]" />}
              </button>
            )}

            <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-700">
              {currentUser?.role === 'seller' ? (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onNavigate('seller-dashboard')}
                    className="px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 bg-[#1b4d2e] text-white shadow-md shadow-emerald-900/20 cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Customer &amp; Order Management Hub</span>
                    {sellerBadgeCount > 0 && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        {sellerBadgeCount} Active
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('shop-machine')}
                    className={`relative transition-all duration-200 py-1.5 border-b-2 ${
                      currentPage === 'shop-machine'
                        ? 'border-emerald-600 text-[#1b4d2e] font-bold'
                        : 'border-transparent hover:text-[#1b4d2e] hover:border-emerald-300'
                    }`}
                  >
                    Shop QuickFill Kart
                  </button>

                  <button
                    onClick={() => onNavigate('shop-brightwash')}
                    className={`relative transition-all duration-200 py-1.5 border-b-2 ${
                      currentPage === 'shop-brightwash'
                        ? 'border-emerald-600 text-[#1b4d2e] font-bold'
                        : 'border-transparent hover:text-[#1b4d2e] hover:border-emerald-300'
                    }`}
                  >
                    Brightwash Refill
                  </button>

                  <button
                    onClick={() => onNavigate('how-it-works')}
                    className={`relative transition-all duration-200 py-1.5 border-b-2 ${
                      currentPage === 'how-it-works'
                        ? 'border-emerald-600 text-[#1b4d2e] font-bold'
                        : 'border-transparent hover:text-[#1b4d2e] hover:border-emerald-300'
                    }`}
                  >
                    How It Works
                  </button>

                  <button
                    onClick={() => {
                      if (currentPage !== 'home') {
                        onNavigate('home');
                        setTimeout(() => {
                          document.getElementById('production-history')?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      } else {
                        document.getElementById('production-history')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="relative transition-all duration-200 py-1.5 border-b-2 border-transparent hover:text-[#1b4d2e] hover:border-emerald-300"
                  >
                    How It's Built
                  </button>

                  <button
                    onClick={() => onNavigate('my-orders')}
                    className={`relative transition-all duration-200 py-1.5 border-b-2 ${
                      currentPage === 'my-orders'
                        ? 'border-emerald-600 text-[#1b4d2e] font-bold'
                        : 'border-transparent hover:text-[#1b4d2e] hover:border-emerald-300'
                    }`}
                  >
                    My Orders
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Center: Fybelle-style Centered Refilla Company Brand Logo & Title */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => onNavigate(currentUser?.role === 'seller' ? 'seller-dashboard' : 'home')}
              className="flex items-center gap-3 group text-center cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-600 p-0.5 bg-white shadow-sm group-hover:scale-110 group-hover:border-emerald-500 group-hover:shadow-emerald-200/80 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/images/refilla-logo.jpg"
                  alt="Refilla Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl sm:text-2xl font-light tracking-[0.22em] uppercase text-gray-900 group-hover:text-[#1b4d2e] transition-colors font-serif leading-none">
                  REFILLA
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 mt-0.5">
                  Refill More, Waste Less
                </span>
              </div>
            </button>
          </div>

          {/* Right: Search, Socials, User Account Icon, Shopping Bag Icon */}
          <div className="flex items-center justify-end gap-2 sm:gap-3.5">
            
            {/* Expandable Search on Desktop (Customer Storefront Only) */}
            {currentUser?.role !== 'seller' && (
              searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative animate-fadeIn">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search machine, refills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    className="w-44 lg:w-52 pl-8 pr-7 py-1.5 rounded-full text-xs bg-emerald-50/50 border border-emerald-300 focus:bg-white focus:border-[#1b4d2e] outline-none transition"
                  />
                  <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:flex p-2 rounded-full text-gray-700 hover:text-[#1b4d2e] hover:bg-emerald-50 transition"
                  aria-label="Search"
                  title="Search products"
                >
                  <Search className="w-5 h-5 stroke-[1.75]" />
                </button>
              )
            )}

            {/* Social Media Links (E-MARKETING Header) */}
            <div className="hidden lg:block">
              <SocialLinks iconSize="sm" />
            </div>

            {/* User Account Icon */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full pl-2.5 pr-2 py-1 shadow-2xs">
                {currentUser.role === 'seller' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('seller-dashboard')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1b4d2e] hover:underline"
                    title="Open Seller Dashboard"
                  >
                    <Store className="w-4 h-4 text-[#1b4d2e]" />
                    <span className="hidden sm:inline">Seller</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('my-orders')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1b4d2e] hover:underline"
                    title="View My Ordered Items"
                  >
                    <User className="w-4 h-4 text-[#1b4d2e]" />
                    <span className="hidden sm:inline max-w-[85px] truncate">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </button>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    title="Sign out of Refilla"
                    className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onRequireAuth}
                className="px-3 py-1.5 rounded-full text-gray-800 hover:text-[#1b4d2e] hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition flex items-center gap-1.5"
                aria-label="Sign In or Create Account"
                title="Sign In / Create Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
                <span className="hidden sm:inline text-xs font-semibold text-gray-700">
                  Sign In
                </span>
              </button>
            )}

            {/* Cart Button with Count Badge (Customers Only — Hidden for Seller) */}
            {currentUser?.role !== 'seller' && (
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full bg-emerald-50/70 hover:bg-emerald-100 text-[#1b4d2e] border border-emerald-200/80 transition flex items-center justify-center group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1b4d2e] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm ring-2 ring-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>
        </div>

        {/* Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="py-5 border-t border-emerald-100 space-y-3 animate-fadeIn bg-gradient-to-b from-white to-emerald-50/30 rounded-b-2xl px-2">
            <form onSubmit={handleSearchSubmit} className="relative mb-3 max-w-md">
              <input
                type="text"
                placeholder="Search QuickFill Kart, Brightwash refills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white border border-emerald-200 outline-none focus:border-[#1b4d2e]"
              />
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                Home
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop-machine'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                Shop QuickFill Kart (Vending Machine)
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop-brightwash'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                Brightwash Refill Powders
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('how-it-works'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                How It Works &amp; Price Table
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentPage !== 'home') {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('production-history')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  } else {
                    document.getElementById('production-history')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                How We Build the QuickFill Kart (7 Steps)
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('faq'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#1b4d2e] transition"
              >
                FAQ
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('my-orders'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold text-[#1b4d2e] hover:bg-emerald-50 transition"
              >
                My Ordered Items
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('track-order'); }}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold text-[#1b4d2e] hover:bg-emerald-50 transition"
              >
                Track Your Order
              </button>
              {currentUser?.role === 'seller' && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate('seller-dashboard'); }}
                  className="text-left px-3 py-2 rounded-xl text-sm font-black bg-emerald-50 text-[#1b4d2e] border border-emerald-200"
                >
                  ⚡ Seller Order &amp; Chat Portal
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Official Socials:</span>
                <SocialLinks iconSize="sm" />
              </div>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">
                    Signed in as <strong>{currentUser.fullName}</strong>
                  </span>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="text-xs text-red-600 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onRequireAuth) onRequireAuth(); }}
                  className="px-4 py-2 rounded-xl bg-[#1b4d2e] text-white text-xs font-bold hover:bg-[#143a22] transition"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && currentUser && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden">
            {/* Top Header */}
            <div className="bg-gradient-to-br from-[#1b4d2e] via-[#174227] to-[#11331d] text-white px-6 pt-6 pb-5 text-center relative">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                aria-label="Cancel and close logout confirmation"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-3 shadow-md">
                <LogOut className="w-6 h-6 text-emerald-300" />
              </div>

              <h3 className="text-lg font-black tracking-tight">
                Sign Out of Refilla?
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1">
                Are you sure you want to log out of your {currentUser.role === 'seller' ? 'Official Seller' : 'Customer'} account?
              </p>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              {/* Account Card */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="w-10 h-10 rounded-full bg-[#1b4d2e] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {currentUser.role === 'seller' ? (
                    <Store className="w-5 h-5 text-emerald-300" />
                  ) : (
                    currentUser.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold text-gray-900 truncate">
                      {currentUser.fullName}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#1b4d2e]">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span>
                  Your order history, messages, and shopping bag items remain safely saved to your Refilla account when you sign back in.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-2.5 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition cursor-pointer"
                >
                  Stay Signed In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Yes, Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
