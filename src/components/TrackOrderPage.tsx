import React, { useState, useEffect } from 'react';
import { Search, PackageCheck, Truck, Check, MapPin, Calendar, Store, X, ArrowLeft, Copy, Gift, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { BRIGHTWASH_SCENTS } from '../data/refillaData';

interface TrackOrderPageProps {
  orders: Order[];
  activeOrder?: Order | null;
  onViewMyOrders?: () => void;
  onExit?: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  orders,
  activeOrder,
  onViewMyOrders,
  onExit
}) => {
  const defaultQuery = activeOrder ? activeOrder.trackingNumber : (orders[0]?.trackingNumber || 'REF-PH-982140');
  const [query, setQuery] = useState(defaultQuery);
  const [searched, setSearched] = useState(true);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Fallback sample order if none placed yet
  const [currentOrder, setCurrentOrder] = useState<Order>(
    activeOrder || orders[0] || {
      id: 'REF-PH-982140',
      trackingNumber: 'JNT-PH-74819201',
      createdAt: '2026-11-03 10:30 AM',
      region: 'Luzon',
      estimatedDeliveryDate: '1–5 business days (Estimated Nov 5 – Nov 8, 2026)',
      customer: {
        fullName: 'Maria Santos',
        phone: '0917 123 4567',
        email: 'maria.santos@gmail.com',
        region: 'Luzon',
        cityProvince: 'Quezon City, Metro Manila',
        completeAddress: 'Unit 402 Green Residences, Katipunan Ave'
      },
      items: [
        {
          id: 'sample-item',
          productId: 'machine',
          title: 'QuickFill Kart (Eco Green) + Free 15L Brightwash Lemon',
          image: '/images/machine-green-v2.jpg',
          price: 7999,
          quantity: 1,
          selectedColor: 'green',
          includedFreeScent: 'lemon'
        }
      ],
      subtotal: 7999,
      shippingFee: 250,
      total: 8249,
      paymentMethod: 'cod',
      agreedToTerms: true,
      currentStatus: 'placed',
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed',
          description: 'Order registered and payment verified.',
          timestamp: 'Nov 03, 2026 10:30 AM',
          completed: true,
          current: true
        },
        {
          status: 'packed',
          title: 'Packed & Wooden Crated',
          description: 'Item prepared in secure freight packaging with inspection seal.',
          timestamp: 'Within 24 hours',
          completed: false,
          current: false
        },
        {
          status: 'shipped',
          title: 'Shipped to Region Hub',
          description: 'Dispatched to courier hub servicing Luzon.',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Designated courier vehicle en route to delivery address.',
          timestamp: 'Pending arrival',
          completed: false,
          current: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Customer accepts machine and receives official delivery receipt.',
          timestamp: 'Nov 5 – Nov 8, 2026',
          completed: false,
          current: false
        }
      ]
    }
  );

  // Keep currentOrder synced in real time when Seller updates status in Cloud Store
  useEffect(() => {
    if (activeOrder) {
      const liveActive = orders.find(o => o.id === activeOrder.id) || activeOrder;
      setCurrentOrder(liveActive);
      setQuery(liveActive.trackingNumber);
      return;
    }
    const liveMatch = orders.find(
      o => o.id === currentOrder.id || o.trackingNumber === currentOrder.trackingNumber
    );
    if (liveMatch) {
      setCurrentOrder(liveMatch);
    }
  }, [orders, activeOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = orders.find(
      o => o.id.toLowerCase() === query.trim().toLowerCase() ||
           o.trackingNumber.toLowerCase() === query.trim().toLowerCase()
    );

    if (found) {
      setCurrentOrder(found);
    }
    setSearched(true);
  };

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-gray-50/70 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Navigation Bar with Back & X Exit Button */}
        <div className="flex items-center justify-between">
          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#1b4d2e] bg-white hover:bg-emerald-50 px-3.5 py-2 rounded-full border border-gray-200 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          ) : <div />}

          {onExit && (
            <button
              type="button"
              onClick={onExit}
              aria-label="Close Track Order and return to store"
              title="Exit Track Order"
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 shadow-2xs flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-[#1b4d2e]" />
            E-Distribution Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your Refilla order number (<span className="font-mono text-gray-700">REF-PH-...</span>) or courier tracking number to view live shipment milestones.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order # or Tracking # (e.g. REF-PH-982140)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-sm tracking-wide transition shadow-sm cursor-pointer"
            >
              Track Order
            </button>
          </form>

          {orders.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-600">Your recent orders:</span>
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setCurrentOrder(o);
                    setQuery(o.trackingNumber);
                    setSearched(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono border transition cursor-pointer ${
                    currentOrder.id === o.id
                      ? 'bg-emerald-50 text-[#1b4d2e] border-emerald-300 font-bold'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {o.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* STEP-BY-STEP TRACKING PROGRESS BAR & ORDER DETAILS */}
        {searched && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-7 animate-fadeIn relative">

            {/* Card Header with Order Info & Quick Close X */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Order Number:</span>
                  <span className="text-sm sm:text-base font-black text-gray-900 font-mono">{currentOrder.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-[#1b4d2e]">
                    {currentOrder.currentStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>Courier Tracking ID:</span>
                  <strong className="text-gray-800 font-mono">{currentOrder.trackingNumber}</strong>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedTracking ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-gray-400 block">Estimated Arrival Window:</span>
                <span className="text-xs sm:text-sm font-bold text-[#1b4d2e] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1b4d2e]" />
                  {currentOrder.estimatedDeliveryDate}
                </span>
                <span className="text-gray-500 block">
                  Destination Hub: <strong className="text-gray-800">{currentOrder.region}</strong>
                </span>
              </div>
            </div>

            {/* Step-by-Step Progress Bar */}
            <div className="relative pt-2 pb-4">
              <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                {currentOrder.timeline.map((step, idx) => {
                  const isCompleted = step.completed;
                  const isCurrent = step.current;
                  return (
                    <div key={step.status} className="flex flex-col items-center relative">
                      {/* Connecting Line */}
                      {idx < currentOrder.timeline.length - 1 && (
                        <div
                          className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-all duration-300 ${
                            currentOrder.timeline[idx + 1].completed ? 'bg-[#1b4d2e]' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Circle Dot */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-10 transition-all duration-300 shadow-xs ${
                          isCurrent
                            ? 'bg-[#1b4d2e] text-white ring-4 ring-emerald-600/20 scale-110'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Title */}
                      <span className={`text-[10px] sm:text-xs font-bold mt-2 leading-tight ${
                        isCurrent ? 'text-[#1b4d2e]' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>

                      {/* Timestamp */}
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5 max-w-[95px] truncate">
                        {step.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Active Milestone Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#1b4d2e] text-white flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold uppercase tracking-wide text-[#1b4d2e]">
                    Current Milestone: {currentOrder.timeline.find(t => t.current)?.title || 'In Transit'}
                  </span>
                  <span className="font-mono text-gray-600 font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {currentOrder.timeline.find(t => t.current)?.timestamp}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentOrder.timeline.find(t => t.current)?.description}
                </p>
              </div>
            </div>

            {/* Recipient & Ordered Items Summary inside Track Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Recipient Card */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 text-xs space-y-1.5">
                <h4 className="font-extrabold text-[11px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Delivery Recipient</span>
                </h4>
                <p className="font-bold text-gray-900">{currentOrder.customer.fullName}</p>
                <p className="text-gray-600">{currentOrder.customer.phone}</p>
                <p className="text-gray-600">
                  {currentOrder.customer.completeAddress}, {currentOrder.customer.cityProvince} ({currentOrder.customer.region})
                </p>
                <div className="pt-2 mt-2 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    Payment: <strong className="uppercase text-gray-900">{currentOrder.paymentMethod}</strong>
                  </span>
                  <strong className="text-[#1b4d2e] text-xs font-black">Total: ₱{currentOrder.total.toLocaleString()}</strong>
                </div>
              </div>

              {/* Shipment Contents Card */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 text-xs space-y-2">
                <h4 className="font-extrabold text-[11px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Shipment Contents</span>
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {currentOrder.items.map((it) => {
                    const freeScentObj = it.productId === 'machine'
                      ? (BRIGHTWASH_SCENTS.find(s => s.id === (it.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                      : null;
                    return (
                      <div key={it.id} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 truncate">{it.title} ×{it.quantity}</span>
                          <span className="font-bold text-gray-800 whitespace-nowrap">₱{(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                        {it.productId === 'machine' && freeScentObj && (
                          <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Gift className="w-3 h-3 text-emerald-700" />
                              Free 15L Brightwash ({freeScentObj.name}) ×{it.quantity}
                            </span>
                            <strong className="text-emerald-700">FREE</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Seller Status Sync Notice & Action Bar */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-500">
                <Store className="w-4 h-4 text-[#1b4d2e]" />
                <span>
                  Order status is managed directly by <strong>Refilla Official Seller</strong> and updates here in real time.
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onExit && (
                  <button
                    type="button"
                    onClick={onExit}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold transition cursor-pointer"
                  >
                    Exit to Store
                  </button>
                )}

                {onViewMyOrders && (
                  <button
                    type="button"
                    onClick={onViewMyOrders}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b4d2e] border border-emerald-200 font-bold transition cursor-pointer"
                  >
                    View All My Ordered Items →
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};


