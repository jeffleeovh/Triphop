import React from 'react';
import { Compass, Users, CloudRain, Sun, Lock, Sparkles, Utensils, Calendar } from 'lucide-react';
import { AudienceType, LiveWeatherData } from '../types.ts';

interface NavbarProps {
  groupSize: number;
  setGroupSize: (size: number) => void;
  selectedAudience: AudienceType;
  setSelectedAudience: (aud: AudienceType) => void;
  weatherData: LiveWeatherData | null;
  simulatedRain: boolean;
  setSimulatedRain: (sim: boolean) => void;
  activeTab: 'explore' | 'itinerary' | 'foursquare';
  setActiveTab: (tab: 'explore' | 'itinerary' | 'foursquare') => void;
  itineraryCount: number;
  onOpenPaywall: () => void;
  isSubscriber: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  groupSize,
  setGroupSize,
  selectedAudience,
  setSelectedAudience,
  weatherData,
  simulatedRain,
  setSimulatedRain,
  activeTab,
  setActiveTab,
  itineraryCount,
  onOpenPaywall,
  isSubscriber,
}) => {
  const isRain = simulatedRain || Boolean(weatherData?.isRainDetected);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b-2 border-emerald-100 px-4 sm:px-8 py-3.5 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 font-extrabold flex-shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
                  Trip Hop
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Singapore
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Outing Planner • Weather Contingency • Transparent Costs
              </p>
            </div>
          </div>

          {/* Quick weather badge on mobile */}
          <button
            onClick={() => setSimulatedRain(!simulatedRain)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isRain
                ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {isRain ? <CloudRain className="w-4 h-4 text-amber-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isRain ? 'Rain Alert' : 'Fair Sky'}</span>
          </button>
        </div>

        {/* Primary Tabs */}
        <div className="flex items-center justify-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 text-sm font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'explore'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Explore Activities
          </button>

          <button
            onClick={() => setActiveTab('foursquare')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'foursquare'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Utensils className="w-4 h-4 text-pink-500" />
            <span>Foursquare Food</span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'itinerary'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary</span>
            {itineraryCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-xs font-mono font-extrabold ${
                activeTab === 'itinerary' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {itineraryCount}
              </span>
            )}
          </button>
        </div>

        {/* Party Size & Paywall Indicator */}
        <div className="flex items-center gap-3 justify-end flex-wrap">
          {/* Rain Protocol Trigger (Desktop) */}
          <button
            onClick={() => setSimulatedRain(!simulatedRain)}
            className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all shadow-sm ${
              simulatedRain
                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-amber-200/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
            }`}
            title="Toggle rain simulation to test secondary sheltered itinerary"
          >
            {simulatedRain ? (
              <>
                <CloudRain className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Simulating Rain</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Simulate Rain Protocol</span>
              </>
            )}
          </button>

          {/* Group Pax Stepper */}
          <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl px-3 py-1.5 gap-2.5 shadow-sm">
            <span className="text-xs text-slate-600 flex items-center gap-1.5 font-bold">
              <Users className="w-4 h-4 text-emerald-600" />
              Party:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-colors"
              >
                -
              </button>
              <span className="w-7 text-center text-sm font-extrabold font-mono text-slate-900">
                {groupSize}
              </span>
              <button
                onClick={() => setGroupSize(groupSize + 1)}
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Paywall Tier Button */}
          <button
            onClick={onOpenPaywall}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-extrabold transition-all shadow-sm ${
              groupSize <= 2
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isSubscriber
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
            }`}
          >
            {groupSize <= 2 ? (
              <span>Couples: FREE</span>
            ) : isSubscriber ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Pass Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Pass Required
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
