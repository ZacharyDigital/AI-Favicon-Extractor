'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';

interface ArticleToolbarProps {
  content: string;
  title: string;
  locale: string;
}

export function ArticleToolbar({ content, title, locale }: ArticleToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [isOpenInMenuOpen, setIsOpenInMenuOpen] = useState(false);

  // 复制 Markdown 内容
  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(`# ${title}\n\n${content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 在 AI 平台中打开
  const handleOpenInAI = (platform: 'chatgpt' | 'gemini' | 'claude') => {
    const encodedContent = encodeURIComponent(`# ${title}\n\n${content}`);

    const urls = {
      chatgpt: `https://chat.openai.com/?q=${encodedContent}`,
      gemini: `https://gemini.google.com/app?q=${encodedContent}`,
      claude: `https://claude.ai/new?q=${encodedContent}`,
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer');
    setIsOpenInMenuOpen(false);
  };

  return (
    <div className="mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">
      {/* Copy Markdown 按钮 */}
      <button
        onClick={handleCopyMarkdown}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
        aria-label="Copy Markdown"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy Markdown</span>
          </>
        )}
      </button>

      {/* Open in... 下拉菜单 */}
      <div className="relative">
        <button
          onClick={() => setIsOpenInMenuOpen(!isOpenInMenuOpen)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
          aria-label="Open in AI platform"
        >
          <span>Open in...</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpenInMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* 下拉菜单内容 */}
        {isOpenInMenuOpen && (
          <>
            {/* 点击外部关闭 */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpenInMenuOpen(false)} />

            <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                {/* ChatGPT */}
                <button
                  onClick={() => handleOpenInAI('chatgpt')}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100">
                    <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                    </svg>
                  </div>
                  <span className="flex-1">Open in ChatGPT</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </button>

                {/* Gemini */}
                <button
                  onClick={() => handleOpenInAI('gemini')}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L9.798 6.641L3 8.643l6.641 2.202L11.643 18l2.202-6.641L20.487 9.16l-6.641-2.202z" />
                      <path d="M3 15.714L4.588 19.5l3.786 1.588L6.786 17.3z" />
                      <path d="M15.714 21L19.5 19.412l1.588-3.786L17.3 17.214z" />
                    </svg>
                  </div>
                  <span className="flex-1">Open in Gemini</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </button>

                {/* Claude */}
                <button
                  onClick={() => handleOpenInAI('claude')}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-100">
                    <svg
                      className="h-4 w-4 text-orange-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.7 3.2c-1.5-1.5-3.9-1.5-5.4 0L3.2 12.3c-1.5 1.5-1.5 3.9 0 5.4l3.1 3.1c1.5 1.5 3.9 1.5 5.4 0l9.1-9.1c1.5-1.5 1.5-3.9 0-5.4l-3.1-3.1zm-8 14.6c-.4.4-1 .4-1.4 0l-3.1-3.1c-.4-.4-.4-1 0-1.4l9.1-9.1c.4-.4 1-.4 1.4 0l3.1 3.1c.4.4.4 1 0 1.4l-9.1 9.1z" />
                    </svg>
                  </div>
                  <span className="flex-1">Open in Claude</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
