import { describe, it, expect } from 'vitest';
import { generateScreenshotFilename } from '../lib/screenshot';

describe('Screenshot Utility Functions', () => {
  it('should generate a sanitized filename with handle and id', () => {
    const filename = generateScreenshotFilename('jack', '20');
    expect(filename).toBe('x-post-jack-20.png');
  });

  it('should sanitize special characters in author handles', () => {
    const filename = generateScreenshotFilename('User@Special!Name', '123456');
    expect(filename).toBe('x-post-userspecialname-123456.png');
  });

  it('should fallback gracefully when handle or id are missing', () => {
    const filename = generateScreenshotFilename('', '');
    expect(filename).toMatch(/^x-post-post-\d+\.png$/);
  });
});
