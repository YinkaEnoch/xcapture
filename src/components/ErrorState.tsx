import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onUseSample?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onUseSample }) => {
  return (
    <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-red-950/20 border border-red-500/20 flex flex-col items-center justify-center gap-4 text-center animate-fade-in shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-slate-100">Unable to Render Post</h3>
        <p className="text-xs sm:text-sm text-red-300/90 leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        {onUseSample && (
          <button
            onClick={onUseSample}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Sample Post</span>
          </button>
        )}
      </div>
    </div>
  );
};
