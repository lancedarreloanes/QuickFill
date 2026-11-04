import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Mail, PhoneCall, MapPin } from 'lucide-react';
import { NavigationPage } from '../types';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenPolicyModal?: (policy: 'terms' | 'return' | 'warranty') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicyModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#1b4d2e] text-emerald-100 text-xs pt-16 pb-10 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter Bar */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-black text-white">Join the Refilla Movement</h3>
            <p className="text-xs text-emerald-200">
              Receive updates on QuickFill Kart deployments, new Brightwash scents, and eco-dispensing tips.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 bg-emerald-400 text-slate-950 px-4 py-2 rounded-full font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-4 py-2.5 rounded-full text-xs bg-white text-gray-900 placeholder-gray-400 outline-none w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* 4 Columns Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/40">
          
          {/* Brand Info & Social Icons */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 p-0.5 bg-white">
                <img src="/images/refilla-logo.jpg" alt="Refilla" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Refilla</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              <strong>Refill More, Waste Less.</strong> Home of the QuickFill Kart dishwashing liquid vending machine and Brightwash concentrated powder refills.
            </p>
            <div className="space-y-1.5 text-xs text-emerald-100 pt-1">
              <a
                href="mailto:Refilla_QuickfFill.2026@gmail.com"
                className="flex items-center gap-2 hover:text-white transition break-all"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                <span>Refilla_QuickfFill.2026@gmail.com</span>
              </a>
              <a
                href="tel:09243730042"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                <span>Contact No.: 09243730042</span>
              </a>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block mb-2">
                Official Social Media:
              </span>
              <SocialLinks iconSize="sm" />
            </div>
          </div>

          {/* Shop & Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop Products</h4>
            <ul className="space-y-2 text-emerald-200/90">
              <li>
                <button onClick={() => onNavigate('shop-machine')} className="hover:text-white transition">
                  QuickFill Kart (5 Color Editions)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop-brightwash')} className="hover:text-white transition">
                  Brightwash Lemon Refill
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop-brightwash')} className="hover:text-white transition">
                  Brightwash Fresh Blue Refill
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop-brightwash')} className="hover:text-white transition">
                  Brightwash Calamansi Refill
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Tracking Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-2 text-emerald-200/90">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-white transition font-bold text-white">
                  Track Your Order (Step-by-Step)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition">
                  How It Works &amp; Price Table
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('procurement')} className="hover:text-white transition text-emerald-300 font-bold">
                  Bulk &amp; Business Orders (B2B)
                </button>
              </li>
            </ul>
          </div>

          {/* Policy Links & Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Policy &amp; Legal</h4>
            <ul className="space-y-2 text-emerald-200/90">
              <li>
                <a href="#how-it-works" onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  Return &amp; Refund Policy (7 Days)
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  1-Year Factory Warranty Policy
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block mb-1.5">
                Payment Method Badges:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-white">
                <span className="bg-white/10 px-2 py-0.5 rounded font-mono">VISA</span>
                <span className="bg-white/10 px-2 py-0.5 rounded font-mono">Mastercard</span>
                <span className="bg-white/10 px-2 py-0.5 rounded font-bold text-blue-300">GCash</span>
                <span className="bg-white/10 px-2 py-0.5 rounded font-bold text-emerald-300">Maya</span>
                <span className="bg-white/10 px-2 py-0.5 rounded font-bold text-yellow-300">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/60">
          <p>© 2026 Refilla Philippines. All rights reserved. Refill More, Waste Less.</p>
          <div className="flex items-center gap-4">
            <span>DTI Registered Brand</span>
            <span>•</span>
            <span>Nationwide Freight Protection</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
