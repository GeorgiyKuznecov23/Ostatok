import { useEffect, useState } from 'react';

import { filterTopics } from './filter';
import { useSelection } from './selection';
import { useProductList } from './useProductList';

// Сколько ждать после последней буквы, прежде чем искать
const SEARCH_DELAY = 300;
// Сколько карточек показывать за один раз
const PAGE_SIZE = 20;

export function useCatalog() {
  const list = useProductList();
  const selection = useSelection();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategoryValue] = useState<string | null>(null);
  const [lowOnly, setLowOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setVisibleCount(PAGE_SIZE);
    }, SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [query]);

  const found = filterTopics(list.topics, { query: debouncedQuery, category, lowOnly });
  const items = found.slice(0, visibleCount);
  const hasMore = items.length < found.length;
  const categories = Array.from(new Set(list.topics.map((topic) => topic.category)));
  const hasFilters = query !== '' || category !== null || lowOnly;

  const setCategory = (value: string | null) => {
    setCategoryValue(value);
    setVisibleCount(PAGE_SIZE);
  };

  const toggleLowOnly = () => {
    setLowOnly((prev) => !prev);
    setVisibleCount(PAGE_SIZE);
  };

  const showMore = () => {
    if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const resetFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    setCategoryValue(null);
    setLowOnly(false);
    setVisibleCount(PAGE_SIZE);
  };

  return {
    source: list.source,
    status: list.status,
    error: list.error,
    reload: list.reload,
    showDemo: list.showDemo,
    topics: list.topics,
    query,
    setQuery,
    category,
    setCategory,
    categories,
    lowOnly,
    toggleLowOnly,
    hasFilters,
    resetFilters,
    items,
    foundCount: found.length,
    hasMore,
    showMore,
    selectedIds: selection.selectedIds,
    toggleSelected: selection.toggleSelected,
    clearSelected: selection.clearSelected,
  };
}
