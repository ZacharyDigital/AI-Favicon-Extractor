'use client';

import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import type { IconAnalysis } from '@/types/favicon';
import { cn } from '@/lib/utils';

interface AnalysisPanelProps {
  analysis: IconAnalysis;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Needs Improvement';
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Intelligent Analysis</h2>
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

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="text-2xl font-bold text-blue-900">{analysis.totalIcons}</div>
          <div className="text-sm text-blue-700">Total Icons</div>
        </div>
        <div className="rounded-lg bg-green-50 p-3">
          <div className="text-2xl font-bold text-green-900">
            {analysis.hasSVG ? '✓' : '✗'}
          </div>
          <div className="text-sm text-green-700">SVG Format</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-3">
          <div className="text-2xl font-bold text-purple-900">
            {analysis.hasManifest ? '✓' : '✗'}
          </div>
          <div className="text-sm text-purple-700">Web Manifest</div>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Best Practices Detected
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
            Improvement Suggestions
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
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Feature Coverage</h3>
        <div className="space-y-2">
          <FeatureItem
            label="Apple Touch Icon"
            present={analysis.hasAppleTouchIcon}
            description="For iOS home screen"
          />
          <FeatureItem
            label="High Resolution (512x512+)"
            present={analysis.hasHighRes}
            description="For PWA and modern displays"
          />
          <FeatureItem
            label="SVG Format"
            present={analysis.hasSVG}
            description="Scalable vector graphics"
          />
          <FeatureItem
            label="Web Manifest"
            present={analysis.hasManifest}
            description="PWA configuration"
          />
          <FeatureItem
            label="BrowserConfig"
            present={analysis.hasBrowserConfig}
            description="Windows tile images"
          />
        </div>
      </div>
    </div>
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
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
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
