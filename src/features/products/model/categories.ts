const categoryLabels: Record<string, string> = {
  beauty: 'Косметика',
  fragrances: 'Парфюмерия',
  furniture: 'Мебель',
  groceries: 'Продукты',
  'home-decoration': 'Декор',
  'kitchen-accessories': 'Для кухни',
  laptops: 'Ноутбуки',
  'mens-shirts': 'Мужские рубашки',
  'mens-shoes': 'Мужская обувь',
  'mens-watches': 'Мужские часы',
  'mobile-accessories': 'Аксессуары',
  motorcycle: 'Мотоциклы',
  'skin-care': 'Уход за кожей',
  smartphones: 'Смартфоны',
  'sports-accessories': 'Спорт',
  sunglasses: 'Очки',
  tablets: 'Планшеты',
  tops: 'Топы',
  vehicle: 'Автомобили',
  'womens-bags': 'Сумки',
  'womens-dresses': 'Платья',
  'womens-jewellery': 'Украшения',
  'womens-shoes': 'Женская обувь',
  'womens-watches': 'Женские часы',
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}
