/**
 * Маршрут `/` — главный экран приложения, каталог товаров.
 *
 * @module
 */

import { CatalogScreen } from '../../features/products/ui/CatalogScreen';

/**
 * Файл маршрута ничего не считает сам, он только показывает экран каталога из папки `features`.
 *
 * @returns Экран каталога.
 */
export default function CatalogRoute() {
  return <CatalogScreen />;
}
