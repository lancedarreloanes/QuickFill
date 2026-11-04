import React from 'react';
import { ArrowRight, Check, Droplets, Zap } from 'lucide-react';
import { NavigationPage } from '../types';

interface FeatureBlocksProps {
  onNavigate: (page: NavigationPage) => void;
}

export const FeatureBlocks: React.FC<FeatureBlocksProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/35 via-white to-emerald-50/35 border-b border-emerald-100/80 space-y-16 sm:space-y-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Feature Block 1: QuickFill Kart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative max-w-lg mx-auto">
              {/* Decorative Emerald Aura Behind Card */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-emerald-400/20 via-green-300/15 to-transparent blur-2xl pointer-events-none" />
              
              <div className="card-green-lift relative aspect-[4/4.5] bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xl flex items-center justify-center group">
                <img
                  src="/images/machine-green-v2.jpg"
                  alt="QuickFill Kart Commercial Build"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#1b4d2e] via-emerald-800 to-[#1b4d2e] text-white p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-lg border border-emerald-400/30">
                  <span className="font-bold">Heavy-Duty Steel Construction</span>
                  <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                    1-Year Warranty
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Commercial Dispenser Equipment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-snug">
              The QuickFill Kart: <br />
              <span className="bg-gradient-to-r from-[#1b4d2e] to-emerald-600 bg-clip-text text-transparent">
                Automated Dispensing Built to Last
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Designed by <strong className="text-[#1b4d2e]">Refilla</strong> specifically for Philippine community sari-sari stores, water refilling stations, and residential centers. The <strong className="text-[#1b4d2e]">QuickFill Kart</strong> features a multi-volume coin acceptor, a clear digital volume counter, an elevated steel cabinet on raised legs to keep containers clean, and a lockable front door with an included padlock.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium max-w-md mx-auto lg:mx-0 text-left">
              {[
                'Coin-operated micro dispensing: ₱5, ₱8, ₱15, and ₱20 coins',
                'Digital counter with illuminated power switch for real-time audit',
                'Steel cabinet with raised legs and a dedicated bottle rest tray',
                'Lockable front door secured with a heavy-duty padlock'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#1b4d2e] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop-machine')}
                className="btn-emerald-shimmer w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#1b4d2e] to-emerald-700 hover:from-emerald-700 hover:to-[#143a22] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto lg:mx-0 group"
              >
                <span>Shop QuickFill Kart (₱7,999)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Feature Block 2: Brightwash Dishwashing Powder Refills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Description */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
              <Droplets className="w-3.5 h-3.5 text-emerald-700" />
              <span>Concentrated Powder Refills</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-snug">
              Brightwash Dishwashing Powder: <br />
              <span className="bg-gradient-to-r from-[#1b4d2e] to-emerald-600 bg-clip-text text-transparent">
                Just Add Water, Makes 15 Liters
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Why pay to ship water across the country? Brightwash delivers concentrated dishwashing cleaning power in lightweight powder packs. Simply mix with tap water to create up to 15 liters of high-viscosity, rich-foaming antibacterial liquid.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium max-w-md mx-auto lg:mx-0 text-left">
              {[
                '3 Fresh Scents: Lemon (yellow), Fresh Blue (blue), and Calamansi (green)',
                'Two convenient sizes: 15-Liter Master Pack or 3-Liter Starter Pack',
                'Cuts 100% of grease effortlessly while remaining gentle on hands',
                'Included FREE with every QuickFill Kart order'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#1b4d2e] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop-brightwash')}
                className="btn-emerald-shimmer w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#1b4d2e] to-emerald-700 hover:from-emerald-700 hover:to-[#143a22] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto lg:mx-0 group"
              >
                <span>Shop Brightwash Refills (From ₱89)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative max-w-lg mx-auto">
              {/* Decorative Emerald Aura Behind Card */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tl from-emerald-400/20 via-green-300/15 to-transparent blur-2xl pointer-events-none" />

              <div className="card-green-lift relative aspect-[4/4.5] bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xl flex items-center justify-center group">
                <img
                  src="/images/brightwash-green-v2.jpg"
                  alt="Brightwash Dishwashing Powder Packs"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="animate-float-gentle absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-md border border-white">
                  1 Pack = Up to 15 Liters
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
