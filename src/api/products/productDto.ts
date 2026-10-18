import type { Topic } from '../../features/products/model/Topic';

// Товар в том виде, в каком его присылает DummyJSON
export type ProductDto = {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  price: number;
  thumbnail?: string;
  minimumOrderQuantity?: number;
};

export type ProductListDto = {
  products: ProductDto[];
  total: number;
};

type Fields = Record<string, unknown>;

function asObject(value: unknown, name: string): Fields {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${name}: not an object`);
  }
  return value as Fields;
}

function requireString(fields: Fields, key: string): string {
  const value = fields[key];
  if (typeof value !== 'string') throw new Error(`Invalid field "${key}"`);
  return value;
}

function requireNumber(fields: Fields, key: string): number {
  const value = fields[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Invalid field "${key}"`);
  return value;
}

function optionalString(fields: Fields, key: string): string | undefined {
  return fields[key] === undefined ? undefined : requireString(fields, key);
}

function optionalNumber(fields: Fields, key: string): number | undefined {
  return fields[key] === undefined ? undefined : requireNumber(fields, key);
}

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

export function parseProductList(value: unknown): ProductListDto {
  const fields = asObject(value, 'ProductListDto');
  if (!Array.isArray(fields.products)) throw new Error('Invalid field "products"');
  return {
    products: fields.products.map(parseProduct),
    total: requireNumber(fields, 'total'),
  };
}

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
