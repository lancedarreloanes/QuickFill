import React, { useState } from 'react';
import { Building2, Send, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const ProcurementPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    estimatedUnits: '5–10 Units',
    sector: 'Barangay Livelihood Program',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1b4d2e] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>E-Procurement Module • Under Clarification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Bulk &amp; Business Orders
          </h1>
          <p className="text-sm text-gray-500">
            For local government units (LGUs), cooperatives, barangay livelihood initiatives, and commercial fleet deployments.
          </p>
        </div>

        {/* Placeholder Information Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#1b4d2e] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">E-Procurement Section Notice (Component 3):</span>
              Official institutional procurement requirements are currently under clarification. In the meantime, you can submit your bulk machine and Brightwash powder requirements below to receive a priority quotation within 24 business hours.
            </div>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#1b4d2e] mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-gray-900">
                Bulk Order Request Received!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you, <strong>{formData.contactPerson}</strong>. Our enterprise accounts manager will contact {formData.companyName} at {formData.email} with institutional pricing and shipping schedules.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-full bg-[#1b4d2e] text-white text-xs font-bold"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Organization / Entity / LGU Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brgy. Central Livelihood Project"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Procurement Officer / Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name & title"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Official Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@organization.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Estimated Machines Required</label>
                  <select
                    value={formData.estimatedUnits}
                    onChange={(e) => setFormData({ ...formData, estimatedUnits: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="1–4 Units">1–4 Units (Evaluation)</option>
                    <option value="5–10 Units">5–10 Units (Community Deployment)</option>
                    <option value="11–30 Units">11–30 Units (Barangay / Co-op Wide)</option>
                    <option value="31+ Units">31+ Units (Institutional / LGU Program)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Deployment Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="Barangay Livelihood Program">Barangay Livelihood Program</option>
                    <option value="Local Government Unit (LGU)">Local Government Unit (LGU)</option>
                    <option value="Agricultural / Women Cooperative">Agricultural / Women Cooperative</option>
                    <option value="Commercial Sari-Sari Store Chain">Retail / Sari-Sari Store Chain</option>
                    <option value="Commercial Carwash / Laundry">Commercial Carwash / Laundry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Additional Project Specifications or Timeline</label>
                <textarea
                  rows={3}
                  placeholder="Specify target deployment cities, expected delivery schedule, or municipal requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bulk Order Inquiry</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

