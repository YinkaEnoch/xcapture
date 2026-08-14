import React from 'react';
import { Sparkles } from 'lucide-react';
import { XLogo } from './icons/XLogo';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center gap-4 text-center animate-fade-in shadow-xl">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <XLogo className="w-8 h-8 text-sky-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white animate-bounce">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-100">Fetching X Post...</h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Retrieving metadata and rendering client-side screenshot preview...
        </p>
      </div>

      {/* Progress Skeleton Bar */}
      <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
        <div className="w-full h-full bg-gradient-to-r from-sky-500 to-blue-500 animate-pulse" />
      </div>
    </div>
  );
};
