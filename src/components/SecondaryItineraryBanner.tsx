import React from 'react';
import { ShieldCheck, CloudRain, ArrowRight, Umbrella, Check } from 'lucide-react';
import { OutingItem } from '../types.ts';

interface SecondaryItineraryBannerProps {
  isRain: boolean;
  isSecondaryActive: boolean;
  onActivateSecondary: () => void;
  onRevertToPrimary: () => void;
  primaryItems: OutingItem[];
  secondaryItems: OutingItem[];
  groupSize: number;
}

export const SecondaryItineraryBanner: React.FC<SecondaryItineraryBannerProps> = ({
  isRain,
  isSecondaryActive,
  onActivateSecondary,
  onRevertToPrimary,
  primaryItems,
  secondaryItems,
  groupSize,
}) => {
  if (!isRain) return null;

  const primaryCost = primaryItems.reduce((acc, item) => acc + item.pricePerPax, 0) * groupSize;
  const secondaryCost = secondaryItems.reduce((acc, item) => acc + item.pricePerPax, 0) * groupSize;

  return (
    <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-3 border-amber-500 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b-2 border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 flex-shrink-0 font-extrabold">
            <Umbrella className="w-8 h-8 animate-bounce [animation-duration:2.5s]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                Weather Contingency Protocol
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/30 text-amber-200 border border-amber-500/50">
                Rain Alert Active
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
              Wet Weather Detected: Switch to Sheltered Itinerary?
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mt-1.5 font-medium">
              Data.gov.sg real-time sensors report rain across outdoor attractions.
              Trip Hop has generated an air-conditioned, 100% rainproof secondary itinerary.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {!isSecondaryActive ? (
            <button
              onClick={onActivateSecondary}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/30 transition-all active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Switch to Sheltered Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/40 text-sm font-extrabold">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Secondary Plan Active</span>
              </div>
              <button
                onClick={onRevertToPrimary}
                className="text-sm font-bold text-slate-400 hover:text-white underline px-3 py-1.5"
              >
                Revert to Primary
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison with Bigger Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Primary Itinerary */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            !isSecondaryActive
              ? 'bg-slate-950/80 border-amber-500/50'
              : 'bg-slate-950/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              Primary Itinerary (Outdoor)
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              High Rain Risk
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-300">
            {primaryItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-900/60">
                <span className="truncate pr-2 font-medium">{item.name}</span>
                <span className="font-mono text-slate-400 text-xs flex-shrink-0">
                  {item.pricePerPax === 0 ? 'Free' : `S$${item.pricePerPax}/pax`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-900 font-mono">
            <span>Est. Total ({groupSize} pax):</span>
            <span className="text-sm font-extrabold text-white">S${primaryCost}</span>
          </div>
        </div>

        {/* Proposed Secondary Itinerary */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            isSecondaryActive
              ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-950/40'
              : 'bg-slate-950/90 border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Proposed Secondary (100% Sheltered)
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              Climate-Controlled
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-200">
            {secondaryItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-900/60">
                <span className="truncate pr-2 font-bold">{item.name}</span>
                <span className="font-mono text-amber-300 text-xs flex-shrink-0">
                  {item.pricePerPax === 0 ? 'Free' : `S$${item.pricePerPax}/pax`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-slate-900 font-mono">
            <span>Est. Total ({groupSize} pax):</span>
            <span className="text-sm font-extrabold text-amber-300">S${secondaryCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
