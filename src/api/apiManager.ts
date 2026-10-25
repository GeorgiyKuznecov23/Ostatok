/**
 * Единая точка входа в API. Экраны и хуки обращаются к серверу только через `apiManager`.
 *
 * @module
 */

import { productsApi } from './products/productsApi';

/**
 * Объединяет тематические модули API. Сейчас модуль один — товары.
 * Цепочка запроса: хук → `apiManager` → `transportService` → сервер.
 */
export const apiManager = {
  /** Запросы про товары: весь список и один товар по номеру. */
  products: productsApi,
};
