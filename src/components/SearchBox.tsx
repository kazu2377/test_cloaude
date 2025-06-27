"use client";

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBox() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL パラメータから初期値を設定
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  // デバウンス用のタイマー
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // 検索パラメータが変更された時の処理
  const handleSearch = (newQuery: string, newFilter: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      
      if (newQuery.trim()) {
        params.set('q', newQuery);
      } else {
        params.delete('q');
      }
      
      if (newFilter !== 'all') {
        params.set('filter', newFilter);
      } else {
        params.delete('filter');
      }
      
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl);
    });
  };

  // 検索クエリの変更時（デバウンス付き）
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    
    // 既存のタイマーをクリア
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // 300ms後に検索実行
    const timer = setTimeout(() => {
      handleSearch(newQuery, filter);
    }, 300);
    
    setDebounceTimer(timer);
  };

  // フィルターの変更時（即座に実行）
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    handleSearch(query, newFilter);
  };

  // 検索クリア
  const handleClear = () => {
    setQuery('');
    setFilter('all');
    handleSearch('', 'all');
  };

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">TODOを検索</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 検索ボックス */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="TODOのタイトルを検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* フィルター */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="pending">未完了</option>
            <option value="completed">完了済み</option>
          </select>
          
          {/* クリアボタン */}
          {(query || filter !== 'all') && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              クリア
            </button>
          )}
        </div>
      </div>
      
      {/* 検索中表示 */}
      {isPending && (
        <div className="mt-2 text-sm text-gray-500">
          検索中...
        </div>
      )}
    </div>
  );
}