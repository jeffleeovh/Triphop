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
    <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-3 border-amber-400 shadow-xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b-2 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex-shrink-0 font-extrabold">
            <Umbrella className="w-8 h-8 animate-bounce [animation-duration:2.5s]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-800">
                Weather Contingency Protocol
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-200 text-amber-950 border border-amber-300">
                Rain Alert Active
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Wet Weather Detected: Switch to Sheltered Itinerary?
            </h3>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed mt-1.5 font-medium">
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
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Switch to Sheltered Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 border-2 border-emerald-300 text-sm font-extrabold">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Secondary Plan Active</span>
              </div>
              <button
                onClick={onRevertToPrimary}
                className="text-sm font-bold text-slate-700 hover:text-slate-950 underline px-3 py-1.5"
              >
                Revert to Primary
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Primary Itinerary */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${
            !isSecondaryActive
              ? 'bg-white border-amber-300'
              : 'bg-white/60 border-slate-200 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-600" />
              Primary Itinerary (Outdoor)
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
              High Rain Risk
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-700">
            {primaryItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="truncate pr-2 font-medium">{item.name}</span>
                <span className="font-mono text-slate-500 text-xs flex-shrink-0">
                  {item.pricePerPax === 0 ? 'Free' : `S$${item.pricePerPax}/pax`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
            <span>Est. Total ({groupSize} pax):</span>
            <span className="text-sm font-extrabold text-slate-900">S${primaryCost}</span>
          </div>
        </div>

        {/* Proposed Secondary Itinerary */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${
            isSecondaryActive
              ? 'bg-white border-emerald-500 shadow-md'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Proposed Secondary (100% Sheltered)
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
              Climate-Controlled
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-800">
            {secondaryItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="truncate pr-2 font-bold">{item.name}</span>
                <span className="font-mono text-emerald-700 text-xs flex-shrink-0">
                  {item.pricePerPax === 0 ? 'Free' : `S$${item.pricePerPax}/pax`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
            <span>Est. Total ({groupSize} pax):</span>
            <span className="text-sm font-extrabold text-emerald-800">S${secondaryCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
