export interface FaviconIcon {
  href: string;
  size?: number;
  sizes?: string;
  source: 'html' | 'manifest' | 'browserconfig' | 'fallback';
  type?: string;
  rel?: string;
  purpose?: string;
}

export interface FaviconMetadata {
  htmlParsed: boolean;
  manifestParsed: boolean;
  browserconfigParsed: boolean;
  redirected: string | null;
  captchaProtected: boolean;
}

export interface FaviconResponse {
  found: FaviconIcon[];
  fallbacks: FaviconIcon[];
  metadata: FaviconMetadata;
}

export interface IconAnalysis {
  totalIcons: number;
  hasAppleTouchIcon: boolean;
  hasSVG: boolean;
  hasHighRes: boolean;
  hasManifest: boolean;
  hasBrowserConfig: boolean;
  warnings: string[];
  recommendations: string[];
  score: number;
}

export interface DownloadableIcon extends FaviconIcon {
  displaySize: string;
  displayName: string;
}
