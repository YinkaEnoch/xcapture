import React, { useState } from 'react';
import { ArrowRight, Link as LinkIcon, Sparkles, AlertCircle } from 'lucide-react';
import { validateXPostUrl } from '../lib/url-validation';

interface UrlInputProps {
  onGenerate: (url: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const SAMPLE_URLS = [
  { label: 'jack (first tweet)', url: 'https://x.com/jack/status/20' },
  { label: 'NASA Spacecraft', url: 'https://x.com/NASA/status/1785000000000000000' },
];

export const UrlInput: React.FC<UrlInputProps> = ({
  onGenerate,
  isLoading,
  errorMessage,
}) => {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validation = validateXPostUrl(url);
    if (!validation.isValid) {
      setLocalError(validation.error || 'Please enter a valid X post URL.');
      return;
    }

    onGenerate(validation.canonicalUrl || url);
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setLocalError(null);
    onGenerate(sampleUrl);
  };

  const displayError = localError || errorMessage;

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-slate-800 p-2 shadow-2xl shadow-sky-500/5 focus-within:border-sky-500/60 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
          <div className="pl-3 pr-2 text-slate-500 flex items-center pointer-events-none">
            <LinkIcon className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (localError) setLocalError(null);
            }}
            placeholder="Paste X post link (e.g. https://x.com/user/status/123456...)"
            disabled={isLoading}
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-0 py-2 px-1 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Generate Screenshot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {displayError && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{displayError}</span>
          </div>
        )}
      </form>

      {/* Example URL helpers */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Try an example:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_URLS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.url)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all font-mono text-[11px] disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
