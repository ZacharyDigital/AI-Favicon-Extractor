'use client';

import { useState } from 'react';
import { ChevronRight, FileText, Menu, X } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

interface DocsSidebarProps {
  items: NavItem[];
  currentPath: string;
}

export function DocsSidebar({ items, currentPath }: DocsSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const NavItems = ({ items: navItems, level = 0 }: { items: NavItem[]; level?: number }) => (
    <ul className={level === 0 ? 'space-y-1' : 'ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4'}>
      {navItems.map((item) => {
        const isActive = currentPath === item.href;
        const isExpanded = expandedItems.has(item.title);
        const hasChildren = item.items && item.items.length > 0;

        return (
          <li key={item.href}>
            <div className="flex items-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.title)}
                  className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  <FileText className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              ) : (
                <a
                  href={item.href}
                  className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              )}
            </div>
            {hasChildren && isExpanded && item.items && (
              <NavItems items={item.items} level={level + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 桌面端侧边栏 */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-8">
          <nav className="space-y-1">
            <NavItems items={items} />
          </nav>
        </div>
      </aside>

      {/* 移动端侧边栏 */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />

          {/* 侧边栏内容 */}
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-900">导航</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 导航内容 */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                  <NavItems items={items} />
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
