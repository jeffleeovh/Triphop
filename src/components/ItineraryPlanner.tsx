import React, { useState } from 'react';
import { Trash2, Clock, MapPin, Share2, Check, ShieldCheck, AlertTriangle, Building2, Users, Receipt, FileText, Award, Baby } from 'lucide-react';
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
  persona: string;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  items,
  groupSize,
  onRemoveItem,
  onClearAll,
  isRain,
  isSecondaryActive,
  onSwitchToSecondary,
  persona,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('Acme Global Singapore');
  const [teamLeader, setTeamLeader] = useState<string>('Alex Tan');

  // Financial calculations
  const activitiesSubtotalPerPax = items.reduce((sum, item) => sum + item.pricePerPax, 0);
  const activitiesSubtotalTotal = activitiesSubtotalPerPax * groupSize;
  const estimatedFoodPerPax = 22; // Avg Singapore hawker/satay feast
  const totalFoodBudget = estimatedFoodPerPax * groupSize;
  const subtotalBeforeTax = activitiesSubtotalTotal + totalFoodBudget;
  const gstTax = Math.round(subtotalBeforeTax * 0.09); // Singapore 9% GST
  const grandTotal = subtotalBeforeTax + gstTax;
  const grandTotalPerPax = Math.round(grandTotal / groupSize);

  const outdoorItemsUnderRain = isRain ? items.filter((i) => i.type === 'outdoor') : [];

  const handleShare = () => {
    const text = `🇸🇬 Trip Hop Singapore Outing Plan (${groupSize} pax - ${persona})\n` +
      `Grand Total: S$${grandTotal} (S$${grandTotalPerPax}/pax incl. 9% GST)\n\n` +
      `Activities:\n` +
      items.map((it, idx) => `${idx + 1}. ${it.name} - S$${it.pricePerPax}/pax (${it.area})`).join('\n') +
      `\n\nGenerated with Trip Hop Singapore • Data: Data.gov.sg & Foursquare`;

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
      {/* Unlocked Premium Suite Banner for Family & Corporate */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md flex-shrink-0">
            {persona === 'Corporate' ? <Building2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950">
                Unlocked Feature Suite
              </span>
              <span className="text-xs font-bold text-slate-700">
                Party of {groupSize} ({persona})
              </span>
            </div>
            <h4 className="font-display font-extrabold text-lg text-slate-900 mt-0.5">
              {persona === 'Corporate'
                ? 'Corporate Team Building & HR Expense Toolkit Active'
                : 'Family & Group Coordination Suite Active'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Full access to itemized tax invoicing, team role assignments, kid discounts, and live rain contingency planning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowInvoiceModal(!showInvoiceModal)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-emerald-300 font-extrabold text-xs shadow-xs transition-all active:scale-95"
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>{showInvoiceModal ? 'Hide HR Invoice' : 'Generate HR Tax Invoice'}</span>
          </button>
        </div>
      </div>

      {/* HR Invoice Preview Drawer / Section if toggled */}
      {showInvoiceModal && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-300 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Official Outing Quotation / Tax Invoice
              </span>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mt-0.5">
                Trip Hop Corporate Outing Invoice #TH-SG-2026-089
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Tax Invoice Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
            <div>
              <span className="font-bold block text-slate-900">Billed To Organization:</span>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 px-3 py-1.5 rounded-xl border border-slate-300 w-full font-medium text-slate-900"
              />
            </div>
            <div>
              <span className="font-bold block text-slate-900">Assigned Team Lead / POC:</span>
              <input
                type="text"
                value={teamLeader}
                onChange={(e) => setTeamLeader(e.target.value)}
                className="mt-1 px-3 py-1.5 rounded-xl border border-slate-300 w-full font-medium text-slate-900"
              />
            </div>
            <div>
              <span className="font-bold block text-slate-900">Corporate Party Headcount:</span>
              <div className="mt-1 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-900">
                {groupSize} Confirmed Employees
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-700">
              <span>Subtotal Activities ({items.length} events × {groupSize} pax):</span>
              <span className="font-bold">S${activitiesSubtotalTotal}.00</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>F&amp;B Catering Allowance (S$22/pax):</span>
              <span className="font-bold">S${totalFoodBudget}.00</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Singapore Goods &amp; Services Tax (9% GST):</span>
              <span className="font-bold">S${gstTax}.00</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Invoice Amount (SGD):</span>
              <span className="text-emerald-700 text-base">S${grandTotal}.00</span>
            </div>
          </div>
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
              Singapore Excursion Plan ({groupSize} Pax - {persona})
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </h4>
                      {item.isTeamBuildingFavorite && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          Team Favorite
                        </span>
                      )}
                    </div>
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
              <span className="text-emerald-700 font-bold">Includes 9% GST &amp; Group Discounts</span>
            </div>

            <div className="flex justify-between text-sm text-slate-700 font-mono">
              <span>Activities ({items.length} attractions × {groupSize} pax):</span>
              <span className="font-extrabold text-slate-900">S${activitiesSubtotalTotal}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600 font-mono">
              <span>Estimated Hawker &amp; Satay Dining (S$22/pax):</span>
              <span>S${totalFoodBudget}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600 font-mono">
              <span>Estimated 9% GST:</span>
              <span>S${gstTax}</span>
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
