import React from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Plus, Droplets, Check, Gift } from 'lucide-react';
import { CartItem } from '../types';
import { BRIGHTWASH_SCENTS } from '../data/refillaData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onAddRecommended: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddRecommended,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="bg-[#1b4d2e] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <h2 className="text-base font-bold">Your Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition text-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4">
            
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">Your cart is currently empty</p>
                <p className="text-xs text-gray-400">Add a QuickFill Kart or Brightwash Refills to get started.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-2xl p-3.5 bg-white shadow-xs space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-24 bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {item.selectedColor && (
                          <span className="inline-block bg-emerald-50 text-[#1b4d2e] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.includedFreeScent && (
                          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                            Free 15L: {item.includedFreeScent}
                          </span>
                        )}
                        {item.selectedScent && (
                          <span className="inline-block bg-emerald-50 text-[#1b4d2e] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                            Scent: {item.selectedScent}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-black text-[#1b4d2e]">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-gray-400">
                            (₱{item.price.toLocaleString()} each)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 self-start transition flex-shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Included Free Pack of Brightwash when item is QuickFill Kart */}
                  {item.productId === 'machine' && (() => {
                    const freeScentObj = BRIGHTWASH_SCENTS.find(s => s.id === (item.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0];
                    return (
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                        <div className="w-11 h-14 bg-white rounded-lg p-1 border border-emerald-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={freeScentObj.image} alt={freeScentObj.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-emerald-700 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Gift className="w-2.5 h-2.5" />
                              FREE PACK INCLUDED
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                            Brightwash 15L Powder ({freeScentObj.name})
                          </p>
                          <p className="text-[10px] text-emerald-800 font-medium">
                            Qty: {item.quantity} Free Pack(s) • Just add water (Makes 15L)
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-gray-400 line-through block">₱{(299 * item.quantity).toLocaleString()}</span>
                          <span className="text-xs font-black text-emerald-700">FREE</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">Quantity</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition"
                      >
                        -
                      </button>
                      <span className="w-10 h-7 flex items-center justify-center text-xs font-bold text-gray-900 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* "Recommended for you" add-on box */}
            {/* Requirement: a "Recommended for you" add-on */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full inline-block">
                Recommended For You
              </span>

              <div className="flex items-center gap-3">
                <div className="w-14 h-16 bg-white rounded-xl p-1 border border-emerald-200 flex-shrink-0 flex items-center justify-center">
                  <img src="/images/brightwash-green-v2.jpg" alt="Brightwash Calamansi" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-gray-900 truncate">
                    Brightwash Calamansi (15L Pack)
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Extra concentrated powder refill for high volume vending.
                  </p>
                  <div className="text-xs font-black text-[#1b4d2e] mt-0.5">
                    ₱299 <span className="text-gray-400 line-through text-[10px] font-normal">₱399</span>
                  </div>
                </div>
                <button
                  onClick={onAddRecommended}
                  className="px-3 py-1.5 rounded-xl bg-[#1b4d2e] text-white text-xs font-bold hover:bg-[#143a22] transition flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-5 bg-gray-50/70 space-y-3.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                <span className="text-2xl font-black text-[#1b4d2e]">
                  ₱{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="text-[11px] text-gray-500">
                Taxes and region shipping fee calculated at checkout.
              </div>

              {/* "Checkout Securely" button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-sm tracking-wide transition shadow-md flex items-center justify-center gap-2 group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Checkout Securely</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
