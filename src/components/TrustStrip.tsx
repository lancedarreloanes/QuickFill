import React from 'react';
import { Droplet, Coins, Truck, ShieldCheck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    {
      title: 'Refill your own bottle',
      desc: 'Bring any clean bottle or container and reduce sachet plastic waste.',
      icon: Droplet
    },
    {
      title: 'Coin-operated from ₱5',
      desc: 'Micro-dispensing calibrated for ₱5, ₱8, ₱15, and ₱20 coins.',
      icon: Coins
    },
    {
      title: 'Nationwide delivery',
      desc: 'Luzon in 1–5 days, Visayas & Mindanao in 3–7 days via wooden crate.',
      icon: Truck
    },
    {
      title: 'Secure checkout',
      desc: 'Protected payments via Card, GCash, Maya, or Cash on Delivery (COD).',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 py-9 border-b border-emerald-100/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white/90 hover:bg-white rounded-2xl p-4 border border-emerald-100 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1b4d2e] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1b4d2e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
