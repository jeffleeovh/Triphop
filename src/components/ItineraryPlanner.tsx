import React, { useState } from 'react';
import { Trash2, Clock, MapPin, Share2, Check, ShieldCheck, AlertTriangle, Lock, Sparkles } from 'lucide-react';
import { OutingItem } from '../types.ts';

interface ItineraryPlannerProps {
  items: OutingItem[];
  groupSize: number;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  isRain: boolean;
  isSecondaryActive: boolean;
  onSwitchToSecondary: () => void;
  isPaywalled: boolean;
  onOpenPaywall: () => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  items,
  groupSize,
  onRemoveItem,
  onClearAll,
  isRain,
  isSecondaryActive,
  onSwitchToSecondary,
  isPaywalled,
  onOpenPaywall,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Financial calculations
  const activitiesSubtotalPerPax = items.reduce((sum, item) => sum + item.pricePerPax, 0);
  const activitiesSubtotalTotal = activitiesSubtotalPerPax * groupSize;
  const estimatedFoodPerPax = 22; // Avg Singapore hawker/satay feast
  const totalFoodBudget = estimatedFoodPerPax * groupSize;
  const grandTotal = activitiesSubtotalTotal + totalFoodBudget;
  const grandTotalPerPax = Math.round(grandTotal / groupSize);

  const outdoorItemsUnderRain = isRain ? items.filter((i) => i.type === 'outdoor') : [];

  const handleShare = () => {
    const text = `🇸🇬 Trip Hop Singapore Outing Plan (${groupSize} pax)\n` +
      `Estimated Cost: S$${grandTotal} (S$${grandTotalPerPax}/pax)\n\n` +
      items.map((it, idx) => `${idx + 1}. ${it.name} - S$${it.pricePerPax}/pax (${it.area})`).join('\n') +
      `\n\nGenerated with Trip Hop • Data: Data.gov.sg & Foursquare`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="p-12 sm:p-16 rounded-3xl bg-white border-2 border-slate-200 text-center shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-200 shadow-inner">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="font-display font-extrabold text-2xl text-slate-900 mb-2">
          Your Itinerary is Empty
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          Head to <strong>Explore Activities</strong> and click "Add to Outing" to compute group pricing, transit times, and weather contingency plans.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Paywall Alert Banner */}
      {isPaywalled && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-lg text-slate-900">
                Family &amp; Corporate Outing Gated (Party of {groupSize})
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Couples (up to 2 pax) are free. Parties of 3+ require a Family or Corporate Pass to export and coordinate.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPaywall}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Pass / Demo</span>
          </button>
        </div>
      )}

      {/* Weather Warning inside planner */}
      {outdoorItemsUnderRain.length > 0 && !isSecondaryActive && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-400 text-amber-950 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-base block text-slate-900">
                {outdoorItemsUnderRain.length} Outdoor Activity At Risk Due to Rain
              </span>
              <span className="text-slate-700 text-xs sm:text-sm">
                Affected: {outdoorItemsUnderRain.map((i) => i.name).join(', ')}
              </span>
            </div>
          </div>
          <button
            onClick={onSwitchToSecondary}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-extrabold text-xs sm:text-sm hover:bg-amber-600 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Adopt Sheltered Plan</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-extrabold tracking-wider text-emerald-700">
                Itinerary Overview
              </span>
              {isSecondaryActive && (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Sheltered Secondary Plan
                </span>
              )}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              Singapore Excursion Plan ({groupSize} Pax)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Share Plan'}</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="divide-y-2 divide-slate-100 my-5">
          {items.map((item, index) => {
            const itemTotal = item.pricePerPax * groupSize;
            return (
              <div key={item.id} className="py-5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-display font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {item.area}
                      </span>
                      <span>•</span>
                      <span>{item.durationHours} hours</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="text-right font-mono">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      {item.pricePerPax === 0 ? 'FREE' : `S$${item.pricePerPax}/pax`}
                    </div>
                    <div className="text-xs text-slate-500">
                      S${itemTotal} group total
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from itinerary"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cost Breakdown */}
        <div className="pt-6 border-t-2 border-slate-100">
          <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Transparent Cost Breakdown</span>
              <span className="text-emerald-700 font-bold">No Hidden Fees</span>
            </div>

            <div className="flex justify-between text-sm text-slate-700 font-mono">
              <span>Activities ({items.length} attractions × {groupSize} pax):</span>
              <span className="font-extrabold text-slate-900">S${activitiesSubtotalTotal}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600 font-mono">
              <span>Estimated Hawker &amp; Satay Dining (S$22/pax):</span>
              <span>S${totalFoodBudget}</span>
            </div>

            <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-baseline font-mono">
              <div>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                  Grand Total Outing Cost:
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700">
                  S${grandTotalPerPax} per person split
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold font-display text-emerald-700 drop-shadow">
                S${grandTotal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
