import React, { useEffect, useRef, useState } from 'react';
import { Chapter, GeneratedStory, PhotoItem } from '../types/story';
import { musicSynthesizer, base64ToAudioBlob } from '../utils/audioGenerator';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  SkipForward,
  SkipBack,
  Sparkles,
} from 'lucide-react';

interface CinematicPlayerProps {
  story: GeneratedStory;
  onPreviewChapter?: (chapter: Chapter) => void;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ story }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Time allocated per photo
  const secondsPerPhoto = 4.0;
  const totalStoryDuration = Math.max(12, story.photos.length * secondsPerPhoto);

  useEffect(() => {
    setDuration(totalStoryDuration);
  }, [story.photos.length, totalStoryDuration]);

  // Preload Images
  useEffect(() => {
    let isCancelled = false;
    const loaded: HTMLImageElement[] = [];

    const loadAll = async () => {
      for (const p of story.photos) {
        if (isCancelled) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = p.dataUrl;
        });
        loaded.push(img);
      }
      if (!isCancelled) {
        imagesRef.current = loaded;
        setIsLoaded(true);
        // Draw first frame
        renderFrameAtTime(0);
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [story.photos]);

  // Setup Background Music
  useEffect(() => {
    let musicBlobUrl = '';
    const setupMusic = async () => {
      try {
        const wavBlob = await musicSynthesizer.renderMusicWav(
          story.settings.musicMood,
          Math.min(180, totalStoryDuration + 10)
        );
        musicBlobUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(musicBlobUrl);
        audio.loop = true;
        audio.volume = isMuted ? 0 : story.settings.musicVolume;
        musicAudioRef.current = audio;
      } catch (err) {
        console.warn('Music synth fallback:', err);
      }
    };

    setupMusic();

    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.src = '';
      }
      if (musicBlobUrl) {
        URL.revokeObjectURL(musicBlobUrl);
      }
    };
  }, [story.settings.musicMood, totalStoryDuration]);

  // Volume updates
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = isMuted ? 0 : story.settings.musicVolume;
    }
    if (narrationAudioRef.current) {
      narrationAudioRef.current.volume = isMuted ? 0 : story.settings.narrationVolume;
    }
  }, [isMuted, story.settings.musicVolume, story.settings.narrationVolume]);

  // Render loop
  const renderFrameAtTime = (timeSec: number) => {
    const canvas = canvasRef.current;
    if (!canvas || imagesRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Determine current photo and progress
    const photoIdx = Math.min(
      imagesRef.current.length - 1,
      Math.max(0, Math.floor(timeSec / secondsPerPhoto))
    );
    const photoTime = timeSec % secondsPerPhoto;
    const progress = photoTime / secondsPerPhoto;

    setCurrentPhotoIndex(photoIdx);

    // Determine current chapter
    const currentPhoto = story.photos[photoIdx];
    const chIdx = story.chapters.findIndex((c) => c.photoIds.includes(currentPhoto?.id));
    if (chIdx !== -1 && chIdx !== currentChapterIndex) {
      setCurrentChapterIndex(chIdx);
    }

    const currentImg = imagesRef.current[photoIdx];
    if (!currentImg) return;

    // Clear background
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Background blur
    ctx.save();
    ctx.filter = 'blur(28px) brightness(0.35)';
    ctx.drawImage(currentImg, -20, -20, width + 40, height + 40);
    ctx.restore();

    // Transition handling (crossfade / fade in last 0.8s)
    const transitionDuration = 0.8;
    const isTransitioning =
      photoTime >= secondsPerPhoto - transitionDuration && photoIdx < imagesRef.current.length - 1;
    const nextImg = imagesRef.current[photoIdx + 1];

    if (isTransitioning && nextImg && story.settings.transitionStyle === 'crossfade') {
      const transProgress = (photoTime - (secondsPerPhoto - transitionDuration)) / transitionDuration;
      // Draw outgoing
      ctx.save();
      ctx.globalAlpha = 1 - transProgress;
      drawKenBurns(ctx, currentImg, width, height, progress, photoIdx % 3);
      ctx.restore();

      // Draw incoming
      ctx.save();
      ctx.globalAlpha = transProgress;
      drawKenBurns(ctx, nextImg, width, height, 0, (photoIdx + 1) % 3);
      ctx.restore();
    } else {
      ctx.save();
      drawKenBurns(ctx, currentImg, width, height, progress, photoIdx % 3);
      ctx.restore();
    }

    // Overlay cinematic vignette
    drawVignette(ctx, width, height);

    // Render Caption
    const captionText =
      currentPhoto?.customCaption ||
      story.chapters[chIdx]?.captions[currentPhoto?.id] ||
      currentPhoto?.analysis?.description ||
      '';

    if (captionText) {
      drawPlayerCaption(ctx, captionText, width, height, story.settings.captionStyle);
    }

    // Render Chapter Title pill
    const activeChapter = story.chapters[chIdx];
    if (activeChapter) {
      ctx.save();
      ctx.font = `700 ${Math.round(height * 0.024)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(129, 140, 248, 0.95)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.fillText(activeChapter.title.toUpperCase(), 32, 28);
      ctx.restore();
    }
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pausedTimeRef.current * 1000;
    }
    const elapsed = (timestamp - startTimeRef.current) / 1000;

    if (elapsed >= totalStoryDuration) {
      setIsPlaying(false);
      setCurrentTime(totalStoryDuration);
      renderFrameAtTime(totalStoryDuration);
      if (musicAudioRef.current) musicAudioRef.current.pause();
      return;
    }

    setCurrentTime(elapsed);
    renderFrameAtTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      pausedTimeRef.current = currentTime;
      startTimeRef.current = 0;
      setIsPlaying(false);
      if (musicAudioRef.current) musicAudioRef.current.pause();
      if (narrationAudioRef.current) narrationAudioRef.current.pause();
    } else {
      // Play
      if (currentTime >= totalStoryDuration) {
        setCurrentTime(0);
        pausedTimeRef.current = 0;
      } else {
        pausedTimeRef.current = currentTime;
      }
      startTimeRef.current = 0;
      setIsPlaying(true);
      if (musicAudioRef.current) musicAudioRef.current.play().catch(() => {});
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    pausedTimeRef.current = newTime;
    startTimeRef.current = 0;
    renderFrameAtTime(newTime);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const skipChapter = (direction: 'next' | 'prev') => {
    const targetIdx = direction === 'next' ? currentChapterIndex + 1 : currentChapterIndex - 1;
    if (targetIdx >= 0 && targetIdx < story.chapters.length) {
      // Find time of first photo in that chapter
      const targetChapter = story.chapters[targetIdx];
      const photoId = targetChapter.photoIds[0];
      const pIdx = story.photos.findIndex((p) => p.id === photoId);
      if (pIdx !== -1) {
        handleSeek(pIdx * secondsPerPhoto);
      }
    }
  };

  // Dimensions based on aspect ratio
  let aspectClass = 'aspect-[16/9] max-w-4xl';
  let canvasW = 1280;
  let canvasH = 720;
  if (story.settings.aspectRatio === '9:16') {
    aspectClass = 'aspect-[9/16] max-h-[700px] max-w-[393px]';
    canvasW = 720;
    canvasH = 1280;
  } else if (story.settings.aspectRatio === '1:1') {
    aspectClass = 'aspect-square max-w-[600px]';
    canvasW = 720;
    canvasH = 720;
  }

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Video Viewport Container */}
      <div
        ref={containerRef}
        className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden glass-panel border border-indigo-500/25 shadow-2xl bg-black flex items-center justify-center group`}
      >
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          className="w-full h-full object-contain"
        />

        {/* Center Big Play Button on Pause */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95"
            aria-label="Play video"
          >
            <Play className="w-7 h-7 fill-current ml-1" />
          </button>
        )}

        {/* Floating Controls Bar (Bottom Overlay) */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
          {/* Timeline scrub track */}
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => skipChapter('prev')}
                disabled={currentChapterIndex === 0}
                className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors"
                title="Previous Chapter"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipChapter('next')}
                disabled={currentChapterIndex === story.chapters.length - 1}
                className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors"
                title="Next Chapter"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <span className="font-mono text-zinc-300 text-[11px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-zinc-300 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-zinc-300 hover:text-white"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Chapter Markers & Narration Transcript Under Player */}
      <div className="w-full max-w-4xl glass-panel p-4 rounded-xl flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-white">
            {story.chapters[currentChapterIndex]?.title || 'Story Mode'}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">
            Photo {currentPhotoIndex + 1} of {story.photos.length}
          </span>
        </div>

        <div className="text-zinc-400 hidden sm:block">
          Style: <span className="text-indigo-300 uppercase font-semibold">{story.style}</span> • Mood:{' '}
          <span className="text-emerald-300 capitalize">{story.settings.musicMood}</span>
        </div>
      </div>
    </div>
  );
};

