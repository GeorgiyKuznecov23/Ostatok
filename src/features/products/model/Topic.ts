// Товар на складе. Имя Topic взято из методички.
export type Topic = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  price: number;
  minimumOrderQuantity?: number;
};
