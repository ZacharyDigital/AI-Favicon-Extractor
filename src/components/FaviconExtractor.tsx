'use client';

import { useState } from 'react';
import { Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconCard } from '@/components/IconCard';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { fetchFavicons } from '@/lib/api';
import { analyzeFavicons, prepareIconsForDownload, getDomainFromUrl } from '@/lib/utils';
import { downloadAllIconsAsZip } from '@/lib/download';
import type { FaviconResponse, DownloadableIcon, IconAnalysis } from '@/types/favicon';
import { useTranslations } from 'next-intl';

// 定义表单验证 schema
const createFormSchema = (t: (key: string) => string) =>
  z.object({
    url: z
      .string()
      .min(1, { message: t('form.error_empty') })
      .url({ message: t('form.error_invalid') })
      .refine((url) => /^https?:\/\/.+/.test(url), {
        message: t('form.error_invalid'),
      }),
  });

type FormData = {
  url: string;
};

export function FaviconExtractor() {
  const t = useTranslations();
  const [data, setData] = useState<FaviconResponse | null>(null);
  const [icons, setIcons] = useState<DownloadableIcon[]>([]);
  const [analysis, setAnalysis] = useState<IconAnalysis | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      url: '',
    },
  });

  const handleExtract = async (formData: FormData) => {
    setData(null);
    setIcons([]);
    setAnalysis(null);

    try {
      const response = await fetchFavicons(formData.url);
      setData(response);

      // Prepare icons for display
      const allIcons = [...response.found, ...response.fallbacks];
      const downloadableIcons = prepareIconsForDownload(allIcons);
      setIcons(downloadableIcons);

      // Analyze the data
      const analysisResult = analyzeFavicons(response);
      setAnalysis(analysisResult);
    } catch (err) {
      form.setError('url', {
        message: err instanceof Error ? err.message : 'Failed to extract favicons',
      });
    }
  };

  const handleDownloadAll = async () => {
    const url = form.getValues('url');
    if (!icons.length || !url) return;

    setDownloadingZip(true);
    setDownloadProgress({ current: 0, total: icons.length });

    try {
      await downloadAllIconsAsZip(icons, url, (current, total) => {
        setDownloadProgress({ current, total });
      });
    } catch {
      form.setError('url', {
        message: 'Failed to download icons. Please try again.',
      });
    } finally {
      setDownloadingZip(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  const handleTryExample = (exampleUrl: string) => {
    form.setValue('url', exampleUrl);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Search Form */}
      <div className="mx-auto max-w-3xl">
        <form onSubmit={form.handleSubmit(handleExtract)} className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                {...form.register('url')}
                type="text"
                placeholder={t('form.placeholder')}
                className="w-full pr-32 text-lg h-14 rounded-xl border-2 border-gray-200/80 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300"
                disabled={form.formState.isSubmitting}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-0"
              >
                {form.formState.isSubmitting ? (
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
              </Button>
            </div>

            {/* Example URLs */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">{t('form.try_label')}</span>
              {['https://github.com', 'https://twitter.com', 'https://stackoverflow.com'].map(
                (example) => (
                  <Button
                    key={example}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTryExample(example)}
                    className="rounded-full border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                  >
                    {getDomainFromUrl(example)}
                  </Button>
                )
              )}
            </div>
          </div>
        </form>

        {/* Error Message */}
        {form.formState.errors.url && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{form.formState.errors.url.message}</p>
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
              <p className="text-sm">{t('warnings.captcha_message')}</p>
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
              <p className="text-sm">{t('warnings.no_icons_message')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && icons.length > 0 && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-blue-200/50 transition-all duration-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('results.found', {
                  count: data.found.length,
                  plural: data.found.length !== 1 ? 's' : '',
                })}
              </h2>
              <p className="text-sm text-gray-600">
                {t('results.extracted_from', { domain: getDomainFromUrl(form.getValues('url')) })}
              </p>
            </div>
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingZip}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              {downloadingZip ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('results.downloading', {
                    current: downloadProgress.current,
                    total: downloadProgress.total,
                  })}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  {t('results.download_all')}
                </>
              )}
            </Button>
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
                  <IconCard icon={icon} websiteUrl={form.getValues('url')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
