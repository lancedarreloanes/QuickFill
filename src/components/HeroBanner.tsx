import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Leaf, Sparkles } from 'lucide-react';
import { MachineColor, NavigationPage } from '../types';
import { MACHINE_PRODUCT } from '../data/refillaData';

interface HeroBannerProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectMachineColor?: (color: MachineColor) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, onSelectMachineColor }) => {
  const [previewColor, setPreviewColor] = useState<MachineColor>('green');
  const activeColorObj = MACHINE_PRODUCT.colors.find(c => c.id === previewColor) || MACHINE_PRODUCT.colors[0];

  return (
    <section className="relative min-h-[600px] lg:min-h-[660px] flex items-end lg:items-center overflow-hidden bg-gradient-to-br from-[#0b2414] via-[#12351f] to-[#0f3d23] text-white">
      
      {/* Animated Floating Ambient Emerald Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-green-500/15 blur-3xl animate-float-gentle pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Atmospheric organic wave / stone texture backdrop */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 35%, rgba(74, 222, 128, 0.32) 0%, transparent 55%),
            radial-gradient(circle at 20% 80%, rgba(20, 83, 45, 0.85) 0%, transparent 60%),
            repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 18px)
          `
        }}
      />

      {/* Soft vignette gradient from bottom-left for crisp text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#081b10]/95 via-[#12351f]/65 to-transparent lg:bg-gradient-to-r lg:from-[#081b10]/95 lg:via-[#12351f]/80 lg:to-[#1b4d2e]/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-14 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Staggered Editorial Headline & Animated CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill badge above headline */}
            <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-xs shadow-sm">
              <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400/30 animate-bounce" style={{ animationDuration: '2.8s' }} />
              <span>Refill More, Waste Less • Official Refilla Store</span>
            </div>

            {/* Main Headline with Lush Emerald Gradient Highlight */}
            <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Refill More,{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-xs">
                Waste Less.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up delay-200 text-sm sm:text-base lg:text-lg text-emerald-100/90 max-w-xl leading-relaxed font-normal">
              <strong className="text-white">Refilla</strong> brings you the commercial-grade coin-operated <strong className="text-emerald-300">QuickFill Kart</strong> vending machine (now in 5 vibrant cabinet colors) and concentrated <strong className="text-emerald-300">Brightwash</strong> refills — engineered for everyday community savings and zero single-use plastic waste.
            </p>

            {/* Primary & Secondary Buttons with Shimmer & Hover Lift */}
            <div className="animate-fade-up delay-300 flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (onSelectMachineColor) onSelectMachineColor(previewColor);
                  onNavigate('shop-machine');
                }}
                className="btn-emerald-shimmer px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-[0.16em] transition-all duration-300 shadow-[0_10px_30px_-6px_rgba(16,185,129,0.55)] hover:-translate-y-0.5 flex items-center gap-3 group"
              >
                <span>SHOP QUICKFILL KART (₱7,999)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('shop-brightwash')}
                className="px-7 py-4 rounded-xl border border-emerald-300/60 bg-white/10 hover:bg-white hover:text-[#12351f] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] transition-all duration-300 backdrop-blur-xs hover:-translate-y-0.5 shadow-lg"
              >
                BRIGHTWASH REFILL
              </button>
            </div>

            {/* Key Perks Row with Green Check Pills */}
            <div className="animate-fade-up delay-400 pt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-emerald-100">
              <span className="flex items-center gap-1.5 bg-emerald-950/55 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Coin-operated from ₱5
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/55 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Free 15L Brightwash Included
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/55 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5 Cabinet Colors
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Floating 5-Color QuickFill Kart Showcase */}
          <div className="lg:col-span-5 animate-fade-up delay-200">
            <div className="animate-float-gentle relative bg-gradient-to-b from-white/15 to-emerald-950/40 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-emerald-400/30 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.55)] space-y-4">
              
              {/* Top Glowing Header inside Showcase */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/images/quickfill-logo.jpg" alt="QuickFill" className="w-6 h-6 rounded-full object-contain bg-white p-0.5 ring-2 ring-emerald-400/60" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                    QuickFill Kart • By Refilla
                  </span>
                </div>
                <span
                  className="text-[11px] font-bold text-white px-3 py-0.5 rounded-full shadow-sm border border-white/20 transition-colors duration-300"
                  style={{ backgroundColor: activeColorObj.hex }}
                >
                  {activeColorObj.name}
                </span>
              </div>

              {/* Active Machine Preview */}
              <div
                onClick={() => {
                  if (onSelectMachineColor) onSelectMachineColor(previewColor);
                  onNavigate('shop-machine');
                }}
                className="cursor-pointer group relative aspect-[4/4] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white via-white to-emerald-50/60 p-4 shadow-inner border border-emerald-200/60 flex items-center justify-center"
              >
                <img
                  key={activeColorObj.id}
                  src={activeColorObj.image}
                  alt={`QuickFill Kart ${activeColorObj.name}`}
                  className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 animate-fadeIn"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                  ₱7,999 + Free 15L Pack
                </span>
                <span className="absolute bottom-3 right-3 bg-[#1b4d2e] group-hover:bg-emerald-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md transition-colors flex items-center gap-1">
                  <span>Shop {activeColorObj.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* 5 Color Thumbnails Switcher */}
              <div>
                <p className="text-[11px] text-emerald-200/90 font-semibold mb-2 text-center">
                  Click to Preview All 5 Machine Colors:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {MACHINE_PRODUCT.colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPreviewColor(c.id)}
                      className={`p-1.5 rounded-xl bg-white/95 border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        previewColor === c.id
                          ? 'border-emerald-400 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)] ring-2 ring-emerald-300/50'
                          : 'border-transparent opacity-75 hover:opacity-100 hover:-translate-y-0.5'
                      }`}
                    >
                      <img src={c.image} alt={c.name} className="w-10 h-12 object-contain" />
                      <span className="text-[9px] font-bold text-gray-800 truncate w-full text-center">
                        {c.name.split(' ')[1] || c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
