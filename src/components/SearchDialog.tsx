'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'doc' | 'blog';
}

interface SearchDialogProps {
  locale: string;
  translations: {
    searchPlaceholder: string;
    searching: string;
    noResults: string;
    startTyping: string;
    closeHint: string;
    openHint: string;
    docs: string;
    blog: string;
  };
}

export function SearchDialog({ locale, translations }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [locale]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">{translations.searchPlaceholder}</span>
        <kbd className="hidden rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 md:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">{translations.searching}</div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600">
                      {result.type === 'doc' ? translations.docs : translations.blog}
                    </span>
                  </div>
                  <div className="mt-1 font-medium text-gray-900">{result.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {result.content.substring(0, 150)}...
                  </div>
                </a>
              ))}
            </div>
          ) : query ? (
            <div className="py-8 text-center text-sm text-gray-500">{translations.noResults}</div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">{translations.startTyping}</div>
          )}
        </div>

        {/* 提示 */}
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{translations.closeHint}</span>
            <span>{translations.openHint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
