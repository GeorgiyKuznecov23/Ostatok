/**
 * Русские названия категорий DummyJSON для чипов фильтра и карточек.
 *
 * @module
 */

/** Словарь «код категории → русское название». Все 24 категории DummyJSON. */
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

/**
 * Переводит код категории в русское название.
 *
 * @param category - Код категории, например `beauty`.
 * @returns Русское название, например «Косметика». Если перевода нет — сам код, чтобы приложение не сломалось на новой категории.
 */
export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}
