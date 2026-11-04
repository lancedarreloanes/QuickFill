import React from 'react';
import { Leaf, Recycle, HeartHandshake, Shield } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/45 to-white border-b border-emerald-100/80 overflow-hidden">
      {/* Decorative soft emerald glow circles */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-12 w-72 h-72 rounded-full bg-green-200/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Logo Brand Emblem Left (5 cols) with Animated Eco Orbit */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              {/* Rotating dashed emerald eco-ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-emerald-400/60 animate-spin-slow pointer-events-none" />
              <div className="absolute -inset-8 rounded-full border border-emerald-200/50 pointer-events-none" />

              <div className="animate-float-gentle relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white p-4 shadow-[0_20px_50px_-12px_rgba(27,77,46,0.25)] border-4 border-emerald-600 flex items-center justify-center">
                <img
                  src="/images/refilla-logo.jpg"
                  alt="Refilla Company Brand Emblem"
                  className="w-full h-full object-contain rounded-full"
                />
                <div className="absolute -bottom-3.5 bg-gradient-to-r from-[#1b4d2e] via-emerald-700 to-[#1b4d2e] text-white text-xs font-black px-5 py-1.5 rounded-full shadow-lg border border-emerald-400/40 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Refilla Eco Mission</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story Narrative Right (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>Refill More, Waste Less</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-snug">
              Rethinking How Filipino Households{' '}
              <span className="text-[#1b4d2e] underline decoration-emerald-400/60 decoration-wavy underline-offset-4">
                Clean Dishes
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Every day in the Philippines, millions of single-use plastic sachets end up in waterways, drainage systems, and landfills. At <strong className="text-[#1b4d2e]">Refilla</strong>, we set out to build a circular refill ecosystem that makes eco-friendly living both <em>cheaper</em> and <em>more convenient</em> than buying disposable plastics.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              With our flagship coin-operated <strong className="text-[#1b4d2e]">QuickFill Kart</strong> vending machine and ultra-concentrated <strong className="text-[#1b4d2e]">Brightwash</strong> powder refills, anyone can walk up to a local store with an existing water bottle or tumbler and purchase premium antibacterial dishwashing liquid starting at only <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">₱5.00</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="card-green-lift p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5">
                  <Recycle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">100% Reusable</h3>
                <p className="text-xs text-gray-500 mt-0.5">Encourages customers to reuse bottles endlessly.</p>
              </div>

              <div className="card-green-lift p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5">
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Community Micro-Savings</h3>
                <p className="text-xs text-gray-500 mt-0.5">Affordable ₱5, ₱8, ₱15, and ₱20 volumes.</p>
              </div>

              <div className="card-green-lift p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Zero Plastic Waste</h3>
                <p className="text-xs text-gray-500 mt-0.5">One machine replaces over 45,000 sachets yearly.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
