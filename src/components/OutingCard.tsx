import React from 'react';
import { MapPin, Clock, Plus, Check, Shield, Sun, Sparkles, Building2 } from 'lucide-react';
import { OutingItem } from '../types.ts';

interface OutingCardProps {
  item: OutingItem;
  groupSize: number;
  isAdded: boolean;
  onToggleAdd: (item: OutingItem) => void;
  isRain: boolean;
}

export const OutingCard: React.FC<OutingCardProps> = ({
  item,
  groupSize,
  isAdded,
  onToggleAdd,
  isRain,
}) => {
  const totalPrice = item.pricePerPax * groupSize;
  const isOutdoorRisk = isRain && item.type === 'outdoor';

  return (
    <div
      className={`group rounded-3xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isOutdoorRisk
          ? 'bg-slate-900/60 border-amber-500/60 ring-2 ring-amber-500/30'
          : isAdded
          ? 'bg-slate-900/90 border-emerald-400 shadow-xl shadow-emerald-950/40'
          : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-slate-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-md">
            {item.category}
          </span>

          <div className="flex items-center gap-1.5">
            {item.isTeamBuildingFavorite && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Team Pick</span>
              </span>
            )}

            {item.type === 'outdoor' ? (
              <span
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold backdrop-blur-md border flex items-center gap-1.5 ${
                  isRain
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500 animate-pulse'
                    : 'bg-slate-950/90 text-slate-200 border-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>{isRain ? 'Rain Exposed' : 'Outdoor'}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-slate-950/90 backdrop-blur-md text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.type === 'indoor' ? 'Indoor Cooled' : 'Sheltered'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Big Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="text-xs text-slate-300 font-mono font-bold">Price per pax</div>
            <div className="text-2xl font-extrabold font-display text-white">
              {item.pricePerPax === 0 ? (
                <span className="text-emerald-400 drop-shadow">FREE</span>
              ) : (
                <span className="drop-shadow">S${item.pricePerPax}</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-300 font-mono font-bold block">
              Group ({groupSize} pax)
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-300 drop-shadow">
              {totalPrice === 0 ? 'S$0 Total' : `S$${totalPrice} Total`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content with Bigger Text */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-extrabold text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
            {item.name}
          </h3>

          <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Area & Transit Info */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{item.area}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 truncate">{item.mrtStation}</span>
          </div>

          {/* Key Highlights */}
          <div className="space-y-1.5 mb-4">
            {item.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t-2 border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{item.durationHours} hrs</span>
          </div>

          <button
            onClick={() => onToggleAdd(item)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all shadow-md active:scale-95 ${
              isAdded
                ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 hover:bg-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Plan</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Outing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
