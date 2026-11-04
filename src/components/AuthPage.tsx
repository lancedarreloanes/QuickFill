import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle2, AlertCircle, Leaf, ArrowRight, ShieldCheck, Store, Cloud } from 'lucide-react';
import { UserAccount, AuthView, UserRole } from '../types';
import { cloudStore } from '../services/cloudStore';

interface AuthPageProps {
  onAuthSuccess: (user: UserAccount) => void;
  onBackToHome?: () => void;
  redirectMessage?: string;
}

const CURRENT_USER_KEY = 'refilla_current_user';

// ─── Component ─────────────────────────────────────────────────────────────────
export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToHome, redirectMessage }) => {
  const [view, setView] = useState<AuthView>('sign-in');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Sign-in form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPw, setShowSignInPw] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign-up form
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [showSignUpPw, setShowSignUpPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Modal & inline preview tab state ('terms' | 'privacy')
  const [activePolicyModal, setActivePolicyModal] = useState<'terms' | 'privacy' | null>(null);
  const [inlinePolicyTab, setInlinePolicyTab] = useState<'terms' | 'privacy'>('terms');

  // ── Sign In handler ──────────────────────────────────────────────────────────
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    if (!signInEmail || !signInPassword) {
      setSignInError('Please fill in all fields.');
      return;
    }
    setSignInLoading(true);
    setTimeout(() => {
      const user = cloudStore.authenticate(signInEmail.trim(), signInPassword);
      if (!user) {
        setSignInError('Incorrect email or password. Use the quick Customer or Seller credentials below, or create a new account.');
        setSignInLoading(false);
        return;
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      setSignInLoading(false);
      onAuthSuccess(user);
    }, 500);
  };

  // ── Sign Up handler ──────────────────────────────────────────────────────────
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword || !signUpConfirm) {
      setSignUpError('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      setSignUpError('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 8) {
      setSignUpError('Password must be at least 8 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      setSignUpError('Passwords do not match.');
      return;
    }
    if (!agreedToPrivacy) {
      setSignUpError('You must read and agree to the Terms of Service and Privacy Policy before creating an account.');
      return;
    }

    // Check duplicate email in Cloud Store
    const existing = cloudStore.findUserByEmail(signUpEmail);
    if (existing) {
      setSignUpError('An account with this email already exists in Refilla Cloud. Please sign in instead.');
      return;
    }

    setSignUpLoading(true);
    setTimeout(() => {
      const newUser = cloudStore.registerUser(
        signUpName.trim(),
        signUpEmail.trim().toLowerCase(),
        signUpPassword
      );
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setSignUpLoading(false);
      setSignUpSuccess(true);
      // Auto sign-in after 1.2s
      setTimeout(() => onAuthSuccess(newUser), 1200);
    }, 600);
  };

  // ── Password strength ────────────────────────────────────────────────────────
  const pwStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
    if (pw.length < 8) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
    if (pw.length < 12) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };
  const strength = pwStrength(signUpPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">

      {/* Top Brand Bar */}
      <div className="py-4 px-6 border-b border-emerald-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {onBackToHome ? (
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-[#1b4d2e] hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 transition"
            >
              <span>← Back to Store Preview</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-600 p-0.5 bg-white shadow-sm">
              <img src="/images/refilla-logo.jpg" alt="Refilla" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <span className="text-xl font-light tracking-[0.2em] uppercase text-gray-900 font-serif">REFILLA</span>
              <p className="text-[9px] text-emerald-700 font-semibold uppercase tracking-widest">Refill More, Waste Less</p>
            </div>
          </div>

          <div className="w-28 hidden sm:block" />
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">

          {/* Redirect notice when user clicked Shop or an item */}
          {redirectMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs animate-fadeIn">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Account Required to Shop</p>
                <p className="mt-0.5 text-amber-800">{redirectMessage}</p>
              </div>
            </div>
          )}

          {/* Hero text */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              <Leaf className="w-3.5 h-3.5" />
              Refill More, Waste Less
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              {view === 'sign-in' ? 'Welcome back!' : 'Create your account'}
            </h1>
            <p className="text-sm text-gray-500">
              {view === 'sign-in'
                ? 'Sign in to Refilla to shop the QuickFill Kart and Brightwash refills.'
                : 'Join Refilla to order your QuickFill Kart vending machine.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setView('sign-in'); setSignInError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${
                view === 'sign-in'
                  ? 'bg-white text-[#1b4d2e] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setView('sign-up'); setSignUpError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${
                view === 'sign-up'
                  ? 'bg-white text-[#1b4d2e] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ── SIGN IN FORM ─────────────────────────────────────────────── */}
          {view === 'sign-in' && (
            <form onSubmit={handleSignIn} className="bg-white rounded-3xl shadow-md border border-gray-100 p-7 space-y-5 animate-fadeIn">

              {/* Error */}
              {signInError && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* Role-Based Quick Cloud Login Buttons (Customer vs Seller) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Role-Based Cloud Accounts (Quick Fill):</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Cloud Synced
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('customer');
                      setSignInEmail('customer@quickfill.ph');
                      setSignInPassword('QuickFill2026!');
                      setSignInError('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      signInEmail.toLowerCase() === 'customer@quickfill.ph'
                        ? 'bg-[#1b4d2e] text-white border-[#1b4d2e] shadow-xs'
                        : 'bg-white text-gray-800 border-emerald-200 hover:border-emerald-500'
                    }`}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] leading-tight">Customer Demo</div>
                      <div className={`text-[10px] truncate ${signInEmail.toLowerCase() === 'customer@quickfill.ph' ? 'text-emerald-200' : 'text-gray-500'}`}>
                        customer@quickfill.ph
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('seller');
                      setSignInEmail('Refilla_QuickfFill.2026@gmail.com');
                      setSignInPassword('Seller2026!');
                      setSignInError('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      signInEmail.toLowerCase() === 'refilla_quickffill.2026@gmail.com'
                        ? 'bg-[#1b4d2e] text-white border-[#1b4d2e] shadow-xs'
                        : 'bg-white text-gray-800 border-emerald-200 hover:border-emerald-500'
                    }`}
                  >
                    <Store className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] leading-tight">Official Seller (Only 1)</div>
                      <div className={`text-[10px] truncate ${signInEmail.toLowerCase() === 'refilla_quickffill.2026@gmail.com' ? 'text-emerald-200' : 'text-gray-500'}`}>
                        Refilla_QuickfFill.2026@gmail.com
                      </div>
                    </div>
                  </button>
                </div>
                <p className="text-[10px] text-emerald-800/80">
                  🔒 Only the 1 official company account (<strong>Refilla_QuickfFill.2026@gmail.com</strong>) has Seller access.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignInPw ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSignInPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signInLoading}
                className="w-full py-3.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
              >
                {signInLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Refilla</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('sign-up')}
                  className="text-[#1b4d2e] font-bold hover:underline"
                >
                  Create one here →
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────────────────── */}
          {view === 'sign-up' && !signUpSuccess && (
            <form onSubmit={handleSignUp} className="bg-white rounded-3xl shadow-md border border-gray-100 p-7 space-y-5 animate-fadeIn">

              {/* Error */}
              {signUpError && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {/* Customer Account Notice (Public registration is strictly Customer-only) */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#1b4d2e] font-bold">
                  <User className="w-4 h-4" />
                  <span>Customer Account Registration</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  Shopper Access
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password * <span className="text-gray-400 font-normal">(min. 8 characters)</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignUpPw ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSignUpPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength bar */}
                {strength && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="text-[11px] text-gray-500">Password strength: <strong>{strength.label}</strong></p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={signUpConfirm}
                    onChange={e => setSignUpConfirm(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm focus:ring-2 outline-none transition ${
                      signUpConfirm && signUpPassword !== signUpConfirm
                        ? 'border-red-300 focus:ring-red-400'
                        : signUpConfirm && signUpPassword === signUpConfirm
                        ? 'border-emerald-400 focus:ring-emerald-600'
                        : 'border-gray-200 focus:ring-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {signUpConfirm && signUpPassword === signUpConfirm && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-10 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {signUpConfirm && signUpPassword !== signUpConfirm && (
                  <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>
                )}
              </div>

              {/* ── TERMS OF SERVICE & PRIVACY POLICY AGREEMENT (SIGN UP) ─── */}
              <div className={`p-4 rounded-2xl border-2 transition space-y-3 ${
                agreedToPrivacy
                  ? 'border-emerald-500 bg-emerald-50/60'
                  : 'border-gray-200 bg-gray-50/60'
              }`}>
                {/* Mini Tab Switcher between Terms of Service and Privacy Policy */}
                <div className="flex gap-1.5 bg-gray-200/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setInlinePolicyTab('terms')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wide transition ${
                      inlinePolicyTab === 'terms'
                        ? 'bg-[#1b4d2e] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Terms of Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setInlinePolicyTab('privacy')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wide transition ${
                      inlinePolicyTab === 'privacy'
                        ? 'bg-[#1b4d2e] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Privacy Policy
                  </button>
                </div>

                {/* Scrollable Box showing the active document (Terms of Service OR Privacy Policy) */}
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 max-h-48 overflow-y-auto text-[11px] text-gray-700 leading-relaxed space-y-2">
                  {inlinePolicyTab === 'terms' ? (
                    <>
                      <div className="font-extrabold text-xs text-[#1b4d2e] uppercase border-b border-gray-100 pb-1">
                        TERMS OF SERVICE
                      </div>
                      <p>Welcome to QuickFill Kart! By creating an account on our website, you agree to follow the terms and conditions below.</p>
                      <p><strong>1. Account Registration</strong> – Customers must provide accurate and complete information when signing up.</p>
                      <p><strong>2. Account Responsibility</strong> – Customers are responsible for keeping their login details secure and for activities under their accounts.</p>
                      <p><strong>3. Proper Use</strong> – Users must use the website responsibly and must not engage in fraudulent, harmful, or unauthorized activities.</p>
                      <p><strong>4. Product Information</strong> – QuickFill Kart aims to provide accurate product descriptions, prices, and information. However, details may change when necessary.</p>
                      <p><strong>5. Orders and Payments</strong> – Customers must review their orders before confirming purchases and ensure that payment details are correct.</p>
                      <p><strong>6. Changes to Terms</strong> – QuickFill Kart reserves the right to update these terms when necessary. Customers will be informed of significant changes.</p>
                      <p className="italic text-gray-600 pt-1 border-t border-gray-100">
                        By signing up, you acknowledge that you have read and agreed to these Terms of Service.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-extrabold text-xs text-[#1b4d2e] uppercase border-b border-gray-100 pb-1">
                        PRIVACY POLICY
                      </div>
                      <p>At QuickFill Kart, we value your privacy and are committed to protecting your personal information.</p>
                      <p><strong>1. Information We Collect</strong> – We may collect your name, email address, contact number, delivery address, and other information provided during registration or transactions.</p>
                      <p><strong>2. Use of Information</strong> – Your information will be used to manage your account, process orders, provide customer assistance, and communicate important updates.</p>
                      <p><strong>3. Data Protection</strong> – We will take reasonable measures to protect your personal information against unauthorized access, misuse, or disclosure.</p>
                      <p><strong>4. Sharing of Information</strong> – Your personal information will not be sold to third parties. It may only be shared with authorized service providers when necessary to process transactions or provide services, subject to appropriate safeguards.</p>
                      <p><strong>5. Customer Rights</strong> – You have the right to request access to, correction of, or deletion of your personal information, subject to applicable legal requirements.</p>
                      <p><strong>6. Policy Updates</strong> – This Privacy Policy may be updated when necessary. Any significant changes will be communicated to users.</p>
                      <p className="italic text-gray-600 pt-1 border-t border-gray-100">
                        By creating an account, you acknowledge that you have read and understood this Privacy Policy.
                      </p>
                    </>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={e => setAgreedToPrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1b4d2e] focus:ring-emerald-600 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-gray-800 leading-relaxed font-medium">
                    By signing up, I acknowledge that I have read and agreed to the{' '}
                    <button
                      type="button"
                      onClick={() => setActivePolicyModal('terms')}
                      className="text-[#1b4d2e] font-bold underline hover:text-emerald-700"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={() => setActivePolicyModal('privacy')}
                      className="text-[#1b4d2e] font-bold underline hover:text-emerald-700"
                    >
                      Privacy Policy
                    </button>
                    {' '}of QuickFill Kart. *
                  </span>
                </label>

                {!agreedToPrivacy && (
                  <div className="ml-7 flex items-center gap-1.5 text-[11px] text-amber-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>You must agree to the Terms of Service &amp; Privacy Policy to continue.</span>
                  </div>
                )}

                {agreedToPrivacy && (
                  <div className="ml-7 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Terms of Service &amp; Privacy Policy accepted. Thank you!</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signUpLoading || !agreedToPrivacy}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                  agreedToPrivacy && !signUpLoading
                    ? 'bg-[#1b4d2e] hover:bg-[#143a22] text-white hover:shadow-lg cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {signUpLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>
                      {agreedToPrivacy
                        ? 'Create My Refilla Account'
                        : 'Agree to Terms & Privacy Policy to Continue'}
                    </span>
                    {agreedToPrivacy && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('sign-in')}
                  className="text-[#1b4d2e] font-bold hover:underline"
                >
                  Sign in →
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP SUCCESS ──────────────────────────────────────────── */}
          {view === 'sign-up' && signUpSuccess && (
            <div className="bg-white rounded-3xl shadow-md border border-emerald-200 p-10 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Account Created!</h2>
              <p className="text-sm text-gray-500">
                Welcome to Refilla, <strong>{signUpName}</strong>!<br />
                Signing you in and taking you to the store…
              </p>
              <div className="w-6 h-6 border-2 border-[#1b4d2e] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & encrypted</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-500" /> Eco-certified brand</span>
            <span>•</span>
            <span>🇵🇭 Philippines</span>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TERMS OF SERVICE OR PRIVACY POLICY MODAL ───────────────── */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[82vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#1b4d2e]">
              <div>
                <h2 className="text-base font-black text-white">
                  {activePolicyModal === 'terms' ? 'TERMS OF SERVICE' : 'PRIVACY POLICY'}
                </h2>
                <p className="text-[11px] text-emerald-200">QuickFill Kart • By Refilla Philippines</p>
              </div>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="text-emerald-200 hover:text-white text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 text-xs text-gray-700 leading-relaxed space-y-4 flex-1">
              {activePolicyModal === 'terms' ? (
                <div className="space-y-3">
                  <h3 className="font-black text-sm text-[#1b4d2e] uppercase tracking-wide border-b border-emerald-100 pb-1.5">
                    TERMS OF SERVICE
                  </h3>
                  <p className="font-medium text-gray-800">
                    Welcome to QuickFill Kart! By creating an account on our website, you agree to follow the terms and conditions below.
                  </p>
                  <p><strong>1. Account Registration</strong> – Customers must provide accurate and complete information when signing up.</p>
                  <p><strong>2. Account Responsibility</strong> – Customers are responsible for keeping their login details secure and for activities under their accounts.</p>
                  <p><strong>3. Proper Use</strong> – Users must use the website responsibly and must not engage in fraudulent, harmful, or unauthorized activities.</p>
                  <p><strong>4. Product Information</strong> – QuickFill Kart aims to provide accurate product descriptions, prices, and information. However, details may change when necessary.</p>
                  <p><strong>5. Orders and Payments</strong> – Customers must review their orders before confirming purchases and ensure that payment details are correct.</p>
                  <p><strong>6. Changes to Terms</strong> – QuickFill Kart reserves the right to update these terms when necessary. Customers will be informed of significant changes.</p>
                  <p className="pt-2 border-t border-gray-100 italic text-gray-700 font-semibold">
                    By signing up, you acknowledge that you have read and agreed to these Terms of Service.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-black text-sm text-[#1b4d2e] uppercase tracking-wide border-b border-emerald-100 pb-1.5">
                    PRIVACY POLICY
                  </h3>
                  <p className="font-medium text-gray-800">
                    At QuickFill Kart, we value your privacy and are committed to protecting your personal information.
                  </p>
                  <p><strong>1. Information We Collect</strong> – We may collect your name, email address, contact number, delivery address, and other information provided during registration or transactions.</p>
                  <p><strong>2. Use of Information</strong> – Your information will be used to manage your account, process orders, provide customer assistance, and communicate important updates.</p>
                  <p><strong>3. Data Protection</strong> – We will take reasonable measures to protect your personal information against unauthorized access, misuse, or disclosure.</p>
                  <p><strong>4. Sharing of Information</strong> – Your personal information will not be sold to third parties. It may only be shared with authorized service providers when necessary to process transactions or provide services, subject to appropriate safeguards.</p>
                  <p><strong>5. Customer Rights</strong> – You have the right to request access to, correction of, or deletion of your personal information, subject to applicable legal requirements.</p>
                  <p><strong>6. Policy Updates</strong> – This Privacy Policy may be updated when necessary. Any significant changes will be communicated to users.</p>
                  <p className="pt-2 border-t border-gray-100 italic text-gray-700 font-semibold">
                    By creating an account, you acknowledge that you have read and understood this Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setAgreedToPrivacy(true);
                  setActivePolicyModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1b4d2e] text-white font-bold text-xs hover:bg-[#143a22] transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                I Accept – Close
              </button>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

