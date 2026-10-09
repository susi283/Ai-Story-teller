import React, { useRef, useState } from 'react';
import { PhotoItem } from '../types/story';
import { SAMPLE_PHOTOS } from '../data/sampleStory';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface PhotoUploadStepProps {
  photos: PhotoItem[];
  onChangePhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  onPreviewPhoto: (photo: PhotoItem) => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  photos,
  onChangePhotos,
  onPreviewPhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const newItems: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type.toLowerCase())) {
        setErrorMessage(`"${file.name}" has an unsupported format. Please use JPEG, PNG, or WebP.`);
        continue;
      }

      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds 15MB limit. Please upload smaller images.`);
        continue;
      }

      const id = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const photoItem: PhotoItem = {
          id,
          filename: file.name,
          dataUrl,
          sizeBytes: file.size,
          mimeType: file.type,
          order: photos.length + newItems.length,
        };

        onChangePhotos((prev) => {
          if (prev.length >= 20) {
            setErrorMessage('Maximum of 20 photos allowed per story.');
            return prev;
          }
          return [...prev, photoItem];
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removePhoto = (id: string) => {
    onChangePhotos(photos.filter((p) => p.id !== id));
  };

  const movePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    // Reassign order indices
    newPhotos.forEach((p, idx) => {
      p.order = idx;
    });

    onChangePhotos(newPhotos);
  };

  const loadSamplePhotos = () => {
    setErrorMessage(null);
    onChangePhotos(SAMPLE_PHOTOS);
  };

  const clearAllPhotos = () => {
    onChangePhotos([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Upload Photographs</h2>
          <p className="text-zinc-400 text-sm mt-1 font-light">
            Select 5 to 20 photos that capture the journey. Drag to reorder chronological or narrative flow.
          </p>
        </div>

        {/* Counter Badge & Sample Button */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
              photos.length >= 5 && photos.length <= 20
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
            }`}
          >
            {photos.length} / 20 Photos {photos.length < 5 && '(Need min 5)'}
          </div>

          <button
            type="button"
            onClick={loadSamplePhotos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-violet-300 bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/30 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Load 6 Sample Memories</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {photos.length < 20 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
              : 'border-zinc-700/80 hover:border-indigo-500/50 bg-zinc-900/30 hover:bg-zinc-900/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-white">
              Click to browse or drag and drop photos here
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              Supported formats: JPEG, PNG, WebP • Up to 15MB each
            </p>
          </div>
        </div>
      )}

      {/* Photo Grid Preview */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Selected Frames ({photos.length}) — Drag or click arrows to reorder
            </span>
            <button
              onClick={clearAllPhotos}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden glass-panel border border-zinc-800 hover:border-indigo-500/50 transition-all flex flex-col bg-zinc-950/60"
              >
                {/* Image Aspect ratio box */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/60">
                  <img
                    src={photo.dataUrl}
                    alt={photo.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Order Index Pill */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    #{index + 1}
                  </div>

                  {/* Action Overlays */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Preview Fullscreen"
                      onClick={() => onPreviewPhoto(photo)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Remove Photo"
                      onClick={() => removePhoto(photo.id)}
                      className="p-1.5 rounded-lg bg-red-500/40 hover:bg-red-500 text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Card Controls: Move left/right */}
                <div className="p-2 flex items-center justify-between bg-zinc-900/80 border-t border-zinc-800/80">
                  <p className="text-[11px] text-zinc-300 truncate max-w-[80px]" title={photo.filename}>
                    {photo.filename}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => movePhoto(index, 'left')}
                      className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 text-zinc-300 hover:text-white"
                      title="Move earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === photos.length - 1}
                      onClick={() => movePhoto(index, 'right')}
                      className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 text-zinc-300 hover:text-white"
                      title="Move later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Add More Slot */}
            {photos.length < 20 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border border-dashed border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/20 hover:bg-zinc-900/40 flex flex-col items-center justify-center text-zinc-400 hover:text-indigo-300 transition-all gap-2"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">Add Photo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
