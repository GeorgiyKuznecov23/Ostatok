export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

// Меньше этого количества считаем, что товар заканчивается
export const LOW_STOCK_LIMIT = 10;

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock < LOW_STOCK_LIMIT) return 'low_stock';
  return 'in_stock';
}
