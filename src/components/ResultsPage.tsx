import React, { useState } from 'react';
import { Chapter, GeneratedStory } from '../types/story';
import { CinematicPlayer } from './CinematicPlayer';
import { ClientVideoRenderer } from '../utils/videoRenderer';
import {
  Download,
  Edit,
  RotateCw,
  PlusCircle,
  Share2,
  Check,
  Film,
  BookOpen,
  Volume2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ResultsPageProps {
  story: GeneratedStory;
  onEditStory: () => void;
  onRegenerateStory: () => void;
  onCreateNew: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  story,
  onEditStory,
  onRegenerateStory,
  onCreateNew,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStage, setExportStage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'transcript' | 'chapters'>('video');

  const handleDownloadMp4 = async () => {
    // If server rendered video exists, download directly
    if (story.renderedVideoUrl) {
      window.location.href = story.renderedVideoUrl;
      return;
    }

    // Otherwise render client-side video file and download
    setIsExporting(true);
    setExportProgress(5);
    setExportStage('Initializing video render pipeline...');

    try {
      const blob = await ClientVideoRenderer.renderVideoBlob(story, (p) => {
        setExportProgress(p.percent);
        setExportStage(p.stage);
      });

      // Trigger actual file download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      a.download = `${safeTitle || 'ai-photo-story'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('Error rendering video for download:', err);
      alert('Could not render video file in this browser. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/25 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Story Generated Successfully
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {story.style.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-cinematic font-bold text-white tracking-tight leading-tight">
            {story.title}
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl font-light leading-relaxed">
            {story.summary}
          </p>
        </div>

        {/* Top Action CTAs */}
        <div className="flex flex-wrap sm:flex-col items-stretch gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadMp4}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering {Math.round(exportProgress)}%...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download MP4 Video</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onEditStory}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-violet-400" />
            <span>Edit Story Script</span>
          </button>
        </div>
      </div>

      {/* Render Progress Overlay if exporting */}
      {isExporting && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-3 bg-indigo-950/40">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>{exportStage}</span>
            </span>
            <span className="text-indigo-300 font-mono">{Math.round(exportProgress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 font-light">
            Rendering high-resolution cinematic video with pan-and-zoom Ken Burns motion, typography captions, and audio sync.
          </p>
        </div>
      )}

      {/* Main Cinematic Video Player */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Cinematic Video Player</h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{story.photos.length} Photographs</span>
            <span>•</span>
            <span>{story.chapters.length} Chapters</span>
            <span>•</span>
            <span className="capitalize">{story.settings.aspectRatio}</span>
          </div>
        </div>

        <CinematicPlayer story={story} />
      </div>

      {/* Chapter Breakdown & Transcripts Drawer */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-bold text-white">Story Chapters & Transcript</h3>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Story'}</span>
          </button>
        </div>

        <div className="space-y-6">
          {story.chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-base text-white">{ch.title}</h4>
                </div>
                {ch.theme && (
                  <span className="text-xs text-indigo-300 font-medium px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/20 w-fit">
                    {ch.theme}
                  </span>
                )}
              </div>

              {/* Narration voiceover text */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Narration Voiceover:</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 font-serif-cinematic italic leading-relaxed">
                  "{ch.narration}"
                </p>
              </div>

              {/* Photos in this chapter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {ch.photoIds.map((pid, pIdx) => {
                  const p = story.photos.find((item) => item.id === pid);
                  if (!p) return null;
                  const cap = ch.captions[pid] || p.customCaption || '';

                  return (
                    <div
                      key={pid}
                      className="group relative rounded-xl overflow-hidden glass-panel border border-zinc-800 bg-black/60 flex flex-col"
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <img
                          src={p.dataUrl}
                          alt={p.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2 bg-zinc-950/80 border-t border-zinc-900">
                        <p className="text-[10px] text-zinc-300 line-clamp-2 leading-tight">
                          {cap}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-900">
        <button
          onClick={onCreateNew}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-indigo-400" />
          <span>Create Another Story</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRegenerateStory}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4 text-violet-400" />
            <span>Regenerate Narrative</span>
          </button>

          <button
            onClick={handleDownloadMp4}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
