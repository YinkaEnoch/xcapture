import React, { useRef, useState } from 'react';
import { TweetData, CardCustomization } from '../lib/types';
import { TweetCard } from './TweetCard';
import { OfficialTweetWidget } from './OfficialTweetWidget';
import { CustomizerControls } from './CustomizerControls';
import { DownloadButton } from './DownloadButton';
import { downloadElementAsPng, generateScreenshotFilename } from '../lib/screenshot';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface PostPreviewProps {
  tweet: TweetData;
  onUpdateTweet: (updated: TweetData) => void;
  onReset: () => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  tweet,
  onUpdateTweet,
  onReset,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'card' | 'official'>('card');
  const [customization, setCustomization] = useState<CardCustomization>({
    theme: 'dark',
    showMetrics: true,
    showTimestamp: true,
    showWatermark: true,
    showLogo: true,
    verifiedType: tweet.verifiedType || 'blue',
    customBackground: 'gradient-blue',
    cardPadding: 'normal',
    fontSize: 'md',
  });

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    const filename = generateScreenshotFilename(tweet.authorHandle, tweet.id);
    await downloadElementAsPng(cardRef.current, {
      filename,
      pixelRatio: 2,
      triggerConfetti: true,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-scale-up">
      {/* Post URL Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-300 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200">Loaded Post:</span>
          <a
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline truncate font-mono text-xs max-w-xs sm:max-w-md inline-flex items-center gap-1"
          >
            <span>{tweet.url}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            ID: {tweet.id}
          </span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative p-4 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center min-h-[320px] overflow-visible w-full">
        <div className="w-full max-w-xl mx-auto flex justify-center overflow-visible">
          {viewMode === 'card' ? (
            <TweetCard ref={cardRef} tweet={tweet} customization={customization} />
          ) : (
            <OfficialTweetWidget tweet={tweet} />
          )}
        </div>
      </div>

      {/* Interactive Customization Controls (only for custom high-res card mode) */}
      {viewMode === 'card' && (
        <CustomizerControls
          customization={customization}
          onChange={setCustomization}
          tweet={tweet}
          onUpdateTweet={onUpdateTweet}
        />
      )}

      {/* Download and Action Controls */}
      <DownloadButton
        onDownload={handleDownloadPng}
        onReset={onReset}
        postUrl={tweet.url}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'card' ? 'official' : 'card')}
      />
    </div>
  );
};
