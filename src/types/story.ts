export type StoryStyle =
  | 'emotional'
  | 'cinematic'
  | 'nostalgic'
  | 'fun_energetic'
  | 'documentary'
  | 'family_memories'
  | 'friendship_journey'
  | 'school_to_college';

export type MusicMood = 'emotional' | 'peaceful' | 'uplifting' | 'energetic';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type TransitionStyle = 'fade' | 'crossfade' | 'cut';
export type CaptionStyle = 'elegant' | 'minimal' | 'bold';
export type VideoDuration = '60s' | '2m' | '5m';

export interface PhotoItem {
  id: string;
  dataUrl: string; // Base64 data URL or remote URL
  filename: string;
  sizeBytes: number;
  mimeType: string;
  order: number;
  // AI analysis metadata (populated after analysis)
  analysis?: PhotoAnalysis;
  customCaption?: string;
  durationSeconds?: number;
}

export interface PhotoAnalysis {
  description: string;
  objectsActivities: string[];
  sceneSetting: string;
  ageGroupOrEra?: string;
  visualMood: string;
  potentialChapter?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface StoryContext {
  storyTitle: string;
  peopleNames: string;
  importantDatesEvents: string;
  additionalMemories: string;
  preferredLanguage: string;
}

export interface VideoSettings {
  duration: VideoDuration;
  narrationEnabled: boolean;
  voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  musicMood: MusicMood;
  aspectRatio: AspectRatio;
  transitionStyle: TransitionStyle;
  captionStyle: CaptionStyle;
  narrationVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
}

export interface Chapter {
  id: string;
  title: string;
  theme?: string;
  photoIds: string[];
  narration: string;
  captions: Record<string, string>; // photoId -> caption
  suggestedMusicMood?: MusicMood;
  audioWavBase64?: string; // Generated TTS audio for this chapter narration
}

export interface GeneratedStory {
  id: string;
  title: string;
  summary: string;
  style: StoryStyle;
  chapters: Chapter[];
  photos: PhotoItem[];
  settings: VideoSettings;
  renderedVideoUrl?: string; // Server MP4 URL or local Blob URL
  renderedVideoId?: string;
  createdAt: string;
}

export type GenerationStage =
  | 'idle'
  | 'analyzing'
  | 'grouping'
  | 'sequencing'
  | 'writing_story'
  | 'generating_captions'
  | 'creating_narration'
  | 'rendering_video'
  | 'complete'
  | 'error';

export interface GenerationProgressState {
  stage: GenerationStage;
  stageIndex: number;
  totalStages: number;
  detail: string;
  percent: number;
  isCancelled: boolean;
}
