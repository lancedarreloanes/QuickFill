import React, { useState } from 'react';
import { Building2, FileText, Send, CheckCircle2, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';

interface ProcurementSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const ProcurementSection: React.FC<ProcurementSectionProps> = ({
  isOpenModal = false,
  onCloseModal
}) => {
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    unitsNeeded: '5-10 Units',
    targetDeployment: 'Commercial Sari-Sari Store Chain',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
  };

  const content = (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>E-Procurement Module • Under Specification &amp; Clarification</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          B2B &amp; Institutional E-Procurement Portal
        </h3>
        
        <p className="mt-2 text-sm text-gray-300 leading-relaxed">
          Are you procuring Pur Vendo Machines for government projects (LGUs, Barangays), cooperative enterprises, commercial laundries, gasoline stations, or large franchise chains? 
          Submit your bulk requirement below while the full automated E-Procurement contract bidding suite is being finalized.
        </p>

        {/* Status Callout Box */}
        <div className="my-5 bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <Building2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-300">
            <span className="font-bold text-white block mb-0.5">Placeholder Notice (Component 3):</span>
            Formal e-procurement workflow (PO generation, supplier bidding, and corporate invoice settlement) is in queue for specification. Instant RFQs submitted below receive priority quotations within 24 business hours.
          </div>
        </div>

        {/* RFQ Form */}
        {rfqSubmitted ? (
          <div className="bg-emerald-500/20 border border-emerald-400/30 p-6 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">
              Institutional RFQ Received!
            </h4>
            <p className="text-xs text-emerald-200 max-w-md mx-auto">
              Thank you, <strong>{formData.contactPerson}</strong>. Our enterprise accounts manager has logged your inquiry for {formData.companyName} and will send a formal quote and delivery schedule to {formData.email}.
            </p>
            <button
              onClick={() => setRfqSubmitted(false)}
              className="mt-3 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Organization / Entity / LGU Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brgy. San Antonio LGU / Metro Wash Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Procurement Officer / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name & designation"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Official Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@organization.ph"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+63 9XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Estimated Units Needed
                </label>
                <select
                  value={formData.unitsNeeded}
                  onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-white/20 text-white text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="1-4 Units">1 - 4 Units (Evaluation Pilot)</option>
                  <option value="5-10 Units">5 - 10 Units (Small Community Deployment)</option>
                  <option value="11-30 Units">11 - 30 Units (Barangay-Wide / Co-op)</option>
                  <option value="31+ Units">31+ Units (Institutional / Franchise Tier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Deployment Sector
                </label>
                <select
                  value={formData.targetDeployment}
                  onChange={(e) => setFormData({ ...formData, targetDeployment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-white/20 text-white text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="Commercial Sari-Sari Store Chain">Retail / Sari-Sari Store Chain</option>
                  <option value="Local Government Unit (LGU)">Local Government Unit (LGU)</option>
                  <option value="Livelihood Cooperative">Livelihood Cooperative</option>
                  <option value="Water Refilling Station Partner">Water Refilling Station Partner</option>
                  <option value="Commercial Laundry / Carwash">Commercial Laundry / Carwash</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit RFQ &amp; Request Bulk Terms</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl my-8">
          <button
            onClick={onCloseModal}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10 font-bold"
            aria-label="Close procurement modal"
          >
            <X className="w-4 h-4" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="procurement-section" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};

