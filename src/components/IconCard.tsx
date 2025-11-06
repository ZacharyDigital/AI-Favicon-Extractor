'use client';

import { useState } from 'react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { DownloadableIcon } from '@/types/favicon';
import { downloadSingleIcon, copyIconUrl } from '@/lib/download';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface IconCardProps {
  icon: DownloadableIcon;
  websiteUrl: string;
}

export function IconCard({ icon, websiteUrl }: IconCardProps) {
  const t = useTranslations();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadSingleIcon(icon, websiteUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download icon. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await copyIconUrl(icon.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'html':
        return 'bg-blue-100 text-blue-700';
      case 'manifest':
        return 'bg-green-100 text-green-700';
      case 'browserconfig':
        return 'bg-purple-100 text-purple-700';
      case 'fallback':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="group transition-all hover:shadow-md hover:border-blue-200/50 border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
      <CardContent className="p-5">
        {/* Icon Preview */}
        <div className="mb-3 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          {!imageError ? (
            <img
              src={icon.href}
              alt={icon.displayName}
              className="h-16 w-16 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center text-gray-400">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Icon Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-gray-900 line-clamp-2">
              {icon.displaySize}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                getSourceBadgeColor(icon.source)
              )}
            >
              {icon.source}
            </span>
          </div>

          {icon.type && (
            <p className="text-xs text-gray-500 truncate" title={icon.type}>
              {icon.type}
            </p>
          )}

          {icon.rel && (
            <p className="text-xs text-gray-500 truncate" title={icon.rel}>
              rel: {icon.rel}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            size="sm"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? t('icon_card.downloading') : t('icon_card.download')}
          </Button>

          <Button
            onClick={handleCopyUrl}
            variant="outline"
            size="icon"
            title={t('icon_card.copy_url')}
            className="border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button
            asChild
            variant="outline"
            size="icon"
            title={t('icon_card.open_new_tab')}
            className="border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
          >
            <a href={icon.href} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
