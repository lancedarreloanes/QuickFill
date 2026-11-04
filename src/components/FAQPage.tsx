import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { FAQ_LIST } from '../data/refillaData';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Help &amp; Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500">
            Everything you need to know about operating the Pur Vendo Machine and Brightwash powder refills.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                >
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#1b4d2e] flex items-center justify-center flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions box */}
        <div className="p-8 rounded-3xl bg-[#1b4d2e] text-white text-center space-y-4">
          <h3 className="text-xl font-black">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            Our technical support team is available Monday through Saturday, 8:00 AM to 6:00 PM.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold">
            <a
              href="tel:09243730042"
              className="px-5 py-2.5 rounded-full bg-white text-[#1b4d2e] hover:bg-emerald-50 transition shadow-xs flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>09243730042</span>
            </a>
            <a
              href="mailto:Refilla_QuickfFill.2026@gmail.com"
              className="px-5 py-2.5 rounded-full bg-emerald-800 text-white hover:bg-emerald-700 transition border border-emerald-600 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Refilla_QuickfFill.2026@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

