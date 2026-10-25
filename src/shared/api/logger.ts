/**
 * Журнал (логи) сетевых запросов.
 *
 * @module
 */

/** Поля записи журнала: только строки, числа или `null`. */
export type LogFields = Record<string, string | number | null>;

/**
 * Пишет запись журнала в консоль в формате JSON со временем события.
 * Пишем только разрешённые поля: без тел ответов, токенов, личных данных и поисковых строк.
 * В собранном приложении (`__DEV__` = false) ничего не пишет.
 *
 * @param event - Название события: `http.start`, `http.end` или `api.contract_error`.
 * @param fields - Поля: номер запроса, маршрут, статус, длительность, итог.
 */
export function logEvent(event: string, fields: LogFields) {
  if (!__DEV__) return;
  console.info(JSON.stringify({ event, timestamp: new Date().toISOString(), ...fields }));
}
