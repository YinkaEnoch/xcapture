export interface TweetData {
  id: string;
  url: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isVerified?: boolean;
  verifiedType?: 'blue' | 'gold' | 'gray' | 'none';
  text: string;
  formattedDate: string;
  mediaUrl?: string;
  metrics: {
    replies: number | string;
    reposts: number | string;
    likes: number | string;
    views: number | string;
    bookmarks?: number | string;
  };
  rawHtml?: string;
  source: 'oembed' | 'fallback' | 'custom';
}

export type TweetTheme = 'light' | 'dim' | 'dark';

export interface CardCustomization {
  theme: TweetTheme;
  showMetrics: boolean;
  showTimestamp: boolean;
  showWatermark: boolean;
  showLogo: boolean;
  verifiedType: 'blue' | 'gold' | 'gray' | 'none';
  customBackground: 'none' | 'gradient-blue' | 'gradient-purple' | 'gradient-amber' | 'gradient-emerald' | 'gradient-sunset' | 'mesh';
  cardPadding: 'compact' | 'normal' | 'spacious';
  fontSize: 'sm' | 'md' | 'lg';
}

export interface ValidationResult {
  isValid: boolean;
  statusId?: string;
  username?: string;
  canonicalUrl?: string;
  error?: string;
}

export type AppState = 'empty' | 'loading' | 'preview' | 'error';
