import React from 'react';
import { GenerationProgressState } from '../types/story';
import {
  Sparkles,
  Camera,
  Layers,
  Calendar,
  PenTool,
  Type,
  Mic,
  Video,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

interface GenerationProgressProps {
  progress: GenerationProgressState;
  onCancel: () => void;
}

const STAGES = [
  { id: 'analyzing', label: 'Analyzing photographs', icon: Camera, desc: 'Gemini multimodal vision extracting visual scenes & objects' },
  { id: 'grouping', label: 'Grouping related memories', icon: Layers, desc: 'Clustering moments by visual coherence & context' },
  { id: 'sequencing', label: 'Building the timeline', icon: Calendar, desc: 'Establishing narrative progression across chapters' },
  { id: 'writing_story', label: 'Writing the story', icon: PenTool, desc: 'Scripting emotive narrative connecting the photographs' },
  { id: 'generating_captions', label: 'Generating captions', icon: Type, desc: 'Crafting poetic subtitles tailored to each scene' },
  { id: 'creating_narration', label: 'Creating narration', icon: Mic, desc: 'Gemini 3.8 Flash Lite TTS synthesizing audio voiceover' },
  { id: 'rendering_video', label: 'Rendering the video', icon: Video, desc: 'FFmpeg & Canvas composing Ken Burns pan-zoom, music & subtitles' },
];

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  onCancel,
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto">
      {/* Central Spinner & Glow */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute inset-0 w-28 h-28 rounded-full bg-indigo-600/20 blur-xl animate-pulse" />
        <div className="w-20 h-20 rounded-2xl glass-panel border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-2xl">
          <Loader2 className="w-9 h-9 animate-spin text-indigo-400" />
        </div>
      </div>

      {/* Main Title & Stage Info */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">
        Bringing Your Story to Life
      </h2>
      <p className="text-zinc-400 text-sm mt-2 text-center max-w-md font-light">
        {progress.detail || 'Multimodal AI is actively processing your photographs into a cinematic experience.'}
      </p>

      {/* Stage-based progress tracker */}
      <div className="w-full mt-10 glass-panel p-6 rounded-2xl space-y-3.5 border border-indigo-500/20 shadow-xl">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isDone = progress.stageIndex > idx + 1;
          const isCurrent = progress.stageIndex === idx + 1;
          const isPending = progress.stageIndex < idx + 1;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-indigo-950/60 border border-indigo-500/40 text-white'
                  : isDone
                  ? 'bg-zinc-900/30 text-zinc-300'
                  : 'opacity-40 text-zinc-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold truncate">{s.label}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 animate-pulse">
                      In Progress
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 truncate font-light mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Stage Progress Bar */}
      <div className="w-full mt-6 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Stage {progress.stageIndex} of 7</span>
          <span>{Math.round(progress.percent)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(5, progress.percent))}%` }}
          />
        </div>
      </div>

      {/* Cancellation Button */}
      <button
        type="button"
        onClick={onCancel}
        className="mt-8 px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center gap-2"
      >
        <XCircle className="w-4 h-4 text-zinc-400" />
        <span>Cancel Generation</span>
      </button>
    </div>
  );
};