function drawKenBurns(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  prog: number,
  preset: number
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = w / h;
  let scale = imgAspect > canvasAspect ? h / img.naturalHeight : w / img.naturalWidth;

  let zoom = 1.0;
  let panX = 0;
  if (preset === 0) {
    zoom = 1.0 + prog * 0.12;
  } else if (preset === 1) {
    zoom = 1.12 - prog * 0.12;
  } else {
    zoom = 1.06;
    panX = (prog - 0.5) * 40;
  }

  const rw = img.naturalWidth * scale * zoom;
  const rh = img.naturalHeight * scale * zoom;
  const dx = (w - rw) / 2 + panX;
  const dy = (h - rh) / 2;

  ctx.drawImage(img, dx, dy, rw, rh);
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const bottomGrad = ctx.createLinearGradient(0, h - 160, 0, h);
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bottomGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, h - 160, w, 160);
}

function drawPlayerCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  style: string
) {
  ctx.save();
  const maxW = w * 0.82;
  const y = h - 60;

  if (style === 'elegant') {
    ctx.font = `italic 600 ${Math.round(h * 0.038)}px 'Playfair Display', Georgia, serif`;
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = 16;
    wrap(ctx, `“${text}”`, w / 2, y, maxW, Math.round(h * 0.048));
  } else if (style === 'bold') {
    ctx.font = `800 ${Math.round(h * 0.04)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 20;
    wrap(ctx, text.toUpperCase(), w / 2, y, maxW, Math.round(h * 0.05));
  } else {
    ctx.font = `500 ${Math.round(h * 0.032)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    wrap(ctx, text, w / 2, y, maxW, Math.round(h * 0.042));
  }
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxW && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  const startY = y - (lines.length - 1) * lh;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lh);
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
