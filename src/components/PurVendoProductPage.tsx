import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Check, Shield, Truck, RotateCcw, Award, ChevronRight, Share2, Heart, Sparkles, Droplets } from 'lucide-react';
import { MACHINE_PRODUCT, BRIGHTWASH_SCENTS } from '../data/refillaData';
import { MachineColor, ScentOption, CartItem } from '../types';
import { SocialLinks } from './SocialLinks';
import { ProductionProcessSection } from './ProductionProcessSection';

interface PurVendoProductPageProps {
  initialColor?: MachineColor;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
}

export const PurVendoProductPage: React.FC<PurVendoProductPageProps> = ({
  initialColor = 'green',
  onAddToCart,
  onBuyNow
}) => {
  const [selectedColor, setSelectedColor] = useState<MachineColor>(initialColor);
  const [selectedFreeScent, setSelectedFreeScent] = useState<ScentOption>('lemon');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Active color object
  const currentColor = MACHINE_PRODUCT.colors.find(c => c.id === selectedColor) || MACHINE_PRODUCT.colors[0];
  
  // Active free scent object
  const currentFreeScent = BRIGHTWASH_SCENTS.find(s => s.id === selectedFreeScent) || BRIGHTWASH_SCENTS[0];

  // Gallery view state: either the machine image or the free brightwash image
  const [activeGalleryImage, setActiveGalleryImage] = useState<string>(currentColor.image);

  useEffect(() => {
    setSelectedColor(initialColor);
    const col = MACHINE_PRODUCT.colors.find(c => c.id === initialColor);
    if (col) setActiveGalleryImage(col.image);
  }, [initialColor]);

  // Sync gallery when color changes
  const handleColorChange = (colorId: MachineColor) => {
    setSelectedColor(colorId);
    const col = MACHINE_PRODUCT.colors.find(c => c.id === colorId);
    if (col) setActiveGalleryImage(col.image);
  };

  // Sync gallery when free scent changes
  const handleFreeScentChange = (scentId: ScentOption) => {
    setSelectedFreeScent(scentId);
    const sc = BRIGHTWASH_SCENTS.find(s => s.id === scentId);
    if (sc) setActiveGalleryImage(sc.image);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const createCartItem = (): CartItem => ({
    id: `machine-${selectedColor}-${selectedFreeScent}-${Date.now()}`,
    productId: 'machine',
    title: `${MACHINE_PRODUCT.name} (${currentColor.name}) + Free 15L Brightwash ${currentFreeScent.name}`,
    image: currentColor.image,
    price: MACHINE_PRODUCT.price,
    quantity,
    selectedColor,
    includedFreeScent: selectedFreeScent
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
          <span className="text-gray-900 font-bold">QuickFill Kart</span>
        </nav>

        {/* Shopee-style Product Card (Clean White & Green) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Image Gallery with Thumbnails (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center p-4 group">
              <img
                src={activeGalleryImage}
                alt="QuickFill Kart"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Mall Quality Badge */}
              <div className="absolute top-3 left-3 bg-[#1b4d2e] text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <img src="/images/quickfill-logo.jpg" alt="QuickFill" className="w-4 h-4 rounded-full object-contain bg-white" />
                <span>Refilla Official • QuickFill Kart</span>
              </div>

              {/* Free Gift Overlay Pill */}
              <div className="absolute bottom-3 left-3 bg-white/95 text-gray-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-gray-200 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes Free 15L Brightwash</span>
              </div>
            </div>

            {/* Thumbnails Row (All 5 Machine Colors + Free Brightwash Pack) */}
            <div className="grid grid-cols-6 gap-2">
              {MACHINE_PRODUCT.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleColorChange(c.id)}
                  className={`aspect-square rounded-xl p-1 bg-gray-50 border-2 overflow-hidden transition relative ${
                    activeGalleryImage === c.image
                      ? 'border-[#1b4d2e] ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-400 opacity-80'
                  }`}
                  title={c.name}
                >
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                  <span
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}

              {/* Free Brightwash Pack Thumbnail */}
              <button
                onClick={() => setActiveGalleryImage(currentFreeScent.image)}
                className={`aspect-square rounded-xl p-1 bg-emerald-50/50 border-2 overflow-hidden transition relative ${
                  activeGalleryImage === currentFreeScent.image
                    ? 'border-[#1b4d2e] ring-2 ring-emerald-600/20'
                    : 'border-emerald-200 hover:border-emerald-400'
                }`}
                title="Included Free Brightwash Powder"
              >
                <img src={currentFreeScent.image} alt="Included Free" className="w-full h-full object-contain" />
                <span className="absolute top-1 right-1 bg-emerald-700 text-white text-[8px] font-black px-1 rounded">
                  FREE
                </span>
              </button>
            </div>

            {/* Share & Wishlist Row */}
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
              <span className="text-[11px] text-gray-400 font-mono">
                Item # REF-PUR-2026
              </span>
            </div>

          </div>

          {/* RIGHT: Name, Price, Variations, Free Brightwash Box & Buy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Official Vending Equipment
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                  {MACHINE_PRODUCT.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {MACHINE_PRODUCT.tagline}
                </p>
              </div>

              {/* Price Banner with Crossed-Out Original Price */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1b4d2e]">
                  ₱{MACHINE_PRODUCT.price.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base text-gray-400 line-through font-semibold">
                  ₱{MACHINE_PRODUCT.originalPrice.toLocaleString()}
                </span>
                <span className="bg-[#1b4d2e] text-white text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                  {MACHINE_PRODUCT.discountPercent}% OFF
                </span>
                <span className="ml-auto text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200">
                  Save ₱{(MACHINE_PRODUCT.originalPrice - MACHINE_PRODUCT.price).toLocaleString()} Today
                </span>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>7 Days Return</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>COD Available</span>
                </div>
              </div>

              {/* COLOR OPTIONS: Blue and Pink */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 uppercase tracking-wide">
                    Select Machine Color:
                  </span>
                  <span className="font-bold text-[#1b4d2e]">
                    Selected: {currentColor.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MACHINE_PRODUCT.colors.map((c) => {
                    const isSelected = selectedColor === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleColorChange(c.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition duration-150 ${
                          isSelected
                            ? 'border-[#1b4d2e] bg-emerald-50/50 shadow-xs ring-2 ring-emerald-600/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{c.name}</div>
                          <span className="text-[10px] text-gray-500">{c.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* INCLUDED FREE BOX: Brightwash Powder Refill */}
              {/* Requirement: The Brightwash dishwashing powder is included free with the machine.
                  Show it in an "Included free" box with its own image, description ("Just add water, makes 15 liters")
                  and a scent selector: Lemon (yellow), Fresh Blue (blue), Calamansi (green). Selecting a scent changes the Brightwash image. */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50/50 to-emerald-100/40 border border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-emerald-700 px-2.5 py-0.5 rounded-full">
                    Included Free
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800">
                    Worth ₱399 • 100% FREE
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white rounded-xl p-1.5 border border-emerald-200 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                    <img
                      src={currentFreeScent.image}
                      alt={currentFreeScent.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      Brightwash 15L Powder Refill Pack
                    </h4>
                    <p className="text-xs text-emerald-900 font-semibold">
                      Just add water, makes 15 liters
                    </p>
                    <p className="text-[11px] text-gray-600">
                      High-foaming grease-cutting formula. Ready to pour into your Pur Vendo reservoir.
                    </p>
                  </div>
                </div>

                {/* Scent selector: Lemon (yellow), Fresh Blue (blue), Calamansi (green) */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-2">
                    Choose Your Free Scent:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {BRIGHTWASH_SCENTS.map((scent) => {
                      const isSelected = selectedFreeScent === scent.id;
                      return (
                        <button
                          key={scent.id}
                          onClick={() => handleFreeScentChange(scent.id)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-[#1b4d2e] text-white border-[#1b4d2e] shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: scent.hex }}
                          />
                          <span className="truncate w-full">{scent.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-2">
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
                  In stock • Ready for dispatch
                </span>
              </div>

              {/* Action Buttons: Add to Cart and Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
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
                  <span>Buy Now (₱{(MACHINE_PRODUCT.price * quantity).toLocaleString()})</span>
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

        {/* Technical Specifications Section */}
        {/* Requirement: Specifications: coin-operated dishwashing liquid vending machine;
            dispensing ₱5 = 200 ml, ₱8 = 400 ml, ₱15 = 600 ml, ₱20 = 1 L;
            digital counter with power switch; lockable front door with padlock;
            steel cabinet on raised legs with a bottle tray. */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Commercial Hardware
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              Pur Vendo Machine Technical Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Machine Type</span>
              <strong className="text-gray-900 text-sm">{MACHINE_PRODUCT.specifications.type}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Dispensing Volumes</span>
              <strong className="text-[#1b4d2e] text-sm">{MACHINE_PRODUCT.specifications.dispensingVolumes}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Sales Audit Display</span>
              <strong className="text-gray-900 text-sm">{MACHINE_PRODUCT.specifications.counter}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Security Lock</span>
              <strong className="text-gray-900 text-sm">{MACHINE_PRODUCT.specifications.doorLock}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Chassis &amp; Tray</span>
              <strong className="text-gray-900 text-sm">{MACHINE_PRODUCT.specifications.cabinet}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
              <span className="font-bold text-gray-500 block">Factory Warranty</span>
              <strong className="text-gray-900 text-sm">{MACHINE_PRODUCT.specifications.warranty}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 7-Step Production & Craftsmanship History */}
      <div className="mt-10">
        <ProductionProcessSection compact />
      </div>
    </div>
  );
};

