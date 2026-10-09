import React from 'react';
import { Film, Sparkles, Compass, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'workspace' | 'results';
  onNavigateLanding: () => void;
  onNavigateWorkspace: () => void;
  onLoadExample: () => void;
  activeStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateLanding,
  onNavigateWorkspace,
  onLoadExample,
  activeStep = 1,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-indigo-950/40 bg-[#090a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onNavigateLanding}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AI Photo Storyteller</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Turn photos into cinematic stories</p>
          </div>
        </div>

        {/* Center Progress indicator if in workspace */}
        {currentView === 'workspace' && (
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500">Step {activeStep} of 4:</span>
            <span className="text-indigo-300 font-medium">
              {activeStep === 1 && 'Upload Photos'}
              {activeStep === 2 && 'Story Context'}
              {activeStep === 3 && 'Choose Style'}
              {activeStep === 4 && 'Video Settings'}
            </span>
          </div>
        )}

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLoadExample}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition-colors"
          >
            <Compass className="w-4 h-4 text-violet-400" />
            <span>Explore Example</span>
          </button>

          {currentView !== 'workspace' && (
            <button
              onClick={onNavigateWorkspace}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Story</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
