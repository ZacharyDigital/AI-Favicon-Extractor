import { Package } from 'lucide-react';
import { FaviconExtractor } from '@/components/FaviconExtractor';
import { StructuredData } from '@/components/StructuredData';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StructuredData />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AIFavicon Extractor
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                The most comprehensive favicon extraction tool
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Package className="h-4 w-4" />
              Powered by Deep Crawler
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FaviconExtractor />

        {/* Static SEO Content - Empty State (Server-rendered) */}
        <section className="mx-auto mt-16 max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6">
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Extract All Favicons from Any Website
          </h2>
          <p className="mb-8 text-gray-600">
            Our deep crawler extracts all icon formats including HTML, Web Manifest, BrowserConfig,
            and provides intelligent analysis with download options.
          </p>
          <div className="grid gap-4 text-left sm:grid-cols-2">
            {[
              { title: 'Deep Extraction', desc: 'Finds all icon formats and sizes' },
              { title: 'Visual Matrix', desc: 'Preview all icons before download' },
              { title: 'One-Click ZIP', desc: 'Download everything at once' },
              { title: 'Smart Analysis', desc: 'Get insights and recommendations' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          <p>
            Powered by Deep Favicon Fetcher Backend with Puppeteer • Supports all modern icon standards
          </p>
        </div>
      </footer>
    </div>
  );
}
