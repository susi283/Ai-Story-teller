import React from 'react';
import { PhotoItem } from '../types/story';
import { X, Eye, Tag, Calendar, Info } from 'lucide-react';

interface ImageModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-4xl w-full max-h-[90vh] glass-panel rounded-3xl overflow-hidden border border-zinc-700/80 flex flex-col bg-zinc-950/95 shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white truncate max-w-md">{photo.filename}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Main Image */}
          <div className="flex-1 min-h-[300px] flex items-center justify-center bg-black/60 rounded-2xl overflow-hidden border border-white/5">
            <img
              src={photo.dataUrl}
              alt={photo.filename}
              className="max-h-[60vh] w-auto object-contain rounded-lg"
            />
          </div>

          {/* Metadata Panel */}
          <div className="w-full md:w-80 space-y-4 shrink-0">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                Photo Information
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>File size:</span>
                  <span className="text-zinc-200">{(photo.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>MIME Type:</span>
                  <span className="text-zinc-200">{photo.mimeType}</span>
                </div>
              </div>
            </div>

            {/* AI Analysis if available */}
            {photo.analysis ? (
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  AI Multimodal Vision
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed font-light">
                  {photo.analysis.description}
                </p>

                {photo.analysis.sceneSetting && (
                  <div className="text-[11px] text-zinc-400">
                    <span className="text-zinc-500">Scene: </span>
                    {photo.analysis.sceneSetting}
                  </div>
                )}

                {photo.analysis.objectsActivities && photo.analysis.objectsActivities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {photo.analysis.objectsActivities.map((obj, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 text-xs text-zinc-400 font-light flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>AI scene understanding will be generated when you build the story.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
