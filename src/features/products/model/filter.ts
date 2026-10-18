import { getStockStatus } from './stock';
import type { Topic } from './Topic';

export type CatalogFilter = {
  query: string;
  category: string | null;
  lowOnly: boolean;
};

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
