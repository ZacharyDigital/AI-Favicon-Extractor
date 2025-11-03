export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Favicon Extractor',
    description: 'Extract all favicons from any website with deep crawling. Supports HTML, Web Manifest, BrowserConfig, and provides intelligent analysis with download options.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    featureList: [
      'Deep crawling for comprehensive favicon extraction',
      'Support for multiple icon standards (HTML, Web Manifest, BrowserConfig)',
      'Intelligent analysis and recommendations',
      'One-click ZIP download',
      'Preview all icon formats and sizes',
      'Headless browser rendering for JavaScript-driven sites',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
