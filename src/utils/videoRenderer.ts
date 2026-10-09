import { AspectRatio, CaptionStyle, GeneratedStory, PhotoItem, TransitionStyle } from '../types/story';

export interface RenderProgressCallback {
  (progress: { percent: number; currentPhotoIndex: number; totalPhotos: number; stage: string }): void;
}

export class ClientVideoRenderer {
  public static async renderVideoBlob(
    story: GeneratedStory,
    onProgress?: RenderProgressCallback
  ): Promise<Blob> {
    const { settings, photos, chapters } = story;

    // Resolve resolution based on aspect ratio
    let width = 1280;
    let height = 720;
    if (settings.aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (settings.aspectRatio === '1:1') {
      width = 720;
      height = 720;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    // Preload all photo HTMLImageElements
    onProgress?.({ percent: 5, currentPhotoIndex: 0, totalPhotos: photos.length, stage: 'Loading images...' });
    const loadedImages: HTMLImageElement[] = await Promise.all(
      photos.map((p) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => {
            // Create fallback canvas if image fails to load
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 800;
            fallbackCanvas.height = 600;
            const fctx = fallbackCanvas.getContext('2d');
            if (fctx) {
              fctx.fillStyle = '#1e1b4b';
              fctx.fillRect(0, 0, 800, 600);
              fctx.fillStyle = '#ffffff';
              fctx.font = '24px sans-serif';
              fctx.fillText('Memory Photo', 300, 300);
            }
            const fallbackImg = new Image();
            fallbackImg.src = fallbackCanvas.toDataURL();
            fallbackImg.onload = () => resolve(fallbackImg);
          };
          img.src = p.dataUrl;
        });
      })
    );

    // Audio setup: Prepare mixed audio track (background music + narration)
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();

    // Map photoId to caption
    const photoCaptions: Record<string, string> = {};
    for (const ch of chapters) {
      for (const [pid, caption] of Object.entries(ch.captions)) {
        photoCaptions[pid] = caption;
      }
    }

    // Calculate timing per photo based on total duration setting
    let totalTargetSeconds = 60;
    if (settings.duration === '2m') totalTargetSeconds = 120;
    if (settings.duration === '5m') totalTargetSeconds = 300;

    // Allocate 3 to 6 seconds per photo
    const secondsPerPhoto = Math.max(3.5, Math.min(8, totalTargetSeconds / Math.max(1, photos.length)));
    const fps = 30;
    const framesPerPhoto = Math.floor(secondsPerPhoto * fps);
    const transitionFrames = settings.transitionStyle === 'cut' ? 0 : Math.floor(0.8 * fps);

    // Setup MediaStream from canvas and combine with audio
    const canvasStream = canvas.captureStream(fps);
    const combinedTracks = [...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()];
    const combinedStream = new MediaStream(combinedTracks);

    // Determine supported mime types for MediaRecorder
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) {
      mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    }

    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    const recordingPromise = new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        resolve(finalBlob);
      };
    });

    mediaRecorder.start(100);

    // Render loop across all photos
    const totalFrames = photos.length * framesPerPhoto;
    let globalFrame = 0;

    for (let i = 0; i < photos.length; i++) {
      const currentImg = loadedImages[i];
      const nextImg = loadedImages[(i + 1) % loadedImages.length];
      const photo = photos[i];
      const captionText = photo.customCaption || photoCaptions[photo.id] || photo.analysis?.description || '';

      for (let f = 0; f < framesPerPhoto; f++) {
        globalFrame++;
        const frameProgress = f / framesPerPhoto;

        // Render background: blurred backdrop
        ctx.fillStyle = '#090a0f';
        ctx.fillRect(0, 0, width, height);

        // Draw blurred background representation of current image
        drawBlurredBackground(ctx, currentImg, width, height);

        // Apply Ken Burns zoom & subtle pan
        const isTransitioning = f >= framesPerPhoto - transitionFrames && i < photos.length - 1;
        const transitionProgress = isTransitioning ? (f - (framesPerPhoto - transitionFrames)) / transitionFrames : 0;

        ctx.save();
        if (isTransitioning && settings.transitionStyle === 'crossfade') {
          // Render current with opacity (1 - transitionProgress)
          ctx.globalAlpha = 1 - transitionProgress;
          drawKenBurnsImage(ctx, currentImg, width, height, frameProgress, i % 3);
          ctx.restore();

          // Render incoming next image
          ctx.save();
          ctx.globalAlpha = transitionProgress;
          drawKenBurnsImage(ctx, nextImg, width, height, 0, (i + 1) % 3);
          ctx.restore();
        } else if (isTransitioning && settings.transitionStyle === 'fade') {
          // Fade to black then fade in
          const fadeAlpha = transitionProgress < 0.5 ? 1 - transitionProgress * 2 : (transitionProgress - 0.5) * 2;
          const targetImg = transitionProgress < 0.5 ? currentImg : nextImg;
          ctx.globalAlpha = Math.max(0, Math.min(1, fadeAlpha));
          drawKenBurnsImage(ctx, targetImg, width, height, frameProgress, i % 3);
          ctx.restore();
        } else {
          drawKenBurnsImage(ctx, currentImg, width, height, frameProgress, i % 3);
          ctx.restore();
        }

        // Overlay vignette for cinematic feel
        drawCinematicVignette(ctx, width, height);

        // Render Caption
        if (captionText) {
          drawCaption(ctx, captionText, width, height, settings.captionStyle);
        }

        // Draw subtle chapter badge at top-left
        const currentChapter = chapters.find((c) => c.photoIds.includes(photo.id));
        if (currentChapter) {
          drawChapterBadge(ctx, currentChapter.title, width, height);
        }

        // Yield to browser rendering loop at ~30fps
        if (f % 2 === 0) {
          await new Promise((r) => setTimeout(r, 16));
        }

        if (f % 15 === 0) {
          const overallPercent = Math.min(98, Math.floor((globalFrame / totalFrames) * 90) + 5);
          onProgress?.({
            percent: overallPercent,
            currentPhotoIndex: i + 1,
            totalPhotos: photos.length,
            stage: `Rendering scene ${i + 1} of ${photos.length}...`,
          });
        }
      }
    }

    onProgress?.({ percent: 99, currentPhotoIndex: photos.length, totalPhotos: photos.length, stage: 'Finalizing video stream...' });

    // Stop recorder and wait for chunks
    mediaRecorder.stop();
    const finalBlob = await recordingPromise;
    audioCtx.close().catch(() => {});

    return finalBlob;
  }
}

