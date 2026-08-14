import { describe, it, expect } from 'vitest';
import { validateXPostUrl, extractStatusId } from '../lib/url-validation';

describe('X Post URL Validation', () => {
  it('should validate valid x.com post URLs', () => {
    const result = validateXPostUrl('https://x.com/jack/status/20');
    expect(result.isValid).toBe(true);
    expect(result.statusId).toBe('20');
    expect(result.username).toBe('jack');
    expect(result.canonicalUrl).toBe('https://x.com/jack/status/20');
  });

  it('should validate valid twitter.com post URLs', () => {
    const result = validateXPostUrl('https://twitter.com/elonmusk/status/1787554430489956828');
    expect(result.isValid).toBe(true);
    expect(result.statusId).toBe('1787554430489956828');
    expect(result.username).toBe('elonmusk');
    expect(result.canonicalUrl).toBe('https://x.com/elonmusk/status/1787554430489956828');
  });

  it('should handle mobile.twitter.com and query params', () => {
    const result = validateXPostUrl('https://mobile.twitter.com/reactjs/status/1783544150537871630?s=20&t=abcdef');
    expect(result.isValid).toBe(true);
    expect(result.statusId).toBe('1783544150537871630');
    expect(result.username).toBe('reactjs');
  });

  it('should validate /i/status/ URLs', () => {
    const result = validateXPostUrl('https://x.com/i/status/1234567890');
    expect(result.isValid).toBe(true);
    expect(result.statusId).toBe('1234567890');
  });

  it('should reject non-post URLs', () => {
    const profileResult = validateXPostUrl('https://x.com/jack');
    expect(profileResult.isValid).toBe(false);
    expect(profileResult.error).toContain('profile URL');

    const googleResult = validateXPostUrl('https://google.com/search');
    expect(googleResult.isValid).toBe(false);
    expect(googleResult.error).toContain('x.com or twitter.com');

    const emptyResult = validateXPostUrl('   ');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.error).toContain('Please enter a URL');
  });

  it('should correctly extract status ID', () => {
    expect(extractStatusId('https://x.com/jack/status/20')).toBe('20');
    expect(extractStatusId('https://google.com')).toBe(null);
  });
});
