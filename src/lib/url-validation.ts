import { ValidationResult } from './types';

/**
 * Validates whether a string is a valid X or Twitter post URL
 * and extracts the status ID and username.
 */
export function validateXPostUrl(inputUrl: string): ValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a URL.',
    };
  }

  const trimmed = inputUrl.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL.',
    };
  }

  // Prepend https:// if protocol is missing
  let urlToParse = trimmed;
  if (!/^https?:\/\//i.test(urlToParse)) {
    urlToParse = 'https://' + urlToParse;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlToParse);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format. Please enter a full URL (e.g. https://x.com/username/status/123456).',
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const validHostnames = ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com', 'fixupx.com', 'vxtwitter.com'];

  if (!validHostnames.includes(hostname)) {
    return {
      isValid: false,
      error: 'The URL must be from x.com or twitter.com.',
    };
  }

  const pathname = parsedUrl.pathname;
  
  // Regex to match status URLs: /username/status/123456789 or /i/status/123456789 or /username/statuses/123456789
  const statusRegex = /^\/([a-zA-Z0-9_]{1,15}|i)\/(?:status|statuses)\/(\d+)/i;
  const match = pathname.match(statusRegex);

  if (!match) {
    // Check if it's a general profile link
    if (/^\/[a-zA-Z0-9_]{1,15}\/?$/.test(pathname)) {
      return {
        isValid: false,
        error: 'This looks like a profile URL. Please provide a link to a specific post.',
      };
    }

    return {
      isValid: false,
      error: 'Invalid X post URL pattern. Expected format: https://x.com/username/status/123456789',
    };
  }

  let username = match[1];
  const statusId = match[2];

  if (username.toLowerCase() === 'i') {
    username = 'x'; // Default fallback handle for /i/status/ links
  }

  const canonicalUrl = `https://x.com/${username}/status/${statusId}`;

  return {
    isValid: true,
    statusId,
    username,
    canonicalUrl,
  };
}

/**
 * Extracts status ID from any string if present
 */
export function extractStatusId(inputUrl: string): string | null {
  const result = validateXPostUrl(inputUrl);
  return result.isValid && result.statusId ? result.statusId : null;
}
