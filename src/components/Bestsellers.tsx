import React from 'react';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';
import { MACHINE_PRODUCT, BRIGHTWASH_SCENTS } from '../data/refillaData';
import { MachineColor, NavigationPage, ScentOption } from '../types';

interface BestsellersProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectBrightwashScent: (scent: ScentOption) => void;
  onSelectMachineColor?: (color: MachineColor) => void;
}

export const Bestsellers: React.FC<BestsellersProps> = ({
  onNavigate,
  onSelectBrightwashScent,
  onSelectMachineColor
}) => {
  return (
    <section className="py-16 sm:py-22 bg-eco-mesh border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b4d2e] bg-emerald-100/80 px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Refilla Official Catalog</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            QuickFill Kart &amp;{' '}
            <span className="text-[#1b4d2e]">Brightwash Refills</span>
          </h2>
          <p className="text-sm text-gray-600">
            Choose from 5 vibrant QuickFill Kart cabinet colors and 3 concentrated Brightwash refill scents.
          </p>
        </div>

        {/* PART 1: All 5 QuickFill Kart Color Editions */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3.5">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>1. QuickFill Kart Vending Machine Editions (5 Colors Available)</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Each QuickFill Kart includes a <strong className="text-emerald-800">FREE 15-Liter Brightwash Dishwashing Powder Pack</strong> + Padlock &amp; Bottle Tray
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4d2e] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free 15L Pack Included</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {MACHINE_PRODUCT.colors.map((colorItem, index) => (
              <div
                key={colorItem.id}
                onClick={() => {
                  if (onSelectMachineColor) onSelectMachineColor(colorItem.id);
                  onNavigate('shop-machine');
                }}
                className={`card-green-lift cursor-pointer rounded-3xl p-4 border flex flex-col justify-between group ${
                  index === 0
                    ? 'bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white/95 border-emerald-100/90'
                }`}
              >
                <div>
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-white to-emerald-50/35 rounded-2xl p-3 overflow-hidden border border-emerald-100/80 flex items-center justify-center mb-3.5 shadow-2xs">
                    <img
                      src={colorItem.image}
                      alt={`${MACHINE_PRODUCT.name} - ${colorItem.name}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    />
                    <span
                      className="absolute top-2.5 left-2.5 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs"
                      style={{ backgroundColor: colorItem.hex }}
                    >
                      {colorItem.badge}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
                      + Free 15L Pack
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: colorItem.hex }}
                    />
                    <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">
                      {colorItem.name}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1b4d2e] transition-colors mt-1 line-clamp-1">
                    QuickFill Kart – {colorItem.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    Coin-operated (₱5–₱20) steel cabinet vending machine with digital counter.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-emerald-100/80">
                  <div className="flex items-baseline justify-between mb-2.5">
                    <span className="text-lg font-black text-[#1b4d2e]">
                      ₱{MACHINE_PRODUCT.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ₱{MACHINE_PRODUCT.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-emerald-shimmer w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1b4d2e] to-emerald-700 group-hover:from-emerald-700 group-hover:to-[#143a22] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Shop {colorItem.name.split(' ')[1] || colorItem.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 2: Brightwash Concentrated Refill Packs (3 Scents) */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3.5">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>2. Brightwash Dishwashing Powder Refills (3 Scents)</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Just add water — available in 15-Liter Commercial Pack (₱299) and 3-Liter Starter Pack (₱89)
              </p>
            </div>
            <span className="inline-block text-xs font-bold text-[#1b4d2e] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              Makes up to 15 Liters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BRIGHTWASH_SCENTS.map((scent) => (
              <div
                key={scent.id}
                onClick={() => {
                  onSelectBrightwashScent(scent.id);
                  onNavigate('shop-brightwash');
                }}
                className="card-green-lift cursor-pointer bg-white rounded-3xl p-5 border border-emerald-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-white to-emerald-50/40 rounded-2xl p-4 overflow-hidden border border-emerald-100/80 flex items-center justify-center mb-4">
                    <img
                      src={scent.image}
                      alt={`Brightwash ${scent.name}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#1b4d2e] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {scent.badge}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-emerald-50/95 text-[#1b4d2e] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Makes 15L or 3L
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                    Concentrated Powder Refill
                  </span>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1b4d2e] transition-colors mt-1 line-clamp-1">
                    Brightwash – {scent.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    Just add water to make up to 15 liters of heavy-degreasing dishwashing liquid.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-100/80">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#1b4d2e]">
                        ₱299
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₱399
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      15L Pack (or ₱89 for 3L)
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 group-hover:border-[#1b4d2e] group-hover:bg-[#1b4d2e] group-hover:text-white text-[#1b4d2e] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Select Scent &amp; Size</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
