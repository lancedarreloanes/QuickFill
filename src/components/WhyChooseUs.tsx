import React from 'react';
import { Leaf, DollarSign, Sparkles, Truck, PhoneCall, Mail } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Eco-Friendly',
      desc: 'Eliminates thousands of single-use sachets per month. Encourages continuous household bottle reuse.',
      icon: Leaf,
      badge: 'Green Living'
    },
    {
      title: 'Affordable',
      desc: 'High-margin passive income for owners and budget-friendly ₱5 to ₱20 dishwashing soap for customers.',
      icon: DollarSign,
      badge: 'Micro-Savings'
    },
    {
      title: 'Easy to Use',
      desc: 'Zero plumbing required. Simply mix Brightwash powder with water, pour into tank, plug into 220V, and vend.',
      icon: Sparkles,
      badge: 'Plug & Play'
    },
    {
      title: 'Delivered to You',
      desc: 'Wooden-crated freight shipping delivered directly to your doorstep in Luzon, Visayas, or Mindanao.',
      icon: Truck,
      badge: 'Nationwide'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-eco-mesh border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
            The Refilla Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Why <span className="text-[#1b4d2e]">Choose Us</span>
          </h2>
          <p className="text-sm text-gray-500">
            A sustainable, dependable business solution purpose-built for the Philippines.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="card-green-lift p-7 rounded-3xl bg-white border border-emerald-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1b4d2e] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 group-hover:text-[#1b4d2e] transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* "Need Help?" Call-to-Action Box */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0e2e1b] via-[#1b4d2e] to-[#113d23] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left max-w-xl relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
              Customer Support &amp; Technical Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Need Help Choosing Your Setup?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Have questions about machine calibration, Brightwash powder mixing, or freight delivery? Our support team is ready to assist you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
            <a
              href="tel:09243730042"
              className="btn-emerald-shimmer w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300 text-xs font-black tracking-wide transition shadow-md flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>09243730042</span>
            </a>

            <a
              href="mailto:Refilla_QuickfFill.2026@gmail.com"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-900/70 hover:bg-emerald-800 text-white text-xs font-bold tracking-wide transition border border-emerald-400/40 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-emerald-300" />
              <span>Refilla_QuickfFill.2026@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
