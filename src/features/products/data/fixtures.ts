/**
 * Демо-данные: 12 тестовых товаров, записанных прямо в коде.
 * Используются, только когда пользователь сам нажал «Показать демо-данные».
 *
 * @module
 */

import type { Topic } from '../model/Topic';

/**
 * Список демо-товаров. Взяты из DummyJSON, у пары товаров остаток изменён, чтобы были видны все статусы.
 * У одного товара нет картинки — чтобы проверить заглушку «Нет фото».
 */
export const topics: Topic[] = [
  {
    id: '26',
    title: 'Green Chili Pepper',
    description: 'Spicy green chili pepper, ideal for adding heat to your favorite recipes.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp',
    category: 'groceries',
    sku: 'GRO-BRD-GRE-026',
    stock: 3,
    price: 0.99,
  },
  {
    id: '16',
    title: 'Apple',
    description: 'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp',
    category: 'groceries',
    sku: 'GRO-BRD-APP-016',
    stock: 8,
    price: 1.99,
  },
  {
    id: '27',
    title: 'Honey Jar',
    description: 'Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp',
    category: 'groceries',
    sku: 'GRO-BRD-HON-027',
    stock: 34,
    price: 6.99,
  },
  {
    id: '61',
    title: 'Hand Blender',
    description: 'The Hand Blender is a versatile kitchen appliance for blending, pureeing, and mixing.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/kitchen-accessories/hand-blender/thumbnail.webp',
    category: 'kitchen-accessories',
    sku: 'KIT-BRD-HAN-061',
    stock: 84,
    price: 34.99,
  },
  {
    id: '101',
    title: 'Apple AirPods Max Silver',
    description: 'Premium over-ear headphones with high-fidelity audio and active noise cancellation.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp',
    category: 'mobile-accessories',
    brand: 'Apple',
    sku: 'MOB-APP-APP-101',
    stock: 59,
    price: 549.99,
  },
  {
    // без картинки и с нулевым остатком, чтобы проверить заглушку и статус
    id: '103',
    title: 'Apple HomePod Mini Cosmic Grey',
    description: 'A compact smart speaker with good sound and Siri built in.',
    category: 'mobile-accessories',
    brand: 'Apple',
    sku: 'MOB-APP-APP-103',
    stock: 0,
    price: 99.99,
  },
  {
    id: '121',
    title: 'iPhone 5s',
    description: 'A classic smartphone known for its compact design and Touch ID fingerprint sensor.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp',
    category: 'smartphones',
    brand: 'Apple',
    sku: 'SMA-APP-IPH-121',
    stock: 25,
    price: 199.99,
  },
  {
    id: '1',
    title: 'Essence Mascara Lash Princess',
    description: 'A popular mascara known for its volumizing and lengthening effects.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    category: 'beauty',
    brand: 'Essence',
    sku: 'BEA-ESS-ESS-001',
    stock: 4,
    price: 9.99,
  },
  {
    id: '3',
    title: 'Powder Canister',
    description: 'A finely milled setting powder designed to set makeup and control shine.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
    category: 'beauty',
    brand: 'Velvet Touch',
    sku: 'BEA-VEL-POW-003',
    stock: 89,
    price: 14.99,
  },
  {
    id: '5',
    title: 'Red Nail Polish',
    description: 'A rich and glossy red nail polish with a quick-drying formula.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp',
    category: 'beauty',
    brand: 'Nail Couture',
    sku: 'BEA-NAI-NAI-005',
    stock: 79,
    price: 8.99,
  },
  {
    id: '78',
    title: 'Apple MacBook Pro 14 Inch Space Grey',
    description: 'A powerful and sleek laptop with the M1 Pro chip and a Retina display.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
    category: 'laptops',
    brand: 'Apple',
    sku: 'LAP-APP-APP-078',
    stock: 24,
    price: 1999.99,
  },
  {
    id: '80',
    title: 'Huawei Matebook X Pro',
    description: 'A slim and stylish laptop with a high-resolution touchscreen display.',
    imageUrl: 'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp',
    category: 'laptops',
    brand: 'Huawei',
    sku: 'LAP-HUA-HUA-080',
    stock: 75,
    price: 1399.99,
  },
];
