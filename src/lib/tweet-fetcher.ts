import { TweetData } from './types';
import { validateXPostUrl } from './url-validation';

interface OEmbedResponse {
  url: string;
  author_name: string;
  author_url: string;
  html: string;
  width?: number;
  height?: number;
  type?: string;
  cache_age?: string;
  provider_name?: string;
  provider_url?: string;
  version?: string;
}

/**
 * Fetches Tweet oEmbed data directly from the client side using JSONP
 * to bypass CORS restrictions without needing any backend server.
 */
export function fetchTweetOEmbed(url: string): Promise<OEmbedResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `__x_oembed_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const encodedUrl = encodeURIComponent(url);
    
    // X Official JSONP endpoint
    script.src = `https://publish.twitter.com/oembed?url=${encodedUrl}&callback=${callbackName}`;
    script.async = true;

    let timer: number | null = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as unknown as Record<string, unknown>)[callbackName];
    };

    timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("We couldn't load this post. Request timed out or X service is unavailable."));
    }, 8000);

    (window as unknown as Record<string, unknown>)[callbackName] = (data: OEmbedResponse) => {
      cleanup();
      if (!data || !data.html) {
        reject(new Error("We couldn't load this post. Make sure the URL points to a public X post and try again."));
      } else {
        resolve(data);
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Failed to load post. Network issue or X embedding restriction."));
    };

    document.head.appendChild(script);
  });
}

/**
 * Parses blockquote HTML returned by X oEmbed into clean structured Tweet data
 */
export function parseOEmbedHtml(oembed: OEmbedResponse, statusId: string, username: string): TweetData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(oembed.html, 'text/html');
  
  // Extract text paragraph inside blockquote and preserve newlines from <br> tags
  const pTag = doc.querySelector('p');
  let tweetText = '';
  if (pTag) {
    const clone = pTag.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('br').forEach((br) => {
      br.replaceWith('\n');
    });
    tweetText = clone.textContent || '';
  }

  // Decode HTML entities (e.g. &#39; -> ', &quot; -> ", &amp; -> &)
  const txtElement = document.createElement('textarea');
  txtElement.innerHTML = tweetText;
  tweetText = txtElement.value;

  // Clean up whitespace: normalize carriage returns and limit consecutive newlines
  tweetText = tweetText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  // Extract author handle from author_url or HTML text
  let extractedHandle = username;
  if (oembed.author_url) {
    const match = oembed.author_url.match(/twitter\.com\/([a-zA-Z0-9_]+)|x\.com\/([a-zA-Z0-9_]+)/i);
    if (match) {
      extractedHandle = match[1] || match[2] || username;
    }
  }

  // Extract date from blockquote footer link (usually the last <a> tag in blockquote)
  let formattedDate = 'Recent';
  const links = doc.querySelectorAll('a');
  if (links.length > 0) {
    const lastLink = links[links.length - 1];
    if (lastLink && lastLink.textContent && !lastLink.textContent.startsWith('pic.twitter')) {
      formattedDate = lastLink.textContent.trim();
    }
  }

  // Sensible default engagement metrics
  const metrics = {
    replies: '1.2K',
    reposts: '4.8K',
    likes: '28.5K',
    views: '1.2M',
    bookmarks: '3.4K'
  };

  return {
    id: statusId,
    url: oembed.url || `https://x.com/${extractedHandle}/status/${statusId}`,
    authorName: oembed.author_name || extractedHandle,
    authorHandle: extractedHandle,
    authorAvatar: getInitialAvatarUrl(extractedHandle),
    isVerified: true,
    verifiedType: 'blue',
    text: tweetText || 'No text content available for this post.',
    formattedDate: formattedDate || '12:00 PM · Jan 1, 2026',
    metrics,
    rawHtml: oembed.html,
    source: 'oembed'
  };
}

/**
 * Generate a clean SVG default avatar based on username initial
 */
export function getInitialAvatarUrl(username: string): string {
  const initial = (username[0] || 'X').toUpperCase();
  const colors = ['#1d9bf0', '#7952b3', '#20c997', '#fd7e14', '#e83e8c', '#6f42c1'];
  const charCode = username.charCodeAt(0) || 0;
  const bgColor = colors[charCode % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${bgColor}"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="700">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * High level function to get tweet details from URL
 */
export async function getTweetFromUrl(inputUrl: string): Promise<TweetData> {
  const validation = validateXPostUrl(inputUrl);

  if (!validation.isValid || !validation.canonicalUrl || !validation.statusId) {
    throw new Error(validation.error || 'Invalid X post URL.');
  }

  try {
    const oembedData = await fetchTweetOEmbed(validation.canonicalUrl);
    return parseOEmbedHtml(oembedData, validation.statusId, validation.username || 'user');
  } catch (err) {
    const message = err instanceof Error ? err.message : "We couldn't load this post. Make sure the URL points to a public X post and try again.";
    throw new Error(message);
  }
}
