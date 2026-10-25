/**
 * Настройки сети в одном месте.
 *
 * @module
 */

/** Адрес сервера DummyJSON. Ко всем запросам добавляется в начало. */
export const API_BASE_URL = 'https://dummyjson.com';

/** Сколько миллисекунд ждать ответа (10 секунд). Дальше запрос отменяется как timeout. */
export const REQUEST_TIMEOUT_MS = 10000;
