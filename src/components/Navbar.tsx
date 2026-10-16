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
  const isPaywalled = (groupSize >= 3 || selectedAudience === 'Corporate') && !isSubscriber;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b-2 border-emerald-500/20 px-4 sm:px-8 py-4 transition-colors shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 font-extrabold flex-shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Trip Hop
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Singapore
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-300">
                Outing Planner • Weather Contingency • Transparent Costs
              </p>
            </div>
          </div>

          {/* Quick weather badge on mobile */}
          <button
            onClick={() => setSimulatedRain(!simulatedRain)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isRain
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {isRain ? <CloudRain className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            <span>{isRain ? 'Rain Alert' : 'Fair Sky'}</span>
          </button>
        </div>

        {/* Primary Tabs (Simplified & Bigger Text) */}
        <div className="flex items-center justify-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border-2 border-slate-800 text-sm font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Explore Activities
          </button>

          <button
            onClick={() => setActiveTab('foursquare')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'foursquare'
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4 text-pink-400" />
            <span>Foursquare Food</span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'itinerary'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary</span>
            {itineraryCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-xs font-mono font-extrabold ${
                activeTab === 'itinerary' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
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
            className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
              simulatedRain
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Toggle rain simulation to test secondary sheltered itinerary (Sub-goal 4)"
          >
            {simulatedRain ? (
              <>
                <CloudRain className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Simulating Rain Protocol</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                <span>Simulate Rain Protocol</span>
              </>
            )}
          </button>

          {/* Group Pax Stepper */}
          <div className="flex items-center bg-slate-900 border-2 border-slate-800 rounded-2xl px-3 py-1.5 gap-2.5">
            <span className="text-xs text-slate-300 flex items-center gap-1.5 font-bold">
              <Users className="w-4 h-4 text-emerald-400" />
              Party:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 text-xs font-extrabold"
              >
                -
              </button>
              <span className="w-7 text-center text-sm font-extrabold font-mono text-white">
                {groupSize}
              </span>
              <button
                onClick={() => setGroupSize(groupSize + 1)}
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 text-xs font-extrabold"
              >
                +
              </button>
            </div>
          </div>

          {/* Paywall Tier Button */}
          <button
            onClick={onOpenPaywall}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-extrabold transition-all ${
              groupSize <= 2
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : isSubscriber
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse shadow-md shadow-amber-950/30'
            }`}
          >
            {groupSize <= 2 ? (
              <span>Couples: FREE</span>
            ) : isSubscriber ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Pass Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Paywall: Pass Required
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
