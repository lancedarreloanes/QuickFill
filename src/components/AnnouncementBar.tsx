import React, { useState, useEffect } from 'react';
import { Truck, Leaf, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [activeMessage, setActiveMessage] = useState(0);

  const messages = [
    {
      text: "Delivery nationwide: Luzon 1–5 days, Visayas & Mindanao 3–7 days",
      icon: Truck
    },
    {
      text: "Refill More, Waste Less • Free 15L Brightwash Pack with Every QuickFill Kart",
      icon: Leaf
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  const CurrentIcon = messages[activeMessage].icon;

  return (
    <div className="bg-gradient-to-r from-[#0e2a18] via-[#1b4d2e] to-[#0e2a18] text-white text-xs sm:text-[13px] py-2.5 px-4 font-medium tracking-wide border-b border-emerald-500/30 shadow-xs relative overflow-hidden">
      {/* Subtle top emerald highlight line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        
        {/* Desktop dual display */}
        <div className="hidden md:flex items-center justify-between w-full text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
              <Truck className="w-3 h-3 text-emerald-300 flex-shrink-0" />
            </span>
            <span>Delivery nationwide: Luzon 1–5 days, Visayas &amp; Mindanao 3–7 days</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-white bg-emerald-950/50 border border-emerald-400/25 px-3 py-0.5 rounded-full">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-bounce flex-shrink-0" style={{ animationDuration: '3s' }} />
            <span className="text-emerald-200">Refill More, Waste Less</span>
            <Sparkles className="w-3 h-3 text-emerald-300" />
          </div>
        </div>

        {/* Mobile rotating view */}
        <div className="md:hidden flex items-center justify-center w-full text-center text-emerald-100">
          <div key={activeMessage} className="flex items-center gap-2 animate-fadeIn">
            <CurrentIcon className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <span className="truncate">{messages[activeMessage].text}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
