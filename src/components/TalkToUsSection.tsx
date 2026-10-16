import React, { useState } from 'react';
import { MessageSquare, Users, Sparkles, Send, ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { DisqusErrorBoundary } from './DisqusErrorBoundary.tsx';

export const TalkToUsSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'general' | 'teambuilding' | 'weather'>('general');

  const topics = {
    general: {
      id: 'triphop-general-feedback',
      title: 'Trip Hop Community & Feedback Hub',
      description: 'Share your Singapore outing experiences, suggest new hidden gems, or leave ideas for the dev team.',
    },
    teambuilding: {
      id: 'triphop-teambuilding-discussion',
      title: 'Corporate Team Building & Retreat Ideas',
      description: 'Discuss team bonding venues (iFly Sentosa, Lost SG, dragon boating) and ask corporate planning questions.',
    },
    weather: {
      id: 'triphop-rain-contingency-forum',
      title: 'Rain Protocols & Sheltered Excursions',
      description: 'Recommend your favorite rainy-day indoor attractions in Singapore.',
    },
  };

  const currentTopic = topics[activeTopic];
  const disqusShortname = 'vibe-coding-5';

  const disqusConfig = {
    url: typeof window !== 'undefined' ? `${window.location.origin}/talk-to-us#${currentTopic.id}` : `https://triphop-singapore.app/talk-to-us#${currentTopic.id}`,
    identifier: currentTopic.id,
    title: currentTopic.title,
    language: 'en',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border-2 border-emerald-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display font-extrabold text-2xl text-slate-900">
                  Talk to Us &amp; Community Forum
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-300 shadow-xs">
                  Disqus Community
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <DisqusErrorBoundary>
                    <CommentCount shortname={disqusShortname} config={disqusConfig}>
                      Comments
                    </CommentCount>
                  </DisqusErrorBoundary>
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Have questions about Singapore itineraries, team building packages, or weather backups?
                Join the discussion or drop us your thoughts below!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-slate-500">
              Shortname: <strong className="text-emerald-700">{disqusShortname}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTopic('general')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 ${
            activeTopic === 'general'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>General Outing Feedback</span>
        </button>

        <button
          onClick={() => setActiveTopic('teambuilding')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 ${
            activeTopic === 'teambuilding'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Corporate Team Building</span>
        </button>

        <button
          onClick={() => setActiveTopic('weather')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border-2 ${
            activeTopic === 'weather'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Rain Protocols &amp; Sheltered Spots</span>
        </button>
      </div>

      {/* Active Topic Description Card */}
      <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-base text-slate-900">
            {currentTopic.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {currentTopic.description}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-xs font-mono font-bold text-slate-500 block">Thread ID:</span>
          <span className="text-xs font-mono font-extrabold text-emerald-700">{currentTopic.id}</span>
        </div>
      </div>

      {/* Disqus Discussion Embed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-xl min-h-[400px]">
        <DisqusErrorBoundary>
          <DiscussionEmbed
            key={currentTopic.id}
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </DisqusErrorBoundary>
      </div>
    </div>
  );
};
