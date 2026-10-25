/**
 * Понятные человеку тексты ошибок. Код ошибки из сетевого слоя превращается здесь в сообщение на экране.
 *
 * @module
 */

import type { ApiError } from '../../../shared/api/errors';

/**
 * Текст ошибки для пользователя.
 *
 * @param error - Ошибка из сетевого слоя.
 * @returns Сообщение, например «Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.»
 */
export function getErrorMessage(error: ApiError): string {
  switch (error.kind) {
    case 'network_error':
      return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.';
    case 'timeout':
      return 'Сервер не ответил за 10 секунд. Попробуйте ещё раз.';
    case 'http_error':
      return error.status === 404
        ? 'Сервер ответил, что данные не найдены (ошибка 404).'
        : `Сервер вернул ошибку ${error.status}. Попробуйте позже.`;
    case 'parse_error':
      return 'Сервер прислал повреждённый ответ.';
    case 'contract_error':
      return 'Сервер прислал данные в неожиданном формате.';
    case 'cancel':
      return 'Загрузка отменена.';
  }
}

/**
 * Технические подробности под текстом ошибки: код, HTTP-статус и номер запроса.
 * По номеру запроса можно найти этот запрос в логах.
 *
 * @param error - Ошибка из сетевого слоя.
 * @returns Строку вроде `network_error, нет ответа, запрос mva8b2rv-4`.
 */
export function getErrorDetails(error: ApiError): string {
  const status = error.status === null ? 'нет ответа' : `HTTP ${error.status}`;
  return `${error.kind}, ${status}, запрос ${error.requestId ?? '—'}`;
}
