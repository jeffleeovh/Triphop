import React from 'react';
import { Lock, Sparkles, Check, X } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupSize: number;
  persona: string;
  onUnlockDemo: () => void;
  isUnlocked: boolean;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  groupSize,
  persona,
  onUnlockDemo,
  isUnlocked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-100 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
            Freemium Tier Policy
          </span>
        </div>

        <h3 className="font-display font-extrabold text-2xl text-slate-900 mb-2">
          Trip Hop Family &amp; Corporate Pass
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Planning outings for <strong>up to 2 people (Couples &amp; Duos)</strong> is completely <strong>FREE</strong>.
          Parties of 3 or more (Families and Corporate Teams) unlock full group budgeting, custom itineraries, and team coordination behind the pass.
        </p>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Family Plan */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Family &amp; Friends
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  3+ Pax
                </span>
              </div>
              <div className="text-2xl font-extrabold font-display text-slate-900 mb-1">
                S$4.99 <span className="text-xs font-normal text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Ideal for family weekend outings and friend group excursions.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Unlimited family party size</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Rain-proof secondary itineraries</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Transparent group cost splitting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Corporate Plan */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border-2 border-amber-200 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Corporate Team
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Team Bonding
                </span>
              </div>
              <div className="text-2xl font-extrabold font-display text-slate-900 mb-1">
                S$29 <span className="text-xs font-normal text-slate-500">/outing</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Full HR expense reporting for company retreats &amp; team bonding.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>High-energy team building (iFly, Lost SG)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>HR itemized invoice &amp; tax receipts</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Party sizes from 5 to 100+ pax</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo / Unlock Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span>Current Party: </span>
            <strong className="text-slate-900">{groupSize} pax ({persona})</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onUnlockDemo}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                isUnlocked
                  ? 'bg-slate-100 text-emerald-800 border-2 border-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-105 shadow-emerald-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUnlocked ? 'Pass Active (Simulated)' : 'Simulate Subscriber Pass'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
