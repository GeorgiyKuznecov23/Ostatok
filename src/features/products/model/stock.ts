/**
 * Правила для остатка: когда товар «в наличии», когда его «мало», когда его «нет».
 *
 * @module
 */

/** Статус остатка: `in_stock` — в наличии, `low_stock` — мало, `out_of_stock` — нет. */
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

/**
 * Порог «мало»: если штук меньше этого числа, товар считается заканчивающимся.
 * Чтобы поменять правило, достаточно поменять число здесь.
 */
export const LOW_STOCK_LIMIT = 10;

/**
 * Определяет статус по количеству штук.
 *
 * @param stock - Остаток в штуках.
 * @returns `out_of_stock`, если штук 0 или меньше; `low_stock`, если меньше порога; иначе `in_stock`.
 */
export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock < LOW_STOCK_LIMIT) return 'low_stock';
  return 'in_stock';
}
