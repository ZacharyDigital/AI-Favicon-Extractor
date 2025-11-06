'use client';

import { useState } from 'react';
import { Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { IconCard } from '@/components/IconCard';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { fetchFavicons } from '@/lib/api';
import { analyzeFavicons, prepareIconsForDownload, isValidUrl, getDomainFromUrl } from '@/lib/utils';
import { downloadAllIconsAsZip } from '@/lib/download';
import type { FaviconResponse, DownloadableIcon, IconAnalysis } from '@/types/favicon';
import { useTranslations } from 'next-intl';

export function FaviconExtractor() {
  const t = useTranslations();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FaviconResponse | null>(null);
  const [icons, setIcons] = useState<DownloadableIcon[]>([]);
  const [analysis, setAnalysis] = useState<IconAnalysis | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError(t('form.error_empty'));
      return;
    }

    if (!isValidUrl(url)) {
      setError(t('form.error_invalid'));
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setIcons([]);
    setAnalysis(null);

    try {
      const response = await fetchFavicons(url);
      setData(response);

      // Prepare icons for display
      const allIcons = [...response.found, ...response.fallbacks];
      const downloadableIcons = prepareIconsForDownload(allIcons);
      setIcons(downloadableIcons);

      // Analyze the data
      const analysisResult = analyzeFavicons(response);
      setAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract favicons');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!icons.length || !url) return;

    setDownloadingZip(true);
    setDownloadProgress({ current: 0, total: icons.length });

    try {
      await downloadAllIconsAsZip(icons, url, (current, total) => {
        setDownloadProgress({ current, total });
      });
    } catch {
      setError('Failed to download icons. Please try again.');
    } finally {
      setDownloadingZip(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  const handleTryExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Search Form */}
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleExtract} className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('form.placeholder')}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-4 pr-32 text-lg shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('form.button_extracting')}
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    {t('form.button_extract')}
                  </>
                )}
              </button>
            </div>

            {/* Example URLs */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">{t('form.try_label')}</span>
              {['https://github.com', 'https://twitter.com', 'https://stackoverflow.com'].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleTryExample(example)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {getDomainFromUrl(example)}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Captcha Warning */}
      {data && data.metadata.captchaProtected && icons.length > 0 && (
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">{t('warnings.captcha_title')}</p>
              <p className="text-sm">
                {t('warnings.captcha_message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Icons Found */}
      {data && icons.length === 0 && !data.metadata.captchaProtected && (
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">{t('warnings.no_icons_title')}</p>
              <p className="text-sm">
                {t('warnings.no_icons_message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && icons.length > 0 && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('results.found', { 
                  count: data.found.length, 
                  plural: data.found.length !== 1 ? 's' : '' 
                })}
              </h2>
              <p className="text-sm text-gray-600">
                {t('results.extracted_from', { domain: getDomainFromUrl(url) })}
              </p>
            </div>
            <button
              onClick={handleDownloadAll}
              disabled={downloadingZip}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingZip ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('results.downloading', { 
                    current: downloadProgress.current, 
                    total: downloadProgress.total 
                  })}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  {t('results.download_all')}
                </>
              )}
            </button>
          </div>

          {/* Analysis Panel */}
          {analysis && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AnalysisPanel analysis={analysis} />
            </div>
          )}

          {/* Icon Grid */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t('results.icon_collection')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {icons.map((icon, index) => (
                <div
                  key={`${icon.href}-${index}`}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <IconCard icon={icon} websiteUrl={url} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
