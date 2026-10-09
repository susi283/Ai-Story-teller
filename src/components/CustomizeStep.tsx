import React from 'react';
import {
  AspectRatio,
  CaptionStyle,
  MusicMood,
  TransitionStyle,
  VideoDuration,
  VideoSettings,
} from '../types/story';
import {
  Clock,
  Mic,
  Music,
  Tv,
  Sparkles,
  Type,
  Volume2,
  Sliders,
} from 'lucide-react';

interface CustomizeStepProps {
  settings: VideoSettings;
  onChangeSettings: (settings: VideoSettings) => void;
}

export const CustomizeStep: React.FC<CustomizeStepProps> = ({
  settings,
  onChangeSettings,
}) => {
  const update = <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  const voices: { id: VideoSettings['voiceName']; name: string; desc: string; persona: string }[] = [
    { id: 'Kore', name: 'Kore', desc: 'Warm, natural & emotive', persona: 'Docu-narrator' },
    { id: 'Puck', name: 'Puck', desc: 'Engaging, bright & lively', persona: 'Upbeat guide' },
    { id: 'Charon', name: 'Charon', desc: 'Deep, resonant & cinematic', persona: 'Dramatic voice' },
    { id: 'Fenrir', name: 'Fenrir', desc: 'Authoritative, calm & deep', persona: 'Storyteller' },
    { id: 'Zephyr', name: 'Zephyr', desc: 'Soft, reflective & intimate', persona: 'Poetic voice' },
  ];

  const moods: { id: MusicMood; label: string; desc: string }[] = [
    { id: 'peaceful', label: 'Peaceful', desc: 'Gentle piano & soft acoustic chords' },
    { id: 'emotional', label: 'Emotional', desc: 'Cinematic slow strings & thoughtful swells' },
    { id: 'uplifting', label: 'Uplifting', desc: 'Inspiring progression, warmth & hope' },
    { id: 'energetic', label: 'Energetic', desc: 'Rhythmic pulse, upbeat percussion vibes' },
  ];

  const aspectRatios: { id: AspectRatio; label: string; desc: string; iconSize: string }[] = [
    { id: '16:9', label: '16:9 Landscape', desc: 'Widescreen for TV, PC & YouTube', iconSize: 'w-8 h-4.5' },
    { id: '9:16', label: '9:16 Vertical', desc: 'Stories, Reels & Shorts format', iconSize: 'w-4.5 h-8' },
    { id: '1:1', label: '1:1 Square', desc: 'Classic Instagram & feed posts', iconSize: 'w-6 h-6' },
  ];

  const transitions: { id: TransitionStyle; label: string; desc: string }[] = [
    { id: 'crossfade', label: 'Crossfade', desc: 'Seamless cinematic dissolve' },
    { id: 'fade', label: 'Cinematic Fade', desc: 'Gentle dip to black between chapters' },
    { id: 'cut', label: 'Simple Cut', desc: 'Clean, direct photographic transition' },
  ];

  const captionStyles: { id: CaptionStyle; label: string; desc: string; preview: string }[] = [
    { id: 'elegant', label: 'Elegant', desc: 'Italic serif typography with soft gold illumination', preview: '“Moments preserved in amber”' },
    { id: 'minimal', label: 'Minimal', desc: 'Clean modern sans-serif bottom bar', preview: 'Moments preserved in amber' },
    { id: 'bold', label: 'Bold', desc: 'Impactful high-contrast center title', preview: 'MOMENTS PRESERVED IN AMBER' },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Customize Video & Audio</h2>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          Fine-tune timing, narration voice, background music, layout aspect ratio, and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Target Duration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Target Story Duration</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Controls pacing per photograph and length of chapter narrations.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {(['60s', '2m', '5m'] as VideoDuration[]).map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => update('duration', dur)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  settings.duration === dur
                    ? 'border-indigo-400 bg-indigo-950/60 text-white shadow-md shadow-indigo-600/20'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {dur === '60s' ? '60 Seconds' : dur === '2m' ? '2 Minutes' : '5 Minutes'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Aspect Ratio */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Tv className="w-5 h-5 text-violet-400" />
            <span>Aspect Ratio & Framing</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Portrait and landscape photos are tasteful framed without distortion.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {aspectRatios.map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => update('aspectRatio', ar.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  settings.aspectRatio === ar.id
                    ? 'border-violet-400 bg-violet-950/60 text-white shadow-md shadow-violet-600/20'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className={`border border-current rounded-sm mb-2 ${ar.iconSize}`} />
                <span className="text-xs font-bold">{ar.label.split(' ')[0]}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">{ar.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Voice Narration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Mic className="w-5 h-5 text-blue-400" />
              <span>Voice Narration</span>
            </div>
            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.narrationEnabled}
                onChange={(e) => update('narrationEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <p className="text-xs text-zinc-400 font-light">
            {settings.narrationEnabled
              ? 'Gemini 3.8 Flash Lite TTS narrates each chapter with emotive cadence.'
              : 'Narration disabled. Video will rely on captions and background score.'}
          </p>

          {settings.narrationEnabled && (
            <div className="space-y-3 pt-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
                Select Narrator Voice
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {voices.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => update('voiceName', v.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      settings.voiceName === v.id
                        ? 'border-indigo-400 bg-indigo-950/60 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{v.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{v.persona}</div>
                  </button>
                ))}
              </div>

              {/* Narration Volume */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Narration Volume</span>
                  <span>{Math.round(settings.narrationVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.narrationVolume}
                  onChange={(e) => update('narrationVolume', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Background Music */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Music className="w-5 h-5 text-emerald-400" />
            <span>Background Music Mood</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Royalty-free ambient soundtrack synthesized to synchronize with chapter pacing.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => update('musicMood', m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.musicMood === m.id
                    ? 'border-emerald-400 bg-emerald-950/60 text-white shadow-md shadow-emerald-600/20'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="font-bold text-xs">{m.label}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Music Volume */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Music Volume</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => update('musicVolume', parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* 5. Transition Style */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Transition Style</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {transitions.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => update('transitionStyle', t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.transitionStyle === t.id
                    ? 'border-amber-400 bg-amber-950/60 text-white'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-[10px] text-zinc-400 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Caption Style */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Type className="w-5 h-5 text-rose-400" />
            <span>Caption Typography Style</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {captionStyles.map((cs) => (
              <button
                key={cs.id}
                type="button"
                onClick={() => update('captionStyle', cs.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.captionStyle === cs.id
                    ? 'border-rose-400 bg-rose-950/60 text-white'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{cs.label}</div>
                <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{cs.preview}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
