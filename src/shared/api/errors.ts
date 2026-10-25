/**
 * Виды сетевых ошибок и функции для работы с ними.
 *
 * @module
 */

/**
 * Вид ошибки:
 * `http_error` — сервер ответил, но не 2xx (например 404);
 * `network_error` — ответа нет совсем (нет интернета);
 * `timeout` — нет ответа 10 секунд;
 * `cancel` — запрос отменили сами, он больше не нужен;
 * `parse_error` — пришёл не JSON;
 * `contract_error` — JSON пришёл, но поля не те.
 */
export type ApiErrorKind =
  | 'http_error'
  | 'network_error'
  | 'timeout'
  | 'cancel'
  | 'parse_error'
  | 'contract_error';

/** Ошибка сетевого слоя. */
export type ApiError = {
  /** Вид ошибки. */
  kind: ApiErrorKind;
  /** Техническое описание для лога, пользователю не показывается. */
  message: string;
  /** HTTP-статус ответа или `null`, если ответа не было. */
  status: number | null;
  /** Номер запроса — по нему ошибку можно найти в логах. */
  requestId: string | null;
};

/**
 * Создаёт объект ошибки.
 *
 * @param kind - Вид ошибки.
 * @param message - Техническое описание.
 * @param status - HTTP-статус или `null`.
 * @param requestId - Номер запроса или `null`.
 * @returns Ошибку.
 */
export function apiError(
  kind: ApiErrorKind,
  message: string,
  status: number | null = null,
  requestId: string | null = null,
): ApiError {
  return { kind, message, status, requestId };
}

/**
 * Проверяет, что пойманное значение — наша ошибка, а не какая-то другая.
 *
 * @param value - Что поймали.
 * @returns `true`, если это `ApiError`.
 */
export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'kind' in value && 'requestId' in value;
}

/**
 * Приводит любую пойманную ошибку к виду `ApiError`. Неизвестные ошибки считаются сетевыми.
 *
 * @param error - Что поймали.
 * @returns Ошибку в нашем формате.
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  return apiError('network_error', error instanceof Error ? error.message : String(error));
}
