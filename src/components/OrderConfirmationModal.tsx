import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Check, Truck, MapPin, PackageCheck, Printer, Gift, X, ShoppingBag, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { BRIGHTWASH_SCENTS } from '../data/refillaData';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onTrackOrder
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleCopyOrderId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  const paymentLabel =
    order.paymentMethod === 'gcash'
      ? 'GCash E-Wallet'
      : order.paymentMethod === 'maya'
        ? 'Maya E-Wallet'
        : order.paymentMethod === 'card'
          ? 'Debit / Credit Card'
          : 'Cash on Delivery (COD)';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/15 flex flex-col">

        {/* 1. Fixed Top Header with X Exit Button */}
        <div className="relative bg-gradient-to-br from-[#1b4d2e] via-[#174227] to-[#11331d] text-white px-6 pt-6 pb-5 text-center flex-shrink-0 border-b border-emerald-800/40">
          {/* Top-Right X Close / Exit Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order confirmation and return to store"
            title="Exit to Store"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-white text-[#1b4d2e] flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-400/25 mb-2.5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-200 px-3 py-0.5 rounded-full border border-emerald-300/25 mb-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            Official Refilla E-Receipt
          </span>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Order Successfully Placed!
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-md mx-auto mt-1">
            Thank you, <strong className="text-white">{order.customer.fullName}</strong>. Your order is registered in the Refilla fulfillment network.
          </p>

          {/* Order ID & Tracking Pills */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleCopyOrderId}
              title="Click to copy Order Number"
              className="bg-black/25 hover:bg-black/35 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="text-emerald-100/80">Order No:</span>
              <strong className="text-emerald-300 font-mono">{order.id}</strong>
              {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3 h-3 text-white/70" />}
            </button>

            <button
              type="button"
              onClick={handleCopyTracking}
              title="Click to copy Tracking Number"
              className="bg-black/25 hover:bg-black/35 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="text-emerald-100/80">Tracking No:</span>
              <strong className="text-white font-mono">{order.trackingNumber}</strong>
              {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3 h-3 text-white/70" />}
            </button>
          </div>
        </div>

        {/* 2. Scrollable Middle Body (Never overlaps header or footer) */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs bg-white">

          {/* Estimated Delivery Box */}
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1b4d2e] text-white flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-800/80 font-medium block">Region Delivery Dispatch</span>
                <strong className="text-xs sm:text-sm text-gray-900 font-extrabold">{order.region} Logistics Hub</strong>
              </div>
            </div>
            <div className="sm:text-right pl-12 sm:pl-0">
              <span className="text-[11px] text-emerald-800/80 font-medium flex items-center sm:justify-end gap-1">
                <Calendar className="w-3 h-3 text-[#1b4d2e]" />
                Estimated Arrival:
              </span>
              <strong className="text-xs sm:text-sm font-black text-[#1b4d2e]">
                {order.estimatedDeliveryDate}
              </strong>
            </div>
          </div>

          {/* Recipient & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Delivery Details */}
            <div className="border border-gray-200 rounded-2xl p-3.5 bg-gray-50/70 space-y-1.5">
              <h4 className="font-extrabold text-[11px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>Delivery Destination</span>
              </h4>
              <p className="font-bold text-gray-900">{order.customer.fullName}</p>
              <p className="text-gray-600 font-medium">{order.customer.phone}</p>
              <p className="text-gray-600 leading-relaxed">
                {order.customer.completeAddress}, {order.customer.cityProvince}
              </p>
              <p className="text-[11px] text-gray-500 pt-0.5">
                Region: <strong className="text-gray-800">{order.customer.region}</strong>
              </p>
            </div>

            {/* Payment & Verification Summary */}
            <div className="border border-gray-200 rounded-2xl p-3.5 bg-gray-50/70 space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-[11px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>Payment Details</span>
                </h4>
                <p className="font-bold text-gray-900">{paymentLabel}</p>
                {order.paymentReference && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono">
                    Ref #: <strong>{order.paymentReference}</strong>
                  </p>
                )}
                {order.paymentSenderNumber && (
                  <p className="text-[11px] text-gray-600">
                    Sender Mobile: <strong className="text-gray-800">{order.paymentSenderNumber}</strong>
                  </p>
                )}
              </div>
              <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Order Date:</span>
                <strong className="text-gray-800">{order.createdAt}</strong>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                Ordered Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700">Refilla Quality Sealed</span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((it) => {
                const freeScentObj = it.productId === 'machine'
                  ? (BRIGHTWASH_SCENTS.find(s => s.id === (it.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                  : null;
                return (
                  <div key={it.id} className="py-2.5 first:pt-1 last:pb-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={it.image}
                          alt={it.title}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 block truncate">{it.title}</span>
                          <span className="text-[11px] text-gray-500">
                            Qty: <strong>{it.quantity}</strong> × ₱{it.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <strong className="text-gray-900 font-black whitespace-nowrap">
                        ₱{(it.price * it.quantity).toLocaleString()}
                      </strong>
                    </div>

                    {it.productId === 'machine' && freeScentObj && (
                      <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200 rounded-xl px-3 py-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                          <Gift className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span>Included Free Pack: Brightwash 15L Powder ({freeScentObj.name}) ×{it.quantity}</span>
                        </div>
                        <span className="font-black text-emerald-700 whitespace-nowrap ml-2">FREE (₱0)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">₱{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Freight &amp; Crating Fee ({order.region}):</span>
                <span className="font-semibold text-gray-900">₱{order.shippingFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center font-black text-sm text-gray-900">
                <span>Total Amount ({order.paymentMethod.toUpperCase()}):</span>
                <span className="text-[#1b4d2e] text-base sm:text-lg">₱{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Fixed Sticky Footer Actions (Exit / Print / Track Order) */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gray-600" />
              <span>Continue Shopping</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Print Official Receipt"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden md:inline">Print</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onTrackOrder();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-emerald-300" />
            <span>Track Your Order</span>
          </button>
        </div>

      </div>
    </div>
  );
};

