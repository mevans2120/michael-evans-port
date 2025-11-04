'use client';

import { useEffect, useRef } from 'react';

interface FaviconOptions {
  accentColor: string;
  textColor: string;
  enabled?: boolean;
  updateOnChange?: boolean;
}

/**
 * Hook to dynamically update the browser favicon based on theme colors
 *
 * @param accentColor - HSL color string for the accent (e.g., "20 90% 55%")
 * @param textColor - HSL color string for the text (e.g., "0 0% 98%")
 * @param enabled - Whether to enable dynamic favicon updates (default: true)
 */
export function useDynamicFavicon({ accentColor, textColor, enabled = true, updateOnChange = false }: FaviconOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastFaviconRef = useRef<string>('');
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // If updateOnChange is false, only run once
    if (!updateOnChange && hasRunRef.current) return;

    hasRunRef.current = true;

    try {
      updateFavicon();
    } catch (error) {
      console.error('Failed to generate dynamic favicon, falling back to static:', error);
      useFallbackFavicon();
    }
  }, [enabled, ...(updateOnChange ? [accentColor, textColor] : [])]);

  const updateFavicon = () => {
    // Create favicon signature to avoid unnecessary updates
    const faviconSignature = `${accentColor}-${textColor}`;
    if (faviconSignature === lastFaviconRef.current) return;
    lastFaviconRef.current = faviconSignature;

    // Convert HSL to RGB for canvas
    const accentRGB = hslToRgb(accentColor);
    const textRGB = hslToRgb(textColor);

    // Generate favicon using canvas
    const faviconDataUrl = generateFaviconDataUrl(accentRGB, textRGB);

    if (!faviconDataUrl) {
      console.warn('Canvas generation returned empty data URL, using fallback');
      useFallbackFavicon();
      return;
    }

    // Update favicon link element
    updateFaviconLink(faviconDataUrl);
    console.log('✅ Dynamic favicon generated successfully');
  };

  const useFallbackFavicon = () => {
    console.log('⚠️  Using fallback static favicon.ico');
    // Remove any dynamically generated favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Add static favicon.ico as fallback
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
  };

  const generateFaviconDataUrl = (accentRGB: string, textRGB: string): string => {
    // Create or reuse canvas
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 64;
      canvasRef.current.height = 64;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, 64, 64);

    // Set text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    // Draw "M" in solid color (white or black based on mode)
    ctx.fillStyle = textRGB;
    ctx.fillText('M', 24, 32);

    // Draw "E" with gradient (accent color)
    const gradient = ctx.createLinearGradient(30, 0, 50, 64);
    gradient.addColorStop(0, accentRGB);
    gradient.addColorStop(1, adjustBrightness(accentRGB, 0.7)); // Darker shade for gradient

    ctx.fillStyle = gradient;
    ctx.fillText('E', 44, 32);

    return canvas.toDataURL('image/png');
  };

  /**
   * Adjust brightness of RGB color for gradient effect
   */
  const adjustBrightness = (rgb: string, factor: number): string => {
    const match = rgb.match(/\d+/g);
    if (!match) return rgb;

    const [r, g, b] = match.map(Number);
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
  };

  const updateFaviconLink = (dataUrl: string) => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = dataUrl;
    document.head.appendChild(link);
  };

  /**
   * Convert HSL string (e.g., "20 90% 55%") to RGB string (e.g., "rgb(248, 114, 37)")
   */
  const hslToRgb = (hsl: string): string => {
    const parts = hsl.split(' ');
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };
}
