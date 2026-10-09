/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Chapter,
  GeneratedStory,
  GenerationProgressState,
  PhotoItem,
  StoryContext,
  StoryStyle,
  VideoSettings,
} from './types/story';
import { SAMPLE_STORY, SAMPLE_PHOTOS } from './data/sampleStory';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PhotoUploadStep } from './components/PhotoUploadStep';
import { ContextStep } from './components/ContextStep';
import { StyleStep } from './components/StyleStep';
import { CustomizeStep } from './components/CustomizeStep';
import { GenerationProgress } from './components/GenerationProgress';
import { StoryEditor } from './components/StoryEditor';
import { ResultsPage } from './components/ResultsPage';
import { ImageModal } from './components/ImageModal';
import {
  analyzePhotosApi,
  generateNarrationAudioApi,
  generateStoryApi,
  renderServerVideoApi,
} from './services/api';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'editor' | 'results'>('landing');
  const [workspaceStep, setWorkspaceStep] = useState<number>(1);

  // Form & Configuration State
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [context, setContext] = useState<StoryContext>({
    storyTitle: '',
    peopleNames: '',
    importantDatesEvents: '',
    additionalMemories: '',
    preferredLanguage: 'English',
  });
  const [selectedStyle, setSelectedStyle] = useState<StoryStyle>('cinematic');
  const [settings, setSettings] = useState<VideoSettings>({
    duration: '60s',
    narrationEnabled: true,
    voiceName: 'Kore',
    musicMood: 'uplifting',
    aspectRatio: '16:9',
    transitionStyle: 'crossfade',
    captionStyle: 'elegant',
    narrationVolume: 0.85,
    musicVolume: 0.35,
  });

  // Story & Generation State
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressState, setProgressState] = useState<GenerationProgressState>({
    stage: 'idle',
    stageIndex: 0,
    totalStages: 7,
    detail: '',
    percent: 0,
    isCancelled: false,
  });

  // Modal State
  const [inspectPhoto, setInspectPhoto] = useState<PhotoItem | null>(null);

  // Handlers for Navigation
  const handleStartCreation = () => {
    setCurrentView('workspace');
    setWorkspaceStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreExample = () => {
    setStory(SAMPLE_STORY);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setPhotos([]);
    setContext({
      storyTitle: '',
      peopleNames: '',
      importantDatesEvents: '',
      additionalMemories: '',
      preferredLanguage: 'English',
    });
    setStory(null);
    setWorkspaceStep(1);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generation Pipeline
  const handleGenerateStory = async () => {
    if (photos.length < 5) {
      alert('Please upload at least 5 photographs to generate a story.');
      return;
    }

    setIsGenerating(true);
    setProgressState({
      stage: 'analyzing',
      stageIndex: 1,
      totalStages: 7,
      detail: 'Multimodal Gemini vision analyzing photographs and scenes...',
      percent: 15,
      isCancelled: false,
    });

    try {
      // 1. Analyze photos
      const analyzedPhotos = await analyzePhotosApi(photos, (idx, total) => {
        setProgressState((prev) => ({
          ...prev,
          detail: `Analyzing photograph ${idx} of ${total}...`,
          percent: 10 + Math.floor((idx / total) * 15),
        }));
      });

      // 2. Grouping
      setProgressState({
        stage: 'grouping',
        stageIndex: 2,
        totalStages: 7,
        detail: 'Clustering related memories and visual themes...',
        percent: 30,
        isCancelled: false,
      });
      await new Promise((r) => setTimeout(r, 600));

      // 3. Sequencing
      setProgressState({
        stage: 'sequencing',
        stageIndex: 3,
        totalStages: 7,
        detail: 'Building the narrative chapters and chronology...',
        percent: 45,
        isCancelled: false,
      });
      await new Promise((r) => setTimeout(r, 600));

      // 4. Writing Story
      setProgressState({
        stage: 'writing_story',
        stageIndex: 4,
        totalStages: 7,
        detail: 'Gemini authoring connected cinematic story and chapter narratives...',
        percent: 60,
        isCancelled: false,
      });

      const storyRes = await generateStoryApi({
        photos: analyzedPhotos,
        context,
        style: selectedStyle,
        settings,
      });

      // 5. Generating Captions
      setProgressState({
        stage: 'generating_captions',
        stageIndex: 5,
        totalStages: 7,
        detail: 'Refining scene captions with chosen typography style...',
        percent: 75,
        isCancelled: false,
      });
      await new Promise((r) => setTimeout(r, 600));

      // 6. Creating Narration
      let updatedChapters: Chapter[] = storyRes.chapters;
      if (settings.narrationEnabled) {
        setProgressState({
          stage: 'creating_narration',
          stageIndex: 6,
          totalStages: 7,
          detail: `Gemini 3.8 Flash Lite TTS synthesizing audio voiceovers (${settings.voiceName})...`,
          percent: 85,
          isCancelled: false,
        });

        // Generate TTS for each chapter
        const chapterWithAudio: Chapter[] = [];
        for (const ch of storyRes.chapters) {
          const audioBase64 = await generateNarrationAudioApi(ch.narration, settings.voiceName);
          chapterWithAudio.push({
            ...ch,
            audioWavBase64: audioBase64 || undefined,
          });
        }
        updatedChapters = chapterWithAudio;
      }

      // 7. Video Rendering (Server or Client prep)
      setProgressState({
        stage: 'rendering_video',
        stageIndex: 7,
        totalStages: 7,
        detail: 'Composing cinematic video with Ken Burns motion, typography, and audio...',
        percent: 95,
        isCancelled: false,
      });

      const generatedStoryObj: GeneratedStory = {
        id: `story_${Date.now()}`,
        title: storyRes.title,
        summary: storyRes.summary,
        style: selectedStyle,
        chapters: updatedChapters,
        photos: analyzedPhotos,
        settings,
        createdAt: new Date().toISOString(),
      };

      // Try server FFmpeg render
      try {
        const renderRes = await renderServerVideoApi(generatedStoryObj);
        if (renderRes?.videoUrl) {
          generatedStoryObj.renderedVideoUrl = renderRes.videoUrl;
          generatedStoryObj.renderedVideoId = renderRes.videoId;
        }
      } catch (renderErr) {
        console.warn('Server video render optional note:', renderErr);
      }

      setStory(generatedStoryObj);
      setIsGenerating(false);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Generation failed:', err);
      setIsGenerating(false);
      alert('An error occurred during story generation. Please verify your photos and try again.');
    }
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView === 'editor' ? 'results' : currentView}
        onNavigateLanding={() => setCurrentView('landing')}
        onNavigateWorkspace={handleStartCreation}
        onLoadExample={handleExploreExample}
        activeStep={workspaceStep}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onStartCreation={handleStartCreation}
            onExploreExample={handleExploreExample}
          />
        )}

        {/* VIEW 2: WORKSPACE (MULTISTEP) */}
        {currentView === 'workspace' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {isGenerating ? (
              <GenerationProgress
                progress={progressState}
                onCancel={handleCancelGeneration}
              />
            ) : (
              <div className="space-y-10">
                {/* Stepper Navigation Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-5 max-w-4xl mx-auto">
                  {[
                    { num: 1, label: 'Upload Photos' },
                    { num: 2, label: 'Add Context' },
                    { num: 3, label: 'Choose Style' },
                    { num: 4, label: 'Video Settings' },
                  ].map((s) => (
                    <div
                      key={s.num}
                      onClick={() => {
                        // Allow clicking back or to current
                        if (s.num <= workspaceStep || (s.num === 2 && photos.length >= 5)) {
                          setWorkspaceStep(s.num);
                        }
                      }}
                      className={`flex items-center gap-2 cursor-pointer transition-all ${
                        workspaceStep === s.num
                          ? 'text-white font-bold'
                          : workspaceStep > s.num
                          ? 'text-indigo-400 font-medium'
                          : 'text-zinc-500 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          workspaceStep === s.num
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : workspaceStep > s.num
                            ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {s.num}
                      </div>
                      <span className="text-xs sm:text-sm hidden sm:inline">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Step Contents */}
                {workspaceStep === 1 && (
                  <PhotoUploadStep
                    photos={photos}
                    onChangePhotos={setPhotos}
                    onPreviewPhoto={setInspectPhoto}
                  />
                )}

                {workspaceStep === 2 && (
                  <ContextStep
                    context={context}
                    onChangeContext={setContext}
                  />
                )}

                {workspaceStep === 3 && (
                  <StyleStep
                    selectedStyle={selectedStyle}
                    onSelectStyle={setSelectedStyle}
                  />
                )}

                {workspaceStep === 4 && (
                  <CustomizeStep
                    settings={settings}
                    onChangeSettings={setSettings}
                  />
                )}

                {/* Stepper Action Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-900 max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (workspaceStep > 1) {
                        setWorkspaceStep(workspaceStep - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setCurrentView('landing');
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{workspaceStep === 1 ? 'Back to Home' : 'Previous Step'}</span>
                  </button>

                  {workspaceStep < 4 ? (
                    <button
                      type="button"
                      disabled={workspaceStep === 1 && photos.length < 5}
                      onClick={() => {
                        if (workspaceStep === 1 && photos.length < 5) {
                          alert('Please upload at least 5 photos before continuing.');
                          return;
                        }
                        setWorkspaceStep(workspaceStep + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-102 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateStory}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/35 transition-all hover:scale-102"
                    >
                      <Sparkles className="w-4 h-4 text-violet-200" />
                      <span>Generate Story</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: INTERACTIVE STORY EDITOR */}
        {currentView === 'editor' && story && (
          <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <StoryEditor
              story={story}
              onUpdateStory={setStory}
              onPreviewStory={() => setCurrentView('results')}
              onRegenerateStory={handleGenerateStory}
            />
          </div>
        )}

        {/* VIEW 4: RESULTS PAGE & CINEMATIC PLAYER */}
        {currentView === 'results' && story && (
          <div className="pt-8">
            <ResultsPage
              story={story}
              onEditStory={() => setCurrentView('editor')}
              onRegenerateStory={handleGenerateStory}
              onCreateNew={handleCreateNew}
            />
          </div>
        )}
      </main>

      {/* Image Zoom Modal */}
      <ImageModal
        photo={inspectPhoto}
        onClose={() => setInspectPhoto(null)}
      />
    </div>
  );
}
