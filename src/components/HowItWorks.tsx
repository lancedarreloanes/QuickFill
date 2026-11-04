import React from 'react';
import { Wine, Coins, Droplets, CheckCircle } from 'lucide-react';
import { VENDO_PRICE_TABLE } from '../data/refillaData';
import { NavigationPage } from '../types';

interface HowItWorksProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '1',
      title: 'Prepare Bottle',
      desc: 'Bring your own clean bottle or container of any size.',
      icon: Wine,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      num: '2',
      title: 'Select Volume & Insert Coin',
      desc: 'Choose your desired volume and insert ₱5, ₱8, ₱15, or ₱20 coin.',
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      num: '3',
      title: 'Dispense & Collect',
      desc: 'Place bottle on tray under nozzle, dispense fresh dishwashing liquid, and cap tightly.',
      icon: Droplets,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Simple 3-Step Refilling
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How It <span className="text-[#1b4d2e]">Works</span>
          </h2>
          <p className="text-sm text-gray-500">
            Easy, fast, and 100% automated for every customer in your community.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card-green-lift bg-gradient-to-b from-emerald-50/40 to-white rounded-3xl p-8 border border-emerald-200/80 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1b4d2e] text-white text-lg font-black flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${step.color} group-hover:bg-emerald-100 transition-colors`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 group-hover:text-[#1b4d2e] transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Zero Touch Waste • Refill More, Waste Less</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Table Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0e2e1b] via-[#1b4d2e] to-[#0f3820] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/30">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Official Machine Calibration
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Vending Price &amp; Volume Table
              </h3>
              <p className="text-xs text-emerald-200">
                Calibrated precision digital volume meter for Philippine BSP peso coins.
              </p>
            </div>

            {/* Price Table Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {VENDO_PRICE_TABLE.map((row, i) => (
                <div
                  key={i}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-emerald-400/25 hover:border-emerald-300/60 rounded-2xl p-5 text-center flex flex-col justify-between space-y-3 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black mb-2">
                      Coin Insert
                    </span>
                    <div className="text-3xl font-black text-white">
                      {row.coin}
                    </div>
                  </div>

                  <div className="py-2 border-y border-white/10">
                    <span className="text-xs text-emerald-200 block">Dispensed Volume</span>
                    <strong className="text-xl font-black text-emerald-300">
                      {row.volume}
                    </strong>
                  </div>

                  <span className="text-[11px] text-emerald-100/80">
                    {row.bestFor}
                  </span>
                </div>
              ))}
            </div>

            {onNavigate && (
              <div className="text-center pt-4">
                <button
                  onClick={() => onNavigate('shop-machine')}
                  className="btn-emerald-shimmer px-7 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg"
                >
                  Order Calibrated QuickFill Kart (₱7,999)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
