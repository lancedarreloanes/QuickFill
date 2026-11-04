import React, { useState } from 'react';
import { ShoppingCart, Zap, Check, Droplets, ChevronRight, Share2, Heart, Award, Sparkles } from 'lucide-react';
import { BRIGHTWASH_SCENTS, BRIGHTWASH_VARIANTS } from '../data/refillaData';
import { ScentOption, BrightwashSize, CartItem } from '../types';
import { SocialLinks } from './SocialLinks';

interface BrightwashProductPageProps {
  initialScent?: ScentOption;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
}

export const BrightwashProductPage: React.FC<BrightwashProductPageProps> = ({
  initialScent = 'lemon',
  onAddToCart,
  onBuyNow
}) => {
  const [selectedScent, setSelectedScent] = useState<ScentOption>(initialScent);
  const [selectedSize, setSelectedSize] = useState<BrightwashSize>('15L');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const currentScent = BRIGHTWASH_SCENTS.find(s => s.id === selectedScent) || BRIGHTWASH_SCENTS[0];
  const currentVariant = BRIGHTWASH_VARIANTS.find(v => v.size === selectedSize) || BRIGHTWASH_VARIANTS[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const createCartItem = (): CartItem => ({
    id: `brightwash-${selectedScent}-${selectedSize}-${Date.now()}`,
    productId: 'brightwash',
    title: `Brightwash Dishwashing Powder (${currentScent.name}) – ${selectedSize} Pack`,
    image: currentScent.image,
    price: currentVariant.price,
    quantity,
    selectedScent,
    selectedSize
  });

  return (
    <div className="py-8 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap py-1">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-[#1b4d2e] font-bold hover:underline flex items-center gap-1 mr-1"
          >
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={() => window.history.back()} className="hover:text-emerald-800">Home</button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-bold">Brightwash Dishwashing Powder</span>
        </nav>

        {/* Product Card Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center p-6 group">
              <img
                src={currentScent.image}
                alt={`Brightwash ${currentScent.name}`}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 bg-[#1b4d2e] text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                Refilla Concentrate
              </div>

              <div className="absolute bottom-3 left-3 bg-white/95 text-gray-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-gray-200">
                Scent: <span className="text-[#1b4d2e]">{currentScent.name}</span>
              </div>
            </div>

            {/* Scent Thumbnails */}
            <div className="grid grid-cols-3 gap-2.5">
              {BRIGHTWASH_SCENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScent(s.id)}
                  className={`aspect-square rounded-xl p-1 bg-gray-50 border-2 overflow-hidden transition relative ${
                    selectedScent === s.id
                      ? 'border-[#1b4d2e] ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-400 opacity-80'
                  }`}
                  title={s.name}
                >
                  <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                  <span
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: s.hex }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#1b4d2e] transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center gap-1.5 transition ${isFavorited ? 'text-red-500' : 'hover:text-[#1b4d2e]'}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>Favorite</span>
                </button>
              </div>
              <span className="text-[11px] text-gray-400">
                100% Biodegradable
              </span>
            </div>

          </div>

          {/* RIGHT: Name, Scent & Size Selectors, Buy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Official Powder Refill
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                  Brightwash Dishwashing Powder Refill
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Just add clean tap water. Formulated for high grease-cutting, dense foam, and maximum cost savings.
                </p>
              </div>

              {/* Price display based on selected size */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1b4d2e]">
                  ₱{currentVariant.price}
                </span>
                <span className="text-sm sm:text-base text-gray-400 line-through font-semibold">
                  ₱{currentVariant.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200 ml-auto">
                  {currentVariant.yieldDescription}
                </span>
              </div>

              {/* SCENT SELECTOR: Lemon (yellow), Fresh Blue (blue), Calamansi (green) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 uppercase tracking-wide">
                    1. Select Fragrance Scent:
                  </span>
                  <span className="font-bold text-[#1b4d2e]">
                    {currentScent.name} ({currentScent.colorName})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {BRIGHTWASH_SCENTS.map((s) => {
                    const isSelected = selectedScent === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedScent(s.id)}
                        className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#1b4d2e] bg-emerald-50/60 shadow-xs ring-2 ring-emerald-600/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                          style={{ backgroundColor: s.hex }}
                        />
                        <span className="text-xs font-bold text-gray-900">{s.name}</span>
                        <span className="text-[10px] text-gray-500">{s.colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SIZE OPTIONS: 15L pack, 3L pack */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 uppercase tracking-wide">
                    2. Select Pack Size:
                  </span>
                  <span className="font-bold text-[#1b4d2e]">
                    {selectedSize === '15L' ? '15-Liter Master Pack' : '3-Liter Starter Pack'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {BRIGHTWASH_VARIANTS.map((v) => {
                    const isSelected = selectedSize === v.size;
                    return (
                      <button
                        key={v.size}
                        onClick={() => setSelectedSize(v.size)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition ${
                          isSelected
                            ? 'border-[#1b4d2e] bg-emerald-50/60 shadow-xs ring-2 ring-emerald-600/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-gray-900 uppercase">
                            {v.size} Pack
                          </span>
                          <span className="text-xs font-bold text-[#1b4d2e]">
                            ₱{v.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {v.yieldDescription}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* How to Mix Powder Note */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                  How to Mix:
                </span>
                <p className="text-[11px] text-gray-600">
                  Simply empty the powder pouch into clean tap water (15 liters for 15L pack, 3 liters for 3L pack), stir for 2–3 minutes until dissolved, and it transforms into thick dishwashing liquid.
                </p>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Ready to ship nationwide
                </span>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onAddToCart(createCartItem())}
                  className="w-full py-4 px-6 rounded-full bg-emerald-50 border-2 border-emerald-700 text-[#1b4d2e] hover:bg-emerald-100 font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-xs group"
                >
                  <ShoppingCart className="w-4 h-4 text-[#1b4d2e] group-hover:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => onBuyNow(createCartItem())}
                  className="w-full py-4 px-6 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4 fill-current text-emerald-300" />
                  <span>Buy Now (₱{(currentVariant.price * quantity).toLocaleString()})</span>
                </button>
              </div>

              {/* Social Media Links (E-MARKETING Product Page) */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Share on official channels:</span>
                <SocialLinks iconSize="sm" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

