import React, { useEffect, useRef } from 'react';
import { TweetData } from '../lib/types';

interface OfficialTweetWidgetProps {
  tweet: TweetData;
}

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load?: (element?: HTMLElement | null) => void;
        createTweet?: (
          tweetId: string,
          targetEl: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement>;
      };
    };
  }
}

export const OfficialTweetWidget: React.FC<OfficialTweetWidgetProps> = ({ tweet }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject widgets.js if not already present
    let script = document.getElementById('twitter-wjs') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'twitter-wjs';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (containerRef.current && window.twttr?.widgets?.createTweet) {
        containerRef.current.innerHTML = '';
        window.twttr.widgets.createTweet(tweet.id, containerRef.current, {
          theme: 'dark',
          align: 'center',
          conversation: 'none',
        }).catch((err) => {
          console.warn('Official Twitter widget render failed:', err);
        });
      }
    };

    if (window.twttr?.widgets) {
      renderWidget();
    } else {
      script.addEventListener('load', renderWidget);
    }

    return () => {
      if (script) script.removeEventListener('load', renderWidget);
    };
  }, [tweet.id]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[200px]">
      <div ref={containerRef} className="w-full flex justify-center" />
      
      {/* Raw oEmbed Blockquote fallback */}
      {tweet.rawHtml && (
        <div
          className="mt-4 hidden"
          dangerouslySetInnerHTML={{ __html: tweet.rawHtml }}
        />
      )}
    </div>
  );
};
