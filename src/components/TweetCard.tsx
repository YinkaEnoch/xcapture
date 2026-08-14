import { forwardRef } from 'react';
import { TweetData, CardCustomization } from '../lib/types';
import { VerifiedBadge } from './icons/VerifiedBadge';
import { XLogo } from './icons/XLogo';
import { MessageCircle, Repeat2, Heart, BarChart3, Bookmark } from 'lucide-react';

interface TweetCardProps {
  tweet: TweetData;
  customization: CardCustomization;
}

export const TweetCard = forwardRef<HTMLDivElement, TweetCardProps>(
  ({ tweet, customization }, ref) => {
    const {
      theme = 'dark',
      showMetrics = true,
      showTimestamp = true,
      showWatermark = true,
      showLogo = true,
      verifiedType = 'blue',
      customBackground = 'none',
      cardPadding = 'normal',
      fontSize = 'md',
    } = customization;

    // Theme style mappings
    const themeStyles = {
      light: {
        bg: 'bg-white',
        text: 'text-slate-900',
        subtext: 'text-slate-500',
        border: 'border-slate-100',
        divider: 'border-slate-100',
        iconColor: 'text-slate-500',
        hover: 'hover:bg-slate-50',
      },
      dim: {
        bg: 'bg-[#15202b]',
        text: 'text-white',
        subtext: 'text-[#8899a6]',
        border: 'border-[#38444d]',
        divider: 'border-[#38444d]',
        iconColor: 'text-[#8899a6]',
        hover: 'hover:bg-[#1e2732]',
      },
      dark: {
        bg: 'bg-black',
        text: 'text-white',
        subtext: 'text-neutral-500',
        border: 'border-neutral-800',
        divider: 'border-neutral-800',
        iconColor: 'text-neutral-500',
        hover: 'hover:bg-neutral-900',
      },
    };

    const currentTheme = themeStyles[theme] || themeStyles.dark;

    // Container background style mappings
    const backgroundStyles = {
      none: 'bg-transparent p-2 sm:p-4 shadow-none',
      'gradient-blue': 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-5 sm:p-8 rounded-3xl shadow-2xl',
      'gradient-purple': 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-5 sm:p-8 rounded-3xl shadow-2xl',
      'gradient-amber': 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-5 sm:p-8 rounded-3xl shadow-2xl',
      'gradient-emerald': 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-5 sm:p-8 rounded-3xl shadow-2xl',
      'gradient-sunset': 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-5 sm:p-8 rounded-3xl shadow-2xl',
      mesh: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 rounded-3xl shadow-2xl border border-slate-700/50',
    };

    // Padding mappings inside card
    const paddingStyles = {
      compact: 'p-4 sm:p-5',
      normal: 'p-5 sm:p-6',
      spacious: 'p-6 sm:p-8',
    };

    // Font size mappings
    const fontSizes = {
      sm: 'text-sm sm:text-base leading-relaxed',
      md: 'text-base sm:text-lg leading-relaxed',
      lg: 'text-lg sm:text-xl leading-relaxed',
    };

    return (
      <div
        ref={ref}
        id="tweet-capture-target"
        className="w-full max-w-xl box-border overflow-visible transition-all bg-transparent"
        style={{ margin: 0 }}
      >
        <div className={`w-full transition-all ${backgroundStyles[customBackground]}`}>
          <div
            className={`w-full rounded-2xl border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} ${paddingStyles[cardPadding]} shadow-xl flex flex-col gap-4 font-sans select-none relative overflow-visible`}
          >
          {/* Header row: Avatar, Name, Handle, Logo */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <img
                  src={tweet.authorAvatar}
                  alt={tweet.authorName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700/20"
                  onError={(e) => {
                    // Fallback to initial SVG if image fails
                    const initial = (tweet.authorHandle[0] || 'X').toUpperCase();
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231d9bf0"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-family="sans-serif" font-size="44" font-weight="700">${initial}</text></svg>`;
                  }}
                />
              </div>

              {/* Author Info */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-base tracking-tight truncate">
                    {tweet.authorName}
                  </span>
                  <VerifiedBadge type={verifiedType} className="w-4 h-4 shrink-0" />
                </div>
                <span className={`text-sm ${currentTheme.subtext} truncate`}>
                  @{tweet.authorHandle}
                </span>
              </div>
            </div>

            {/* X Logo Branding */}
            {showLogo && (
              <div className="shrink-0 text-sky-500 p-1">
                <XLogo className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Tweet Text Content */}
          <div className={`${fontSizes[fontSize]} whitespace-pre-wrap break-words font-normal`}>
            {tweet.text}
          </div>

          {/* Tweet Media Attachment (if present) */}
          {tweet.mediaUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-700/20 mt-1 max-h-96">
              <img
                src={tweet.mediaUrl}
                alt="Tweet media attachment"
                className="w-full h-full object-cover max-h-96"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Timestamp & Date */}
          {showTimestamp && (
            <div className={`text-xs sm:text-sm ${currentTheme.subtext} font-medium pt-1`}>
              {tweet.formattedDate}
            </div>
          )}

          {/* Metrics Row */}
          {showMetrics && (
            <>
              <div className={`border-t ${currentTheme.divider} my-0.5`} />
              <div className={`flex items-center justify-between text-xs sm:text-sm ${currentTheme.subtext} pt-0.5`}>
                <div className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{tweet.metrics.replies}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                  <Repeat2 className="w-4 h-4" />
                  <span>{tweet.metrics.reposts}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{tweet.metrics.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span>{tweet.metrics.views}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-sky-500 transition-colors hidden sm:flex">
                  <Bookmark className="w-4 h-4" />
                  <span>{tweet.metrics.bookmarks || '840'}</span>
                </div>
              </div>
            </>
          )}

          {/* Optional XSnap Watermark */}
          {showWatermark && (
            <div className={`text-[10px] ${currentTheme.subtext} opacity-60 text-right font-mono tracking-wider pt-1 flex items-center justify-end gap-1`}>
              <span>Generated with XSnap</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  }
);

TweetCard.displayName = 'TweetCard';
