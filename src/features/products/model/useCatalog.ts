/**
 * Хук каталога: вся логика экрана каталога — поиск, фильтры, порции и отметки.
 * Экран `CatalogScreen` только рисует то, что отдаёт этот хук.
 *
 * @module
 */

import { useEffect, useState } from 'react';

import type { ApiError } from '../../../shared/api/errors';
import { filterTopics } from './filter';
import { useSelection } from './selection';
import type { Topic } from './Topic';
import { useProductList, type DataSource, type ListStatus } from './useProductList';

/** Сколько миллисекунд ждать после последней буквы, прежде чем искать. */
const SEARCH_DELAY = 300;
/** Сколько карточек показывать за один раз. При прокрутке до конца добавляется ещё столько же. */
const PAGE_SIZE = 20;

/** Всё, что хук каталога отдаёт экрану. */
export type CatalogState = {
  /** Откуда данные: с сервера или демо. */
  source: DataSource;
  /** Состояние загрузки списка: загрузка, успех или ошибка. */
  status: ListStatus;
  /** Ошибка загрузки или `null`. */
  error: ApiError | null;
  /** Загрузить список с сервера заново. */
  reload: () => void;
  /** Включить демо-данные. */
  showDemo: () => void;
  /** Все загруженные товары, без фильтров. */
  topics: Topic[];
  /** Текст, который сейчас написан в строке поиска. */
  query: string;
  /** Записать новый текст поиска. Вызывается на каждую букву. */
  setQuery: (value: string) => void;
  /** Выбранная категория или `null`, если выбрано «Все». */
  category: string | null;
  /** Выбрать категорию (`null` — снять фильтр). */
  setCategory: (value: string | null) => void;
  /** Все категории, которые есть среди загруженных товаров, без повторов. Из них рисуются чипы. */
  categories: string[];
  /** Включён ли фильтр «Только заканчивающиеся». */
  lowOnly: boolean;
  /** Включить или выключить «Только заканчивающиеся». */
  toggleLowOnly: () => void;
  /** Есть ли хоть одно условие. От этого зависит, показывать ли кнопку «Сбросить». */
  hasFilters: boolean;
  /** Сбросить поиск и все фильтры. */
  resetFilters: () => void;
  /** Товары, которые сейчас на экране: найденные, но не больше, чем показано порциями. */
  items: Topic[];
  /** Сколько всего товаров подходит под условия. */
  foundCount: number;
  /** Есть ли ещё найденные товары, которые пока не показаны. */
  hasMore: boolean;
  /** Показать следующую порцию. */
  showMore: () => void;
  /** Номера товаров, отмеченных «в дозаказ». */
  selectedIds: string[];
  /** Отметить товар или снять отметку. */
  toggleSelected: (id: string) => void;
  /** Снять все отметки. */
  clearSelected: () => void;
};

/**
 * Хук каталога.
 *
 * Список берёт из `useProductList`, отметки — из `useSelection`, сам хранит поиск, фильтры и сколько карточек показано.
 * Каждый раз при отрисовке заново считает найденные товары через `filterTopics`.
 *
 * @returns Всё, что нужно экрану каталога, одним объектом.
 */
export function useCatalog(): CatalogState {
  /** Загрузка списка и демо-режим. */
  const list = useProductList();
  /** Общие отметки «в дозаказ». */
  const selection = useSelection();

  /** Текст в строке поиска (state). Меняется на каждую букву. */
  const [query, setQuery] = useState('');
  /** Текст, по которому реально ищем (state). Обновляется через 300 мс после последней буквы. */
  const [debouncedQuery, setDebouncedQuery] = useState('');
  /** Выбранная категория (state). */
  const [category, setCategoryValue] = useState<string | null>(null);
  /** Включён ли «Только заканчивающиеся» (state). */
  const [lowOnly, setLowOnly] = useState(false);
  /** Сколько карточек сейчас показано (state): 20, 40, 60… */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /**
   * Задержка поиска. При каждом изменении `query` ставится таймер на 300 мс.
   * Когда он срабатывает — ищем по этому тексту и снова показываем первую порцию.
   * Cleanup (`clearTimeout`) отменяет прошлый таймер, поэтому при быстром вводе поиск срабатывает один раз.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setVisibleCount(PAGE_SIZE);
    }, SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [query]);

  /** Все товары, подходящие под поиск и фильтры. */
  const found = filterTopics(list.topics, { query: debouncedQuery, category, lowOnly });
  /** Первые `visibleCount` из найденных — то, что видно на экране. */
  const items = found.slice(0, visibleCount);
  /** Есть ли ещё не показанные найденные товары. */
  const hasMore = items.length < found.length;
  /** Категории загруженных товаров без повторов (`Set` убирает повторы). */
  const categories = Array.from(new Set(list.topics.map((topic) => topic.category)));
  /** Задано ли хоть одно условие. */
  const hasFilters = query !== '' || category !== null || lowOnly;

  /** Выбрать категорию и начать показ с первой порции. */
  const setCategory = (value: string | null) => {
    setCategoryValue(value);
    setVisibleCount(PAGE_SIZE);
  };

  /** Переключить «Только заканчивающиеся» и начать с первой порции. */
  const toggleLowOnly = () => {
    setLowOnly((prev) => !prev);
    setVisibleCount(PAGE_SIZE);
  };

  /** Добавить ещё одну порцию, если есть что добавлять. Вызывается при прокрутке до конца списка. */
  const showMore = () => {
    if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  /** Вернуть всё как было: пустой поиск, все категории, фильтр выключен, первая порция. */
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
