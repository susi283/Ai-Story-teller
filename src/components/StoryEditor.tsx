import React, { useState } from 'react';
import { Chapter, GeneratedStory, PhotoItem, StoryStyle } from '../types/story';
import {
  Edit3,
  Sparkles,
  Layers,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCw,
  Save,
  Check,
  Type,
  BookOpen,
} from 'lucide-react';

interface StoryEditorProps {
  story: GeneratedStory;
  onUpdateStory: (updatedStory: GeneratedStory) => void;
  onPreviewStory: () => void;
  onRegenerateStory: () => void;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({
  story,
  onUpdateStory,
  onPreviewStory,
  onRegenerateStory,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentChapter = story.chapters[activeChapterIndex] || story.chapters[0];

  const updateTitle = (newTitle: string) => {
    onUpdateStory({ ...story, title: newTitle });
    setHasUnsavedChanges(true);
  };

  const updateSummary = (newSummary: string) => {
    onUpdateStory({ ...story, summary: newSummary });
    setHasUnsavedChanges(true);
  };

  const updateChapterTitle = (chIdx: number, newTitle: string) => {
    const updatedChapters = [...story.chapters];
    updatedChapters[chIdx] = { ...updatedChapters[chIdx], title: newTitle };
    onUpdateStory({ ...story, chapters: updatedChapters });
    setHasUnsavedChanges(true);
  };

  const updateChapterNarration = (chIdx: number, newNarration: string) => {
    const updatedChapters = [...story.chapters];
    updatedChapters[chIdx] = { ...updatedChapters[chIdx], narration: newNarration };
    onUpdateStory({ ...story, chapters: updatedChapters });
    setHasUnsavedChanges(true);
  };

  const updateCaption = (chIdx: number, photoId: string, newCaption: string) => {
    const updatedChapters = [...story.chapters];
    const targetChapter = { ...updatedChapters[chIdx] };
    targetChapter.captions = { ...targetChapter.captions, [photoId]: newCaption };
    updatedChapters[chIdx] = targetChapter;

    // Also update customCaption on the photo item
    const updatedPhotos = story.photos.map((p) =>
      p.id === photoId ? { ...p, customCaption: newCaption } : p
    );

    onUpdateStory({ ...story, chapters: updatedChapters, photos: updatedPhotos });
    setHasUnsavedChanges(true);
  };

  const removePhotoFromChapter = (photoId: string) => {
    const updatedChapters = story.chapters.map((ch) => ({
      ...ch,
      photoIds: ch.photoIds.filter((id) => id !== photoId),
    }));
    const updatedPhotos = story.photos.filter((p) => p.id !== photoId);
    onUpdateStory({ ...story, chapters: updatedChapters, photos: updatedPhotos });
    setHasUnsavedChanges(true);
  };

  const movePhotoInChapter = (photoId: string, direction: 'left' | 'right') => {
    const ch = currentChapter;
    if (!ch) return;
    const idx = ch.photoIds.indexOf(photoId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ch.photoIds.length) return;

    const newPhotoIds = [...ch.photoIds];
    const temp = newPhotoIds[idx];
    newPhotoIds[idx] = newPhotoIds[targetIdx];
    newPhotoIds[targetIdx] = temp;

    const updatedChapters = [...story.chapters];
    updatedChapters[activeChapterIndex] = { ...ch, photoIds: newPhotoIds };
    onUpdateStory({ ...story, chapters: updatedChapters });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Interactive Story Studio
            </span>
            {hasUnsavedChanges && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-saved
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Review and Refine Your Narrative
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRegenerateStory}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-violet-400" />
            <span>Regenerate Story</span>
          </button>

          <button
            type="button"
            onClick={onPreviewStory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Preview Video</span>
          </button>
        </div>
      </div>

      {/* Story Title & Overview Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Story Title
          </label>
          <input
            type="text"
            value={story.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full text-xl sm:text-2xl font-serif-cinematic font-bold bg-zinc-900/60 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Narrative Synopsis
          </label>
          <textarea
            rows={2}
            value={story.summary}
            onChange={(e) => updateSummary(e.target.value)}
            className="w-full text-sm text-zinc-300 bg-zinc-900/60 border border-zinc-700/80 rounded-xl p-3 focus:outline-none focus:border-indigo-400 resize-none font-light"
          />
        </div>
      </div>

      {/* Chapter Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
          {story.chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeChapterIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{ch.title || `Chapter ${idx + 1}`}</span>
              <span className="text-[10px] opacity-75 font-mono">({ch.photoIds.length} photos)</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Details */}
        {currentChapter && (
          <div className="glass-panel p-6 rounded-2xl space-y-6 border border-zinc-800">
            {/* Chapter Title & Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Chapter Title</label>
                <input
                  type="text"
                  value={currentChapter.title}
                  onChange={(e) => updateChapterTitle(activeChapterIndex, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Chapter Theme</label>
                <input
                  type="text"
                  value={currentChapter.theme || ''}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-sm"
                />
              </div>
            </div>

            {/* Chapter Voice Narration Script */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Voiceover Script for this Chapter
                </label>
                <span className="text-[11px] text-zinc-500">
                  Spoken by narrator voice: {story.settings.voiceName}
                </span>
              </div>
              <textarea
                rows={3}
                value={currentChapter.narration}
                onChange={(e) => updateChapterNarration(activeChapterIndex, e.target.value)}
                placeholder="Evocative narration voiceover..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:border-indigo-400 resize-none font-light leading-relaxed"
              />
            </div>

            {/* Photos & Captions in this Chapter */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Photographs & Captions in this Chapter
              </span>

              <div className="space-y-4">
                {currentChapter.photoIds.map((photoId, pIdx) => {
                  const photo = story.photos.find((p) => p.id === photoId);
                  if (!photo) return null;
                  const currentCaption = currentChapter.captions[photoId] || photo.customCaption || '';

                  return (
                    <div
                      key={photoId}
                      className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-black/60 border border-white/10">
                        <img
                          src={photo.dataUrl}
                          alt={photo.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                          #{pIdx + 1}
                        </div>
                      </div>

                      {/* Caption & Controls */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400 truncate max-w-xs">{photo.filename}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={pIdx === 0}
                              onClick={() => movePhotoInChapter(photoId, 'left')}
                              className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 text-zinc-300"
                              title="Move photo earlier in chapter"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={pIdx === currentChapter.photoIds.length - 1}
                              onClick={() => movePhotoInChapter(photoId, 'right')}
                              className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 text-zinc-300"
                              title="Move photo later in chapter"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removePhotoFromChapter(photoId)}
                              className="p-1 rounded hover:bg-red-900/50 text-zinc-400 hover:text-red-300 transition-colors"
                              title="Remove photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editable caption */}
                        <div className="relative">
                          <input
                            type="text"
                            value={currentCaption}
                            onChange={(e) => updateCaption(activeChapterIndex, photoId, e.target.value)}
                            placeholder="Enter caption for this scene..."
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950/80 border border-zinc-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        {/* AI Analysis hint if present */}
                        {photo.analysis && (
                          <p className="text-[11px] text-zinc-500 font-light truncate">
                            AI Scene Hint: {photo.analysis.sceneSetting} • Mood: {photo.analysis.visualMood}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
