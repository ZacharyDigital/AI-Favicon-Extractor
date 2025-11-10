'use client';

import { useMemo, useRef, useState } from 'react';

export interface ImageGeneratorTranslations {
  uploadTitle: string;
  uploadDesc: string;
  browseFiles: string;
  background: string;
  transparentBackground: string;
  padding: string;
  shape: string;
  livePreview: string;
  packageTitle: string;
  instantGenerate: string;
  downloadAllZip: string;
  previewBrowserLight: string;
  previewBrowserDark: string;
  previewGoogleLight: string;
  previewGoogleDark: string;
  previewAppleTouch: string;
  previewAndroidHome: string;
  previewAndroidSplash: string;
  previewAndroidSwitch: string;
  previewWindows: string;
}

export interface ImageGeneratorProps {
  translations: ImageGeneratorTranslations;
}

function ImageGenerator({ translations }: ImageGeneratorProps) {
  const [padding, setPadding] = useState(10);
  const [radius, setRadius] = useState(25);
  const [transparentBg, setTransparentBg] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 实时预览：使用 useMemo 生成预览 URL，避免 effect 中 setState
  const previewUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return '';
  }, [file]);

  async function handleGenerateZip() {
    if (!file) return;
    try {
      setIsGenerating(true);
      const form = new FormData();
      form.append('image', file);
      form.append('padding', String(padding));
      form.append('radius', String(radius));
      form.append('transparentBg', String(transparentBg));
      form.append('backgroundColor', backgroundColor);

      const res = await fetch('/api/image-generator', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        setIsGenerating(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon-package.zip';
      a.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (e) {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left Panel: Controls */}
      <div className="flex flex-col gap-6">
        {/* Upload Box */}
        <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#ede7f3] bg-white px-6 py-14 dark:border-[#3a2d48] dark:bg-[#21182c]">
          <div className="flex max-w-[480px] flex-col items-center gap-2 text-center">
            <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#191022] dark:text-[#f7f6f8]">
              {translations.uploadTitle}
            </p>
            <p className="text-sm font-normal leading-normal text-[#734c9a] dark:text-[#a28ab8]">
              {translations.uploadDesc}
            </p>
          </div>
          <button
            className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec]/20 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#140d1b] dark:text-[#f7f6f8]"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="truncate">{translations.browseFiles}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/bmp"
            className="hidden"
            aria-label="Upload image file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="text-xs text-[#734c9a] dark:text-[#a28ab8]">Selected: {file.name}</p>
          )}
        </div>

        {/* Background */}
        <details
          className="group flex flex-col rounded-lg border border-[#ede7f3] bg-white px-[15px] py-[7px] dark:border-[#3a2d48] dark:bg-[#21182c]"
          open
        >
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
            <p className="text-sm font-medium leading-normal text-[#191022] dark:text-[#f7f6f8]">
              {translations.background}
            </p>
            <svg
              className="h-6 w-6 text-[#140d1b] dark:text-[#f7f6f8] transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="space-y-4 pb-4 pt-2">
            <p className="text-sm font-normal leading-normal text-[#734c9a] dark:text-[#a28ab8]">
              Choose a background color for your favicon.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Preset color swatches (non-functional) */}
              {['#ffffff', '#140d1b', '#4a90e2', '#00c49f', '#ff6b6b'].map((color) => (
                <label
                  key={color}
                  className="size-10 rounded-full border border-[#ede7f3] ring-[#7f13ec] has-[:checked]:border-[3px] has-[:checked]:border-white has-[:checked]:ring-2 dark:border-[#3a2d48]"
                  style={{ backgroundColor: color }}
                >
                  <input
                    className="invisible"
                    name="background-color"
                    type="radio"
                    value={color}
                    checked={backgroundColor === color}
                    onChange={() => setBackgroundColor(color)}
                    aria-label={`Background color ${color}`}
                  />
                </label>
              ))}
              {/* Custom color (placeholder) */}
              <label
                className="size-10 flex items-center justify-center rounded-full border border-[#ede7f3] ring-[#7f13ec] has-[:checked]:border-[3px] has-[:checked]:border-white has-[:checked]:ring-2 dark:border-[#3a2d48]"
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
                }}
              >
                <svg
                  className="h-5 w-5 text-[#140d1b] dark:text-[#f7f6f8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <input
                  className="invisible absolute"
                  name="background-color"
                  type="radio"
                  value="custom"
                  aria-label="Background color custom"
                />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-medium text-[#191022] dark:text-[#f7f6f8]"
                htmlFor="transparent-bg"
              >
                {translations.transparentBackground}
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  id="transparent-bg"
                  className="peer sr-only"
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#7f13ec] dark:bg-gray-700">
                  <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full" />
                </div>
              </label>
            </div>
          </div>
        </details>

        {/* Padding */}
        <details className="group flex flex-col rounded-lg border border-[#ede7f3] bg-white px-[15px] py-[7px] dark:border-[#3a2d48] dark:bg-[#21182c]">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
            <p className="text-sm font-medium leading-normal text-[#191022] dark:text-[#f7f6f8]">
              {translations.padding}
            </p>
            <svg
              className="h-6 w-6 text-[#140d1b] dark:text-[#f7f6f8] transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="space-y-4 pb-4 pt-2">
            <p className="text-sm font-normal leading-normal text-[#734c9a] dark:text-[#a28ab8]">
              Adjust the space around your image.
            </p>
            <div className="flex items-center gap-4">
              <input
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#7f13ec]/20 accent-[#7f13ec]"
                type="range"
                min={0}
                max={50}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
              />
              <span className="w-8 text-center text-sm font-medium text-[#191022] dark:text-[#f7f6f8]">
                {padding}%
              </span>
            </div>
          </div>
        </details>

        {/* Shape */}
        <details className="group flex flex-col rounded-lg border border-[#ede7f3] bg-white px-[15px] py-[7px] dark:border-[#3a2d48] dark:bg-[#21182c]">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
            <p className="text-sm font-medium leading-normal text-[#191022] dark:text-[#f7f6f8]">
              {translations.shape}
            </p>
            <svg
              className="h-6 w-6 text-[#140d1b] dark:text-[#f7f6f8] transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="space-y-4 pb-4 pt-2">
            <p className="text-sm font-normal leading-normal text-[#734c9a] dark:text-[#a28ab8]">
              Set the corner radius for the background.
            </p>
            <div className="flex items-center gap-4">
              <input
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#7f13ec]/20 accent-[#7f13ec]"
                type="range"
                min={0}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
              <span className="w-8 text-center text-sm font-medium text-[#191022] dark:text-[#f7f6f8]">
                {radius}%
              </span>
            </div>
          </div>
        </details>
      </div>

      {/* Right Panel: Preview & Output */}
      <div className="flex flex-col gap-6">
        {/* Live Preview - Multi-Scenario */}
        <div className="rounded-xl border border-[#ede7f3] bg-white p-6 dark:border-[#3a2d48] dark:bg-[#21182c]">
          <h3 className="mb-4 text-lg font-bold text-[#191022] dark:text-[#f7f6f8]">
            {translations.livePreview}
          </h3>

          <div className="space-y-6">
            {/* Browser Tab - Light & Dark */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#734c9a] dark:text-[#a28ab8]">
                Browser Tab
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Light Theme */}
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="mb-2 text-xs text-gray-500">{translations.previewBrowserLight}</p>
                  <div className="flex items-center gap-2 rounded-md bg-gray-50 p-2">
                    <div
                      className="flex size-4 items-center justify-center overflow-hidden rounded-sm"
                      style={{ backgroundColor: transparentBg ? '#f9fafb' : backgroundColor }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="favicon"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="size-3 rounded-sm bg-[#4a90e2]" />
                      )}
                    </div>
                    <span className="text-xs text-gray-700">Your Website</span>
                  </div>
                </div>
                {/* Dark Theme */}
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                  <p className="mb-2 text-xs text-gray-400">{translations.previewBrowserDark}</p>
                  <div className="flex items-center gap-2 rounded-md bg-gray-800 p-2">
                    <div
                      className="flex size-4 items-center justify-center overflow-hidden rounded-sm"
                      style={{ backgroundColor: transparentBg ? '#1f2937' : backgroundColor }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="favicon"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="size-3 rounded-sm bg-[#4a90e2]" />
                      )}
                    </div>
                    <span className="text-xs text-gray-300">Your Website</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Search Result - Light & Dark */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#734c9a] dark:text-[#a28ab8]">
                Google Search
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Light */}
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="mb-2 text-xs text-gray-500">{translations.previewGoogleLight}</p>
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
                      style={{ backgroundColor: transparentBg ? '#f3f4f6' : backgroundColor }}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="favicon" className="h-5 w-5 object-contain" />
                      ) : (
                        <div className="size-4 rounded-sm bg-[#4a90e2]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-xs text-blue-700">https://yourwebsite.com</div>
                      <div className="text-sm font-medium text-gray-900">Your Website Title</div>
                      <div className="mt-1 text-xs text-gray-600">
                        Description of your website...
                      </div>
                    </div>
                  </div>
                </div>
                {/* Dark */}
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                  <p className="mb-2 text-xs text-gray-400">{translations.previewGoogleDark}</p>
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
                      style={{ backgroundColor: transparentBg ? '#374151' : backgroundColor }}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="favicon" className="h-5 w-5 object-contain" />
                      ) : (
                        <div className="size-4 rounded-sm bg-[#4a90e2]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-xs text-blue-400">https://yourwebsite.com</div>
                      <div className="text-sm font-medium text-gray-100">Your Website Title</div>
                      <div className="mt-1 text-xs text-gray-400">
                        Description of your website...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apple Touch Icon */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#734c9a] dark:text-[#a28ab8]">
                iOS Home Screen
              </p>
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-500 to-purple-600 p-4">
                <p className="mb-3 text-xs text-white/80">{translations.previewAppleTouch}</p>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-2 flex size-16 items-center justify-center overflow-hidden shadow-lg"
                      style={{
                        borderRadius: `${Math.max(12, radius / 2)}%`,
                        backgroundColor: transparentBg ? '#ffffff' : backgroundColor,
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="icon"
                          className="h-full w-full object-contain"
                          style={{ padding: `${padding / 4}%` }}
                        />
                      ) : (
                        <div className="size-12 rounded-lg bg-[#4a90e2]" />
                      )}
                    </div>
                    <div className="text-xs font-medium text-white">Your App</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Android PWA */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#734c9a] dark:text-[#a28ab8]">
                Android PWA
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Home Screen */}
                <div className="rounded-lg border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-3">
                  <p className="mb-2 text-xs text-gray-600">{translations.previewAndroidHome}</p>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-1 flex size-14 items-center justify-center overflow-hidden shadow-md"
                        style={{
                          borderRadius: `${Math.max(18, radius / 2)}%`,
                          backgroundColor: transparentBg ? '#ffffff' : backgroundColor,
                        }}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="icon"
                            className="h-full w-full object-contain"
                            style={{ padding: `${padding / 4}%` }}
                          />
                        ) : (
                          <div className="size-10 rounded-xl bg-[#4a90e2]" />
                        )}
                      </div>
                      <div className="text-xs text-gray-700">App</div>
                    </div>
                  </div>
                </div>
                {/* Splash Screen */}
                <div className="rounded-lg border border-gray-300 bg-white p-3">
                  <p className="mb-2 text-xs text-gray-600">{translations.previewAndroidSplash}</p>
                  <div className="flex h-32 items-center justify-center bg-gradient-to-b from-white to-gray-50">
                    <div
                      className="flex size-20 items-center justify-center overflow-hidden shadow-xl"
                      style={{
                        borderRadius: `${Math.max(20, radius / 2)}%`,
                        backgroundColor: transparentBg ? '#ffffff' : backgroundColor,
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="icon"
                          className="h-full w-full object-contain"
                          style={{ padding: `${padding / 4}%` }}
                        />
                      ) : (
                        <div className="size-16 rounded-2xl bg-[#4a90e2]" />
                      )}
                    </div>
                  </div>
                </div>
                {/* App Switcher */}
                <div className="rounded-lg border border-gray-300 bg-gray-800 p-3">
                  <p className="mb-2 text-xs text-gray-300">{translations.previewAndroidSwitch}</p>
                  <div className="rounded-lg bg-white p-2">
                    <div className="mb-1 flex items-center gap-2">
                      <div
                        className="flex size-6 shrink-0 items-center justify-center overflow-hidden"
                        style={{
                          borderRadius: `${Math.max(4, radius / 4)}%`,
                          backgroundColor: transparentBg ? '#f3f4f6' : backgroundColor,
                        }}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="icon"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="size-4 rounded bg-[#4a90e2]" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-900">Your App</span>
                    </div>
                    <div className="h-12 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Windows Tile */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#734c9a] dark:text-[#a28ab8]">
                Windows Start Menu
              </p>
              <div className="rounded-lg border border-gray-300 bg-gradient-to-br from-blue-600 to-blue-700 p-4">
                <p className="mb-3 text-xs text-white/80">{translations.previewWindows}</p>
                <div className="flex items-center justify-center">
                  <div
                    className="flex size-24 items-center justify-center overflow-hidden shadow-lg"
                    style={{
                      backgroundColor: transparentBg ? '#0078d4' : backgroundColor,
                    }}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="tile" className="h-3/4 w-3/4 object-contain" />
                    ) : (
                      <div className="size-16 bg-white/90" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package List */}
        <div className="rounded-xl border border-[#ede7f3] bg-white p-6 dark:border-[#3a2d48] dark:bg-[#21182c]">
          <h3 className="mb-4 text-lg font-bold text-[#191022] dark:text-[#f7f6f8]">
            {translations.packageTitle}
          </h3>
          <div className="max-h-60 space-y-3 overflow-y-auto pr-2">
            {[
              'android-chrome-192x192.png',
              'android-chrome-512x512.png',
              'apple-touch-icon.png',
              'favicon-16x16.png',
              'favicon-32x32.png',
              'favicon.ico',
              'site.webmanifest',
            ].map((name) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-[#734c9a] dark:text-[#a28ab8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7z"
                    />
                  </svg>
                  <span className="text-[#191022] dark:text-[#f7f6f8]">{name}</span>
                </div>
                <span className="text-[#734c9a] dark:text-[#a28ab8]">—</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            className="flex-1 flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec]/20 px-6 text-base font-bold leading-normal tracking-[0.015em] text-[#140d1b] dark:text-[#f7f6f8]"
            onClick={handleGenerateZip}
            disabled={!file || isGenerating}
          >
            <span className="truncate">
              {isGenerating ? 'Generating...' : translations.instantGenerate}
            </span>
          </button>
          <button
            className="flex-1 flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec] px-6 text-base font-bold leading-normal tracking-[0.015em] text-white"
            onClick={handleGenerateZip}
            disabled={!file || isGenerating}
          >
            <span className="truncate">
              {isGenerating ? 'Preparing ZIP...' : translations.downloadAllZip}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