// Draw image with Ken Burns pan and zoom
function drawKenBurnsImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  progress: number, // 0 to 1
  motionPreset: number // 0: Zoom In, 1: Zoom Out, 2: Pan Left to Right
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let baseScale = 1;
  if (imgAspect > canvasAspect) {
    // Image is wider than canvas: fit height
    baseScale = canvasHeight / img.naturalHeight;
  } else {
    // Image is taller or equal: fit width
    baseScale = canvasWidth / img.naturalWidth;
  }

  // Ken Burns zoom scale factor: 1.0 -> 1.15
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;

  if (motionPreset === 0) {
    // Subtle Zoom In
    zoom = 1.0 + progress * 0.12;
  } else if (motionPreset === 1) {
    // Subtle Zoom Out
    zoom = 1.12 - progress * 0.12;
  } else {
    // Zoom and pan
    zoom = 1.06;
    panX = (progress - 0.5) * 40;
  }

  const renderW = img.naturalWidth * baseScale * zoom;
  const renderH = img.naturalHeight * baseScale * zoom;
  const drawX = (canvasWidth - renderW) / 2 + panX;
  const drawY = (canvasHeight - renderH) / 2 + panY;

  ctx.drawImage(img, drawX, drawY, renderW, renderH);
}

// Background blurred fill
function drawBlurredBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  ctx.save();
  ctx.filter = 'blur(30px) brightness(0.35)';
  ctx.drawImage(img, -20, -20, width + 40, height + 40);
  ctx.restore();
}

// Dark cinematic vignette
function drawCinematicVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.35,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Bottom subtitle backdrop gradient
  const bottomGrad = ctx.createLinearGradient(0, height - 160, 0, height);
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bottomGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height - 160, width, 160);
}

// Draw caption typography according to style
function drawCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  style: CaptionStyle
) {
  ctx.save();
  const maxTextWidth = width * 0.82;
  const bottomY = height - 60;

  if (style === 'elegant') {
    // Italic serif with warm gold/white illumination
    ctx.font = `italic 600 ${Math.round(height * 0.038)}px 'Playfair Display', Georgia, serif`;
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 2;

    wrapText(ctx, `“${text}”`, width / 2, bottomY, maxTextWidth, Math.round(height * 0.048));
  } else if (style === 'minimal') {
    // Clean modern sans-serif with subtle pill backing
    ctx.font = `500 ${Math.round(height * 0.032)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;

    wrapText(ctx, text, width / 2, bottomY, maxTextWidth, Math.round(height * 0.042));
  } else {
    // Bold cinematic punchy
    ctx.font = `800 ${Math.round(height * 0.04)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 3;

    wrapText(ctx, text.toUpperCase(), width / 2, bottomY, maxTextWidth, Math.round(height * 0.05));
  }
  ctx.restore();
}

// Chapter indicator badge at top
function drawChapterBadge(ctx: CanvasRenderingContext2D, chapterTitle: string, width: number, height: number) {
  ctx.save();
  ctx.font = `700 ${Math.round(height * 0.022)}px 'Plus Jakarta Sans', system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(129, 140, 248, 0.9)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(chapterTitle.toUpperCase(), 36, 32);
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Render lines from bottom upward
  const startY = y - (lines.length - 1) * lineHeight;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lineHeight);
  }
}
