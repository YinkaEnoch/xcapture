import React, { useState } from 'react';
import { Download, RefreshCw, Copy, Check, Eye } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
  onReset: () => void;
  postUrl: string;
  viewMode: 'card' | 'official';
  onToggleViewMode: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  onReset,
  postUrl,
  viewMode,
  onToggleViewMode,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Main Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Rendering PNG...</span>
            </>
          ) : (
            <>
              <Download className="w-4.5 h-4.5" />
              <span>Download PNG</span>
            </>
          )}
        </button>

        {/* Generate Another Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 font-semibold text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Generate Another</span>
        </button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Copy Link button */}
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all"
          title="Copy Post Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

        {/* Toggle between Custom High-Res Card & Official Embed Widget */}
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all"
          title="Toggle Official Embed Widget vs High-Res PNG Card"
        >
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>{viewMode === 'card' ? 'Official Embed' : 'PNG Card'}</span>
        </button>
      </div>
    </div>
  );
};
