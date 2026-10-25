/**
 * Запросы про товары к DummyJSON: какие адреса спрашивать и как проверить ответ.
 *
 * @module
 */

import type { Topic } from '../../features/products/model/Topic';
import { apiError } from '../../shared/api/errors';
import { logEvent } from '../../shared/api/logger';
import { requestJson, type JsonResult } from '../../shared/api/transportService';
import { parseProduct, parseProductList, toTopic } from './productDto';

/** Настройки вызова. */
export type CallOptions = {
  /** Сигнал отмены от хука. Когда хук отменяет запрос, этот сигнал срабатывает. */
  signal?: AbortSignal;
};

/** Поля, которые просим у сервера для списка. Только нужные — так ответ в несколько раз меньше. */
const LIST_FIELDS = 'id,title,description,category,brand,sku,stock,price,thumbnail,minimumOrderQuantity';

/**
 * Проверяет ответ сервера и превращает его в модель приложения.
 * Если проверка не прошла — пишет в лог `api.contract_error` и выдаёт ошибку `contract_error`.
 *
 * @param result - Ответ от `transportService`.
 * @param route - Маршрут для лога.
 * @param map - Как проверить и преобразовать данные.
 * @returns Готовые данные для приложения.
 */
function mapResponse<T>(result: JsonResult, route: string, map: (data: unknown) => T): T {
  try {
    return map(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid DTO';
    logEvent('api.contract_error', { requestId: result.requestId, route, message });
    throw apiError('contract_error', message, result.status, result.requestId);
  }
}

/** Модуль товаров. */
export const productsApi = {
  /**
   * Загрузить весь каталог одним запросом: `GET /products?limit=0&select=...`.
   * `limit=0` значит «все товары сразу». Каждый товар проверяется и превращается в `Topic`.
   *
   * @param options - Сигнал отмены.
   * @returns Список товаров.
   */
  async list({ signal }: CallOptions = {}): Promise<Topic[]> {
    const route = '/products';
    const result = await requestJson(`/products?limit=0&select=${LIST_FIELDS}`, { signal, route });
    return mapResponse(result, route, (data) => parseProductList(data).products.map(toTopic));
  },

  /**
   * Загрузить один товар: `GET /products/номер`. Если товара нет, сервер отвечает 404.
   *
   * @param id - Номер товара.
   * @param options - Сигнал отмены.
   * @returns Товар.
   */
  async getById(id: string, { signal }: CallOptions = {}): Promise<Topic> {
    const route = '/products/:id';
    const result = await requestJson(`/products/${encodeURIComponent(id)}`, { signal, route });
    return mapResponse(result, route, (data) => toTopic(parseProduct(data)));
  },
};
