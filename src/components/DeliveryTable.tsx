import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import { DELIVERY_TIMES_TABLE } from '../data/refillaData';

export const DeliveryTable: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/40 to-white border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Logistics &amp; Fulfillment
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Nationwide <span className="text-[#1b4d2e]">Delivery Times</span>
          </h2>
          <p className="text-sm text-gray-500">
            We deliver nationwide with heavy-duty wooden crating to ensure your QuickFill Kart arrives in perfect condition.
          </p>
        </div>

        {/* 3 Region Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {DELIVERY_TIMES_TABLE.map((item, idx) => (
            <div
              key={idx}
              className="card-green-lift bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs text-center flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1b4d2e] text-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1b4d2e] transition-colors">
                  {item.region}
                </h3>
                <div className="my-3 py-2.5 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200/70 rounded-xl">
                  <span className="text-2xl font-black text-[#1b4d2e]">
                    {item.days}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.note}
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-100 flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Wooden Crate Freight Protection</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
