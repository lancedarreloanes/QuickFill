import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  PackageSearch
} from 'lucide-react';
import { NavigationPage, Order, OrderStatus, UserAccount } from '../types';
import { BRIGHTWASH_SCENTS } from '../data/refillaData';

interface MyOrdersPageProps {
  currentUser: UserAccount | null;
  orders: Order[];
  onTrackSpecificOrder: (order: Order) => void;
  onNavigate: (page: NavigationPage) => void;
}

const STATUS_BADGE: Record<OrderStatus, { label: string; style: string }> = {
  placed: { label: 'Order Placed', style: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  packed: { label: 'Packed & Crated', style: 'bg-blue-100 text-blue-900 border-blue-200' },
  shipped: { label: 'Shipped to Region Hub', style: 'bg-purple-100 text-purple-900 border-purple-200' },
  out_for_delivery: { label: 'Out for Delivery', style: 'bg-amber-100 text-amber-900 border-amber-200' },
  delivered: { label: 'Delivered', style: 'bg-emerald-700 text-white border-emerald-700' }
};

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  currentUser,
  orders,
  onTrackSpecificOrder,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Filter orders belonging to the logged-in customer
  const customerOrders = currentUser
    ? orders.filter(o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const filteredOrders = customerOrders.filter(o => {
    if (filter === 'active') return o.currentStatus !== 'delivered';
    if (filter === 'delivered') return o.currentStatus === 'delivered';
    return true;
  });

  return (
    <div className="py-10 bg-gray-50/70 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
              Customer Purchase History
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-[#1b4d2e]" />
              <span>My Ordered Items</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {currentUser
                ? `Showing all QuickFill Kart & Brightwash orders for ${currentUser.fullName} (${currentUser.email}).`
                : 'Sign in to view your ordered items.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filter === 'all' ? 'bg-white text-[#1b4d2e] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({customerOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filter === 'active' ? 'bg-white text-[#1b4d2e] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              In Progress ({customerOrders.filter(o => o.currentStatus !== 'delivered').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('delivered')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filter === 'delivered' ? 'bg-white text-[#1b4d2e] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Delivered ({customerOrders.filter(o => o.currentStatus === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
            <PackageSearch className="w-12 h-12 text-gray-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">No ordered items found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                You haven&apos;t placed an order in this category yet. Explore our QuickFill Kart (₱7,999 with a Free 15L Brightwash Pack) or Brightwash Refills!
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shop-machine')}
              className="px-6 py-3 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition"
            >
              <span>Shop QuickFill Kart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const badge = STATUS_BADGE[order.currentStatus] || STATUS_BADGE.placed;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden"
                >
                  {/* Order Card Top Bar */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-black text-gray-900 font-mono text-sm bg-white px-3 py-1 rounded-xl border border-gray-200">
                        Order #{order.id}
                      </span>
                      <span className="text-gray-500 font-mono">
                        Tracking: <strong className="text-gray-800">{order.trackingNumber}</strong>
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {order.createdAt}
                      </span>
                    </div>

                    <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Ordered Items List */}
                  <div className="p-6 space-y-4">
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item) => {
                        const freeScentObj = item.productId === 'machine'
                          ? (BRIGHTWASH_SCENTS.find(s => s.id === (item.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                          : null;

                        return (
                          <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-3">
                            {/* Main Ordered Item */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-20 bg-gray-50 rounded-2xl p-1.5 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span>Qty: <strong>{item.quantity}</strong></span>
                                    <span>•</span>
                                    <span>Unit Price: <strong>₱{item.price.toLocaleString()}</strong></span>
                                    {item.selectedColor && (
                                      <span className="bg-emerald-50 text-[#1b4d2e] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                                        Color: {item.selectedColor}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-base font-black text-[#1b4d2e]">
                                  ₱{(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Included Free Pack Item Card */}
                            {item.productId === 'machine' && freeScentObj && (
                              <div className="ml-0 sm:ml-20 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-14 bg-white rounded-xl p-1 border border-emerald-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <img src={freeScentObj.image} alt={freeScentObj.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                      <Gift className="w-3 h-3" />
                                      Included Free Pack
                                    </span>
                                    <div className="text-xs font-bold text-gray-900 mt-0.5">
                                      Brightwash 15L Dishwashing Powder Refill ({freeScentObj.name})
                                    </div>
                                    <div className="text-[11px] text-emerald-800">
                                      Qty: {item.quantity} Free Pack(s) • Just add water, makes 15 liters
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <span className="text-[11px] text-gray-400 line-through block">
                                    ₱{(299 * item.quantity).toLocaleString()}
                                  </span>
                                  <span className="text-xs font-black text-emerald-700">FREE (₱0)</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Seller Update Note if any */}
                    {order.sellerNote && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs flex items-start gap-2.5">
                        <Truck className="w-4 h-4 text-[#1b4d2e] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#1b4d2e]">Latest Seller / Courier Update: </span>
                          <span className="text-gray-700">{order.sellerNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Order Footer: Address, Payment, Total & Track Button */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span>
                            Deliver to: <strong>{order.customer.fullName}</strong> — {order.customer.completeAddress}, {order.customer.cityProvince} ({order.region})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span>
                            Payment: <strong className="uppercase">{order.paymentMethod}</strong>
                            {order.paymentReference ? ` (${order.paymentReference})` : ''} • Freight: ₱{order.shippingFee}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <span className="text-[11px] text-gray-400 block">Order Total</span>
                          <span className="text-lg font-black text-[#1b4d2e]">
                            ₱{order.total.toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onTrackSpecificOrder(order)}
                          className="px-5 py-2.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-emerald-300" />
                          <span>Track Delivery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

