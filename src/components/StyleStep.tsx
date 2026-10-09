import React from 'react';
import { StoryStyle } from '../types/story';
import {
  Heart,
  Film,
  Clock,
  Sparkles,
  Camera,
  Home,
  Users2,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';

interface StyleStepProps {
  selectedStyle: StoryStyle;
  onSelectStyle: (style: StoryStyle) => void;
}

interface StyleCardConfig {
  id: StoryStyle;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradientBg: string;
  sampleQuote: string;
}

const STYLE_CARDS: StyleCardConfig[] = [
  {
    id: 'cinematic',
    title: 'Cinematic',
    badge: 'Epic & Visual',
    description: 'Sweeping, grand narrative arcs with dramatic pacing and widescreen imagery poetry.',
    icon: Film,
    accentColor: 'text-indigo-400',
    gradientBg: 'from-indigo-950/60 to-zinc-900/90',
    sampleQuote: '“Across vast horizons, every frame echoes with timeless grandeur.”',
  },
  {
    id: 'emotional',
    title: 'Emotional',
    badge: 'Heartfelt & Deep',
    description: 'Poetic reflections on vulnerability, tenderness, and irreplaceable memories.',
    icon: Heart,
    accentColor: 'text-rose-400',
    gradientBg: 'from-rose-950/60 to-zinc-900/90',
    sampleQuote: '“Moments that quietly shaped who we are, etched forever in our hearts.”',
  },
  {
    id: 'nostalgic',
    title: 'Nostalgic',
    badge: 'Golden Hours',
    description: 'Warm retrospective warmth looking back at seasons past with wistful tenderness.',
    icon: Clock,
    accentColor: 'text-amber-400',
    gradientBg: 'from-amber-950/60 to-zinc-900/90',
    sampleQuote: '“Looking back through the amber glow of days that felt endless.”',
  },
  {
    id: 'fun_energetic',
    title: 'Fun and Energetic',
    badge: 'Vibrant & Playful',
    description: 'Fast-paced, joyful, celebrating unfiltered laughs, spontaneous detours, and high energy.',
    icon: Sparkles,
    accentColor: 'text-yellow-400',
    gradientBg: 'from-yellow-950/60 to-zinc-900/90',
    sampleQuote: '“No roadmaps, zero hesitation—just pure unstoppable joy.”',
  },
  {
    id: 'documentary',
    title: 'Documentary',
    badge: 'Journalistic & Real',
    description: 'Grounded, authentic storytelling that chronicles milestones with realistic depth.',
    icon: Camera,
    accentColor: 'text-sky-400',
    gradientBg: 'from-sky-950/60 to-zinc-900/90',
    sampleQuote: '“The tangible record of human progress, grit, and genuine connection.”',
  },
  {
    id: 'family_memories',
    title: 'Family Memories',
    badge: 'Generational Love',
    description: 'Honoring heritage, shared dinners, reunions, children growing up, and legacy.',
    icon: Home,
    accentColor: 'text-emerald-400',
    gradientBg: 'from-emerald-950/60 to-zinc-900/90',
    sampleQuote: '“The roots that ground us, the branches that shelter our tomorrows.”',
  },
  {
    id: 'friendship_journey',
    title: 'Friendship Journey',
    badge: 'Companionship',
    description: 'Inside jokes, loyalty, road trips, and bonds that stood through thick and thin.',
    icon: Users2,
    accentColor: 'text-violet-400',
    gradientBg: 'from-violet-950/60 to-zinc-900/90',
    sampleQuote: '“Through every late night and crazy scheme, side by side.”',
  },
  {
    id: 'school_to_college',
    title: 'School to College',
    badge: 'Growth & Graduation',
    description: 'From classroom desks to lecture halls and tossing caps into the bright sky.',
    icon: GraduationCap,
    accentColor: 'text-fuchsia-400',
    gradientBg: 'from-fuchsia-950/60 to-zinc-900/90',
    sampleQuote: '“From nervous first days to stepping boldly into the uncharted horizon.”',
  },
];

export const StyleStep: React.FC<StyleStepProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Choose Story Style</h2>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          The style guides Gemini’s narrative tone, sentence cadence, chapter themes, and soundtrack synergy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STYLE_CARDS.map((style) => {
          const isSelected = selectedStyle === style.id;
          const Icon = style.icon;

          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-400 bg-gradient-to-b from-indigo-950/80 via-zinc-900/90 to-black shadow-xl shadow-indigo-600/20 scale-[1.02]'
                  : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70'
              }`}
            >
              {/* Header Icon + Selection Indicator */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 ${style.accentColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-700" />
                )}
              </div>

              {/* Title & Badge */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{style.title}</h3>
                </div>
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-300 mt-1">
                  {style.badge}
                </span>

                <p className="text-zinc-400 text-xs leading-relaxed mt-2.5 font-light">
                  {style.description}
                </p>
              </div>

              {/* Sample Quote Preview */}
              <div className="mt-5 pt-3 border-t border-white/5">
                <p className="text-[11px] font-serif-cinematic italic text-zinc-300 line-clamp-2">
                  {style.sampleQuote}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
