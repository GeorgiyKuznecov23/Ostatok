import type { Topic } from '../../features/products/model/Topic';
import { apiError } from '../../shared/api/errors';
import { logEvent } from '../../shared/api/logger';
import { requestJson, type JsonResult } from '../../shared/api/transportService';
import { parseProduct, parseProductList, toTopic } from './productDto';

type CallOptions = {
  signal?: AbortSignal;
};

// Просим у сервера только нужные поля, так ответ в несколько раз меньше
const LIST_FIELDS = 'id,title,description,category,brand,sku,stock,price,thumbnail,minimumOrderQuantity';

function mapResponse<T>(result: JsonResult, route: string, map: (data: unknown) => T): T {
  try {
    return map(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid DTO';
    logEvent('api.contract_error', { requestId: result.requestId, route, message });
    throw apiError('contract_error', message, result.status, result.requestId);
  }
}

export const productsApi = {
  // limit=0 — DummyJSON отдаёт весь каталог одним ответом
  async list({ signal }: CallOptions = {}): Promise<Topic[]> {
    const route = '/products';
    const result = await requestJson(`/products?limit=0&select=${LIST_FIELDS}`, { signal, route });
    return mapResponse(result, route, (data) => parseProductList(data).products.map(toTopic));
  },

  async getById(id: string, { signal }: CallOptions = {}): Promise<Topic> {
    const route = '/products/:id';
    const result = await requestJson(`/products/${encodeURIComponent(id)}`, { signal, route });
    return mapResponse(result, route, (data) => toTopic(parseProduct(data)));
  },
};
