/**
 * Маршрут карточки товара, например `/topic/16`.
 * Квадратные скобки в имени файла значат изменяемую часть адреса: номер товара попадает в параметр `id`.
 *
 * @module
 */

import { TopicScreen } from '../../features/products/ui/TopicScreen';

/**
 * Показывает экран карточки. Номер товара экран сам возьмёт из адреса.
 *
 * @returns Экран карточки товара.
 */
export default function TopicRoute() {
  return <TopicScreen />;
}
