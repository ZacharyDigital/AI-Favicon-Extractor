import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IconAnalysis } from '@/types/favicon';
import { cn } from '@/lib/utils';

interface AnalysisPanelProps {
  analysis: IconAnalysis;
  translations: {
    title: string;
    excellent: string;
    good: string;
    needs_improvement: string;
    total_icons: string;
    svg_format: string;
    web_manifest: string;
    best_practices: string;
    improvements: string;
    feature_coverage: string;
    apple_touch_icon: string;
    apple_touch_icon_desc: string;
    high_resolution: string;
    high_resolution_desc: string;
    svg_format_desc: string;
    web_manifest_desc: string;
    browserconfig: string;
    browserconfig_desc: string;
  };
}

export function AnalysisPanel({ analysis, translations }: AnalysisPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return translations.excellent;
    if (score >= 50) return translations.good;
    return translations.needs_improvement;
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{translations.title}</CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={cn('text-3xl font-bold', getScoreColor(analysis.score))}>
                {analysis.score}
              </div>
              <div className="text-sm text-gray-500">{getScoreLabel(analysis.score)}</div>
            </div>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${analysis.score * 1.76} 176`}
                  className={getScoreRing(analysis.score)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className={cn('h-6 w-6', getScoreColor(analysis.score))} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-2xl font-bold text-blue-900">{analysis.totalIcons}</div>
            <div className="text-sm text-blue-700">{translations.total_icons}</div>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-2xl font-bold text-green-900">{analysis.hasSVG ? '✓' : '✗'}</div>
            <div className="text-sm text-green-700">{translations.svg_format}</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-3">
            <div className="text-2xl font-bold text-purple-900">
              {analysis.hasManifest ? '✓' : '✗'}
            </div>
            <div className="text-sm text-purple-700">{translations.web_manifest}</div>
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CheckCircle className="h-5 w-5 text-green-600" />
              {translations.best_practices}
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              {translations.improvements}
            </h3>
            <div className="space-y-2">
              {analysis.warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Coverage */}
        <div className="mt-6 border-t border-gray-300 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            {translations.feature_coverage}
          </h3>
          <div className="space-y-2">
            <FeatureItem
              label={translations.apple_touch_icon}
              present={analysis.hasAppleTouchIcon}
              description={translations.apple_touch_icon_desc}
            />
            <FeatureItem
              label={translations.high_resolution}
              present={analysis.hasHighRes}
              description={translations.high_resolution_desc}
            />
            <FeatureItem
              label={translations.svg_format}
              present={analysis.hasSVG}
              description={translations.svg_format_desc}
            />
            <FeatureItem
              label={translations.web_manifest}
              present={analysis.hasManifest}
              description={translations.web_manifest_desc}
            />
            <FeatureItem
              label={translations.browserconfig}
              present={analysis.hasBrowserConfig}
              description={translations.browserconfig_desc}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureItem({
  label,
  present,
  description,
}: {
  label: string;
  present: boolean;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div>
        {present ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        )}
      </div>
    </div>
  );
}
