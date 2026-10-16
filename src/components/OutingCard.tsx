import React from 'react';
import { MapPin, Clock, Plus, Check, Shield, Sun, Sparkles } from 'lucide-react';
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
      className={`group rounded-3xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isOutdoorRisk
          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200'
          : isAdded
          ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-900/10'
          : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200 shadow-sm">
            {item.category}
          </span>

          <div className="flex items-center gap-1.5">
            {item.isTeamBuildingFavorite && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Team Pick</span>
              </span>
            )}

            {item.type === 'outdoor' ? (
              <span
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold backdrop-blur-md border flex items-center gap-1.5 ${
                  isRain
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                    : 'bg-white/95 text-slate-800 border-slate-200 shadow-sm'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{isRain ? 'Rain Exposed' : 'Outdoor'}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-white/95 backdrop-blur-md text-cyan-800 border border-cyan-200 shadow-sm flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-600" />
                <span>{item.type === 'indoor' ? 'Indoor Cooled' : 'Sheltered'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Big Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-xs text-slate-200 font-mono font-bold drop-shadow">Price per pax</div>
            <div className="text-2xl font-extrabold font-display drop-shadow">
              {item.pricePerPax === 0 ? (
                <span className="text-emerald-300">FREE</span>
              ) : (
                <span>S${item.pricePerPax}</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-200 font-mono font-bold block drop-shadow">
              Group ({groupSize} pax)
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-300 drop-shadow">
              {totalPrice === 0 ? 'S$0 Total' : `S$${totalPrice} Total`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2">
            {item.name}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Area & Transit Info */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{item.area}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 truncate">{item.mrtStation}</span>
          </div>

          {/* Key Highlights */}
          <div className="space-y-1.5 mb-4">
            {item.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} className="text-xs font-medium text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{item.durationHours} hrs</span>
          </div>

          <button
            onClick={() => onToggleAdd(item)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500 hover:bg-emerald-100'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/25'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
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
