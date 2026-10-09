import React from 'react';
import { StoryContext } from '../types/story';
import { FileText, Users, Calendar, MessageSquare, Globe, ShieldCheck } from 'lucide-react';

interface ContextStepProps {
  context: StoryContext;
  onChangeContext: (context: StoryContext) => void;
}

export const ContextStep: React.FC<ContextStepProps> = ({
  context,
  onChangeContext,
}) => {
  const updateField = (field: keyof StoryContext, value: string) => {
    onChangeContext({
      ...context,
      [field]: value,
    });
  };

  const languages = [
    { code: 'English', label: 'English (US / Global)' },
    { code: 'Spanish', label: 'Español (Spanish)' },
    { code: 'French', label: 'Français (French)' },
    { code: 'German', label: 'Deutsch (German)' },
    { code: 'Italian', label: 'Italiano (Italian)' },
    { code: 'Portuguese', label: 'Português (Portuguese)' },
    { code: 'Japanese', label: '日本語 (Japanese)' },
    { code: 'Chinese', label: '中文 (Simplified Chinese)' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Add Personal Context (Optional)</h2>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          Help the AI weave meaningful connections into the narrative. All fields are completely optional.
        </p>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Privacy Assurance:</span> We do not use facial recognition to
          identify individuals. Any names or milestone notes you provide here are voluntarily used solely to personalize
          your story script.
        </div>
      </div>

      <div className="space-y-6">
        {/* Story Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Story Title</span>
          </label>
          <input
            type="text"
            value={context.storyTitle}
            onChange={(e) => updateField('storyTitle', e.target.value)}
            placeholder="e.g. Summer Coastline Odyssey, The College Years, Five Decades Together"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* People Names */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span>Names of People in Photos (Voluntary)</span>
          </label>
          <input
            type="text"
            value={context.peopleNames}
            onChange={(e) => updateField('peopleNames', e.target.value)}
            placeholder="e.g. Maya, David, and Lucas (or 'The Martinez Family')"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            Voluntarily shared names help the narrator refer to your group naturally.
          </p>
        </div>

        {/* Important Dates or Events */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Important Dates, Years, or Milestones</span>
          </label>
          <input
            type="text"
            value={context.importantDatesEvents}
            onChange={(e) => updateField('importantDatesEvents', e.target.value)}
            placeholder="e.g. June 2024 Road Trip, Commencement Weekend, 10th Anniversary"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Additional Memories or Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Additional Memories or Key Moments</span>
          </label>
          <textarea
            rows={3}
            value={context.additionalMemories}
            onChange={(e) => updateField('additionalMemories', e.target.value)}
            placeholder="e.g. We broke down halfway to Big Sur, but found an incredible diner. The hike on day 3 was exhausting but the view made everyone cry."
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Preferred Language */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Story & Narration Language</span>
          </label>
          <select
            value={context.preferredLanguage}
            onChange={(e) => updateField('preferredLanguage', e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="bg-zinc-900 text-white">
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
