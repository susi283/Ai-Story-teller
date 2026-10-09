import React from 'react';
import {
  Film,
  Sparkles,
  Compass,
  ArrowRight,
  Eye,
  BookOpen,
  Video,
  Layers,
  Volume2,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onStartCreation: () => void;
  onExploreExample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreation,
  onExploreExample,
}) => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Cinematic Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-900/25 via-violet-900/15 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[500px] bg-blue-900/10 blur-[140px] rounded-full" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[500px] bg-purple-900/10 blur-[140px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner">
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>Multimodal AI • Neural Narration • FFmpeg Cinematic Engine</span>
        </div>

        {/* Big Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]">
          Your memories deserve{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            more than a photo album.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          Upload 5 to 20 photographs. AI Photo Storyteller analyzes your visual moments, arranges them into
          thematic chapters, scripts an emotive narrative, generates studio voiceover, and renders a cinematic video.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartCreation}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Create My Story</span>
            <ArrowRight className="w-5 h-5 text-indigo-100" />
          </button>

          <button
            onClick={onExploreExample}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-medium text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 backdrop-blur-md flex items-center justify-center gap-2.5 transition-all"
          >
            <Compass className="w-5 h-5 text-violet-400" />
            <span>Explore an Example</span>
          </button>
        </div>

        {/* Hero Interactive Cinematic Preview Reel */}
        <div className="mt-16 sm:mt-20 w-full max-w-5xl rounded-2xl p-2 sm:p-3 glass-panel border border-indigo-500/20 shadow-2xl shadow-indigo-950/50 glow-ambient">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/90 group flex items-center justify-center">
            {/* Visual Reel Montage */}
            <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-70 group-hover:opacity-85 transition-opacity">
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-4 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Chapter I</span>
                <p className="text-sm font-serif-cinematic text-zinc-200 italic mt-1">"The road unwound before us..."</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-4 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Chapter II</span>
                <p className="text-sm font-serif-cinematic text-zinc-200 italic mt-1">"Breathless at the summit ridge."</p>
              </div>
              <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-black p-4 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Chapter III</span>
                <p className="text-sm font-serif-cinematic text-zinc-200 italic mt-1">"Raising glasses to tomorrow."</p>
              </div>
            </div>

            {/* Cinematic Center Overlay Banner */}
            <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center max-w-lg bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center mb-4 text-indigo-300">
                <Film className="w-7 h-7 text-indigo-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-cinematic font-bold text-white tracking-wide">
                From Still Photos to Living Cinema
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-light">
                Ken Burns Pan & Zoom • Dynamic Typography • Natural Studio TTS • Synchronized Audio
              </p>
              <button
                onClick={onExploreExample}
                className="mt-5 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
              >
                Watch 60s Demo Reel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm uppercase tracking-widest text-indigo-400 font-bold">Core Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Crafted for genuine emotional resonance
          </p>
          <p className="text-zinc-400 mt-3 text-base font-light">
            Each stage of the pipeline works in concert to preserve the honesty and emotion of your memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl glass-panel-hover transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Understand Memories</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 font-light">
              Gemini multimodal vision inspects your photographs without guessing sensitive personal identities. It
              understands settings, visual mood, key activities, and historical atmosphere to form an intelligent timeline.
            </p>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Multimodal Vision & Object Scene Parsing</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl glass-panel-hover transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generate Stories</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 font-light">
              Synthesizes a cohesive documentary narrative. Instead of disjointed image captions, the AI scripts
              connected chapters with poetic narration voiceovers and individualized subtitles that honor your story's context.
            </p>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-violet-300">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>Chapter Sequencing & Evocative Scripting</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl glass-panel-hover transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create Cinematic Videos</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 font-light">
              Renders real MP4 videos using FFmpeg and interactive Canvas. Subtle Ken Burns zoom, smooth
              crossfades, customized typography, voice narration, and mood-matched ambient music create a complete film.
            </p>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-blue-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>FFmpeg MP4 Export + High-Fidelity Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm uppercase tracking-widest text-indigo-400 font-bold">Simple 3-Step Process</h2>
          <p className="text-3xl font-extrabold text-white mt-2">How it works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-6 glass-panel rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload 5–20 Photos</h3>
            <p className="text-zinc-400 text-sm font-light">
              Drop in your photos. Reorder or remove frames, and add optional memory notes or people names.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 glass-panel rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Select Style & Voice</h3>
            <p className="text-zinc-400 text-sm font-light">
              Choose from 8 distinct storytelling styles, customize narration voices, music mood, and aspect ratio.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 glass-panel rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Review, Edit & Export</h3>
            <p className="text-zinc-400 text-sm font-light">
              Fine-tune chapter names, narration script, and captions. Preview in real-time or download a full MP4 video.
            </p>
          </div>
        </div>

        {/* Final CTA Strip */}
        <div className="mt-20 glass-panel p-10 rounded-3xl border border-indigo-500/30 text-center flex flex-col items-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to bring your memories to life?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-2 max-w-xl font-light">
            No signup required. Test immediately with sample photos or upload your own favorite collection.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={onStartCreation}
              className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Creating Now
            </button>
            <button
              onClick={onExploreExample}
              className="px-6 py-3.5 rounded-xl font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
            >
              View Example Story
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-zinc-900/80 bg-[#07080c] py-10 px-4 sm:px-6 lg:px-8 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-medium">
            <Film className="w-4 h-4 text-indigo-400" />
            <span>AI Photo Storyteller</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Multimodal Cinematic Studio</span>
          </div>
          <p className="text-zinc-500">
            Powered by Google Gemini 3.8 Flash, Gemini TTS, and FFmpeg Video Processing.
          </p>
        </div>
      </footer>
    </div>
  );
};
