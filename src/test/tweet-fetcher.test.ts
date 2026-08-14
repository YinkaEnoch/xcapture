import { describe, it, expect } from 'vitest';
import { parseOEmbedHtml } from '../lib/tweet-fetcher';

describe('parseOEmbedHtml', () => {
  it('should parse multi-line tweets with <br> tags correctly', () => {
    const oembed = {
      url: 'https://x.com/GloriousGod01/status/2088151580365172948',
      author_name: 'Glorious God',
      author_url: 'https://twitter.com/GloriousGod01',
      html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I have a very good update that can genuinely change your financial life for good.<br><br>Go to the App Store or Google Play Store and download any of these apps:<br><br>Duolingo, Babbel, or Busuu.<br><br>Pick any of these languages you&#39;d like to learn: French, German, Spanish, Mandarin Chinese,...</p>&mdash; Glorious God (@GloriousGod01) <a href="https://twitter.com/GloriousGod01/status/2088151580365172948">August 14, 2026</a></blockquote>',
    };

    const tweet = parseOEmbedHtml(oembed, '2088151580365172948', 'GloriousGod01');

    expect(tweet.authorName).toBe('Glorious God');
    expect(tweet.authorHandle).toBe('GloriousGod01');
    expect(tweet.formattedDate).toBe('August 14, 2026');
    // Check that line breaks were preserved and HTML entities decoded
    expect(tweet.text).toContain("change your financial life for good.\n\nGo to");
    expect(tweet.text).toContain("languages you'd like to learn");
    expect(tweet.text).toContain("Duolingo, Babbel, or Busuu.\n\nPick");
  });
});
