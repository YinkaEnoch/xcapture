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
    // 1. Wait for web fonts to load
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    // 2. Preload all internal images (avatars, attachments)
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Wait briefly for layout and styling to settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 3. Compute precise bounding dimensions including scroll/box sizing
    const rect = element.getBoundingClientRect();
    const width = Math.ceil(Math.max(rect.width, element.offsetWidth, element.scrollWidth));
    const height = Math.ceil(Math.max(rect.height, element.offsetHeight, element.scrollHeight));

    // 4. Convert DOM element to PNG data URL with explicit dimensions and resets
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio,
      width,
      height,
      canvasWidth: width * pixelRatio,
      canvasHeight: height * pixelRatio,
      style: {
        transform: 'none',
        margin: '0',
        maxWidth: 'none',
        maxHeight: 'none',
        width: `${width}px`,
        height: `${height}px`,
        boxSizing: 'border-box',
        position: 'relative',
        left: '0',
        top: '0',
      },
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
