import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ScreenshotOptions {
  filename?: string;
  pixelRatio?: number;
  quality?: number;
  triggerConfetti?: boolean;
}

/**
 * Captures a DOM element and downloads it as a high-resolution PNG image.
 */
export async function downloadElementAsPng(
  element: HTMLElement,
  options: ScreenshotOptions = {}
): Promise<string> {
  const {
    filename = 'x-post-screenshot.png',
    pixelRatio = 2,
    triggerConfetti = true,
  } = options;

  try {
    // Wait briefly for images/fonts to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Convert DOM element to PNG data URL
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio,
      filter: (node) => {
        // Exclude elements marked with data-no-screenshot attribute
        if (node instanceof HTMLElement && node.dataset.noScreenshot === 'true') {
          return false;
        }
        return true;
      },
    });

    // Create trigger link for browser download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional celebratory confetti
    if (triggerConfetti) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#1d9bf0', '#38bdf8', '#818cf8', '#ffffff']
      });
    }

    return dataUrl;
  } catch (error) {
    console.error('Screenshot generation error:', error);
    throw new Error(
      'Failed to generate screenshot image. Please ensure the element is visible and try again.'
    );
  }
}

/**
 * Sanitizes handle or filename string for clean download name
 */
export function generateScreenshotFilename(authorHandle?: string, statusId?: string): string {
  const safeHandle = (authorHandle || 'post')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
  const safeId = (statusId || Date.now().toString()).replace(/[^0-9]/g, '');

  return `x-post-${safeHandle}-${safeId}.png`;
}
