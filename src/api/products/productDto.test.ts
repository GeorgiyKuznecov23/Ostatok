import { describe, expect, test } from '@jest/globals';

import { parseProduct, parseProductList, toTopic } from './productDto';

const product = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'A popular mascara.',
  category: 'beauty',
  brand: 'Essence',
  sku: 'BEA-ESS-ESS-001',
  stock: 99,
  price: 9.99,
  thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  minimumOrderQuantity: 48,
};

describe('parseProduct', () => {
  test('принимает корректный товар', () => {
    expect(parseProduct(product)).toEqual(product);
  });

  test('принимает товар без бренда', () => {
    expect(parseProduct({ ...product, brand: undefined }).brand).toBeUndefined();
  });

  test('title = null — ошибка', () => {
    expect(() => parseProduct({ ...product, title: null })).toThrow('title');
  });

  test('остаток строкой — ошибка', () => {
    expect(() => parseProduct({ ...product, stock: '99' })).toThrow('stock');
  });

  test('нет артикула — ошибка', () => {
    expect(() => parseProduct({ ...product, sku: undefined })).toThrow('sku');
  });

  test('не объект — ошибка', () => {
    expect(() => parseProduct(null)).toThrow();
    expect(() => parseProduct('text')).toThrow();
    expect(() => parseProduct([product])).toThrow();
  });
});

describe('parseProductList', () => {
  test('принимает корректный список', () => {
    const list = parseProductList({ products: [product], total: 1, skip: 0, limit: 1 });
    expect(list.products).toHaveLength(1);
    expect(list.total).toBe(1);
  });

  test('products не массив — ошибка', () => {
    expect(() => parseProductList({ products: null, total: 0 })).toThrow('products');
  });

  test('один повреждённый товар — ошибка всего ответа', () => {
    expect(() => parseProductList({ products: [product, { id: 2 }], total: 2 })).toThrow();
  });
});

describe('toTopic', () => {
  test('превращает DTO в модель приложения', () => {
    const topic = toTopic(parseProduct(product));
    expect(topic.id).toBe('1');
    expect(topic.imageUrl).toBe(product.thumbnail);
    expect(topic.minimumOrderQuantity).toBe(48);
  });
});
