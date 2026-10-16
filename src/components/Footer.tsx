import React from 'react';
import { Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-slate-800 bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-base text-white">Trip Hop • Singapore</div>
            <div className="text-xs text-slate-300">
              Singapore Excursions, Corporate Team Building &amp; Weather Contingency Planning.
            </div>
          </div>
        </div>

        {/* Data Credit */}
        <div className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 text-center md:text-right shadow-md">
          <div className="text-xs font-mono font-extrabold text-emerald-400 mb-0.5">
            Data: &lt;Data.gov.sg&gt; &amp; &lt;Foursquare&gt;
          </div>
          <div className="text-xs text-slate-300">
            Real-time Singapore 2-hour meteorological sensors &amp; venue food ratings
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Pricing Model: <strong>Free for couples (up to 2 pax)</strong> • Families (3+ pax) &amp; Corporate behind paywall.
        </div>
        <div>
          Privacy: No personal tracking beyond party size and budget preferences.
        </div>
      </div>
    </footer>
  );
};
