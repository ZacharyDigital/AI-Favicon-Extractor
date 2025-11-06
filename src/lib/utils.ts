import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FaviconIcon, FaviconResponse, IconAnalysis, DownloadableIcon } from '@/types/favicon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Analyze favicon data and provide insights
 */
export function analyzeFavicons(data: FaviconResponse): IconAnalysis {
  const allIcons = [...data.found, ...data.fallbacks];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Check for Apple Touch Icon
  const hasAppleTouchIcon = allIcons.some(
    (icon) => icon.rel?.includes('apple-touch-icon') || icon.href.includes('apple-touch-icon')
  );

  if (!hasAppleTouchIcon) {
    warnings.push('Missing apple-touch-icon - May display poorly when added to iOS home screen');
  } else {
    score += 20;
    recommendations.push('✓ Apple Touch Icon detected - Great for iOS users!');
  }

  // Check for SVG format
  const hasSVG = allIcons.some(
    (icon) => icon.type === 'image/svg+xml' || icon.href.endsWith('.svg')
  );

  if (hasSVG) {
    score += 25;
    recommendations.push('✓ SVG format detected - Excellent scalability for high-DPI displays!');
  } else {
    warnings.push('No SVG favicon found - Consider adding one for better scalability');
  }

  // Check for high-resolution icons (512x512 or larger)
  const hasHighRes = allIcons.some((icon) => {
    if (icon.size && icon.size >= 512) return true;
    if (icon.sizes) {
      const sizes = icon.sizes.split(' ');
      return sizes.some((size) => {
        const [w] = size.split('x').map(Number);
        return w >= 512;
      });
    }
    return false;
  });

  if (hasHighRes) {
    score += 20;
    recommendations.push('✓ High-resolution icons (512x512+) found - Perfect for PWA!');
  } else {
    warnings.push('No high-resolution icons (512x512+) - Important for PWA and modern displays');
  }

  // Check for manifest
  const hasManifest = data.metadata.manifestParsed;
  if (hasManifest) {
    score += 20;
    recommendations.push('✓ Web Manifest detected - Your site is PWA-ready!');
  } else {
    warnings.push('No Web Manifest (manifest.json) found - Consider adding for PWA support');
  }

  // Check for browserconfig
  const hasBrowserConfig = data.metadata.browserconfigParsed;
  if (hasBrowserConfig) {
    score += 15;
    recommendations.push('✓ BrowserConfig detected - Optimized for Windows tiles!');
  }

  // Check total icon count
  const totalIcons = data.found.length;
  if (totalIcons === 0) {
    warnings.push('No favicons found - This website may not have any favicon configured');
    score = 0;
  } else if (totalIcons >= 5) {
    score += 10;
    recommendations.push(`✓ ${totalIcons} different icons found - Comprehensive coverage!`);
  } else if (totalIcons >= 2) {
    score += 5;
  }

  // Check for modern formats
  const hasModernFormat = allIcons.some(
    (icon) => icon.type === 'image/png' || icon.type === 'image/webp'
  );

  if (hasModernFormat) {
    score += 10;
  }

  return {
    totalIcons,
    hasAppleTouchIcon,
    hasSVG,
    hasHighRes,
    hasManifest,
    hasBrowserConfig,
    warnings,
    recommendations,
    score: Math.min(score, 100),
  };
}

/**
 * Convert favicon icons to downloadable format with proper naming
 */
export function prepareIconsForDownload(icons: FaviconIcon[]): DownloadableIcon[] {
  return icons.map((icon, index) => {
    let displaySize = 'Unknown';

    if (icon.size) {
      displaySize = `${icon.size}x${icon.size}`;
    } else if (icon.sizes) {
      displaySize = icon.sizes;
    } else if (icon.type === 'image/svg+xml' || icon.href.endsWith('.svg')) {
      displaySize = 'Vector';
    }

    // Generate display name
    let displayName = '';
    if (icon.rel) {
      displayName = icon.rel.replace('icon', 'favicon').replace(/-/g, ' ');
    } else if (icon.source === 'manifest') {
      displayName = 'manifest icon';
    } else if (icon.source === 'browserconfig') {
      displayName = 'tile image';
    } else if (icon.source === 'fallback') {
      displayName = 'fallback icon';
    } else {
      displayName = 'favicon';
    }

    return {
      ...icon,
      displaySize,
      displayName: `${displayName} (${displaySize})`,
    };
  });
}

/**
 * Get file extension from URL or MIME type
 */
export function getFileExtension(url: string, mimeType?: string): string {
  // Try to get extension from URL
  const urlMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // Fallback to MIME type
  if (mimeType) {
    const mimeMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/svg+xml': 'svg',
      'image/x-icon': 'ico',
      'image/vnd.microsoft.icon': 'ico',
      'image/webp': 'webp',
    };
    return mimeMap[mimeType] || 'png';
  }

  return 'png';
}

/**
 * Sanitize filename for download
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Get domain name from URL
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'website';
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Format relative time (for history feature)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}
