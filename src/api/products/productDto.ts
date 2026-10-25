/**
 * Данные в том виде, в каком их присылает сервер (DTO), их проверка и превращение в модель приложения `Topic`.
 *
 * Ответ сервера приходит во время работы, TypeScript его заранее не видит.
 * Поэтому каждое поле проверяется руками: если формат неожиданный, получится понятная ошибка, а не падение интерфейса.
 *
 * @module
 */

import type { Topic } from '../../features/products/model/Topic';

/** Товар так, как его присылает DummyJSON. */
export type ProductDto = {
  /** Номер товара. Сервер присылает число. */
  id: number;
  /** Название. */
  title: string;
  /** Описание. */
  description: string;
  /** Код категории. */
  category: string;
  /** Бренд. Есть не у всех товаров. */
  brand?: string;
  /** Артикул. */
  sku: string;
  /** Остаток в штуках. */
  stock: number;
  /** Цена. */
  price: number;
  /** Ссылка на маленькую картинку. В модели приложения это `imageUrl`. */
  thumbnail?: string;
  /** Минимальная партия заказа. */
  minimumOrderQuantity?: number;
};

/** Ответ сервера на запрос списка. */
export type ProductListDto = {
  /** Товары. */
  products: ProductDto[];
  /** Сколько товаров всего в базе. */
  total: number;
};

/** Объект с полями неизвестного типа — так выглядит ответ сервера до проверки. */
type Fields = Record<string, unknown>;

/**
 * Проверяет, что значение — объект (а не `null`, массив, строка или число).
 *
 * @param value - Что пришло.
 * @param name - Название для текста ошибки.
 * @returns То же значение, но уже как объект с полями.
 * @throws Ошибку, если это не объект.
 */
function asObject(value: unknown, name: string): Fields {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${name}: not an object`);
  }
  return value as Fields;
}

/**
 * Обязательное текстовое поле.
 *
 * @param fields - Объект.
 * @param key - Имя поля.
 * @returns Значение поля.
 * @throws Ошибку с именем поля, если там не текст.
 */
function requireString(fields: Fields, key: string): string {
  const value = fields[key];
  if (typeof value !== 'string') throw new Error(`Invalid field "${key}"`);
  return value;
}

/**
 * Обязательное числовое поле. `NaN` и бесконечность не подходят.
 *
 * @param fields - Объект.
 * @param key - Имя поля.
 * @returns Значение поля.
 * @throws Ошибку с именем поля, если там не число.
 */
function requireNumber(fields: Fields, key: string): number {
  const value = fields[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Invalid field "${key}"`);
  return value;
}

/**
 * Необязательное текстовое поле: может отсутствовать, но если есть — должно быть текстом.
 *
 * @param fields - Объект.
 * @param key - Имя поля.
 * @returns Значение или `undefined`.
 */
function optionalString(fields: Fields, key: string): string | undefined {
  return fields[key] === undefined ? undefined : requireString(fields, key);
}

/**
 * Необязательное числовое поле.
 *
 * @param fields - Объект.
 * @param key - Имя поля.
 * @returns Значение или `undefined`.
 */
function optionalNumber(fields: Fields, key: string): number | undefined {
  return fields[key] === undefined ? undefined : requireNumber(fields, key);
}

/**
 * Проверяет один товар из ответа сервера.
 *
 * @param value - Что прислал сервер.
 * @returns Проверенный товар.
 * @throws Ошибку с названием неправильного поля, например `Invalid field "title"`.
 */
export function parseProduct(value: unknown): ProductDto {
  const fields = asObject(value, 'ProductDto');
  return {
    id: requireNumber(fields, 'id'),
    title: requireString(fields, 'title'),
    description: requireString(fields, 'description'),
    category: requireString(fields, 'category'),
    brand: optionalString(fields, 'brand'),
    sku: requireString(fields, 'sku'),
    stock: requireNumber(fields, 'stock'),
    price: requireNumber(fields, 'price'),
    thumbnail: optionalString(fields, 'thumbnail'),
    minimumOrderQuantity: optionalNumber(fields, 'minimumOrderQuantity'),
  };
}

/**
 * Проверяет ответ на запрос списка: `products` должен быть массивом, каждый товар проходит `parseProduct`.
 * Если хоть один товар неправильный — ошибка всего ответа.
 *
 * @param value - Что прислал сервер.
 * @returns Проверенный список.
 */
export function parseProductList(value: unknown): ProductListDto {
  const fields = asObject(value, 'ProductListDto');
  if (!Array.isArray(fields.products)) throw new Error('Invalid field "products"');
  return {
    products: fields.products.map(parseProduct),
    total: requireNumber(fields, 'total'),
  };
}

/**
 * Превращает товар сервера в модель приложения:
 * `id` из числа в строку, `thumbnail` в `imageUrl`.
 * Если сервер переименует поле, исправить нужно только здесь — экраны не заметят.
 *
 * @param dto - Проверенный товар сервера.
 * @returns Товар для приложения.
 */
export function toTopic(dto: ProductDto): Topic {
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    imageUrl: dto.thumbnail,
    category: dto.category,
    brand: dto.brand,
    sku: dto.sku,
    stock: dto.stock,
    price: dto.price,
    minimumOrderQuantity: dto.minimumOrderQuantity,
  };
}
