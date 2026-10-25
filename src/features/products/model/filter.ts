/**
 * Поиск и фильтры каталога. Обычная функция без state: получила список и условия — вернула результат.
 *
 * @module
 */

import { getStockStatus } from './stock';
import type { Topic } from './Topic';

/** Условия отбора товаров в каталоге. */
export type CatalogFilter = {
  /** Текст из строки поиска. Пустая строка — искать не нужно. */
  query: string;
  /** Выбранная категория. `null` — фильтр не выбран, показываются все. */
  category: string | null;
  /** Включён ли фильтр «Только заканчивающиеся». */
  lowOnly: boolean;
};

/**
 * Оставляет только товары, которые подходят под все условия сразу.
 *
 * Поиск без учёта регистра: текст и названия переводятся в маленькие буквы.
 * Текст ищется и в названии, и в артикуле.
 *
 * @param topics - Все загруженные товары.
 * @param filter - Условия: текст поиска, категория, «только заканчивающиеся».
 * @returns Новый массив подходящих товаров. Исходный массив не меняется.
 */
export function filterTopics(topics: Topic[], filter: CatalogFilter): Topic[] {
  const text = filter.query.trim().toLowerCase();

  return topics.filter((topic) => {
    if (text) {
      const inTitle = topic.title.toLowerCase().includes(text);
      const inSku = topic.sku.toLowerCase().includes(text);
      if (!inTitle && !inSku) return false;
    }
    if (filter.category && topic.category !== filter.category) return false;
    if (filter.lowOnly && getStockStatus(topic.stock) === 'in_stock') return false;
    return true;
  });
}
