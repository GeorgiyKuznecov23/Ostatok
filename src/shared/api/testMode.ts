/**
 * Тестовый режим сети: подмена ответов сервера, чтобы проверить обработку ошибок.
 * Работает только при разработке.
 *
 * @module
 */

/**
 * Сценарий подмены: `off` — выключено, `slow` — ответ через 3 с, `timeout` — задержка 12 с,
 * `http_404` — ответ 404, `offline` — нет сети, `bad_json` — битый JSON, `bad_dto` — товар без названия.
 */
export type TestScenario =
  | 'off'
  | 'slow'
  | 'timeout'
  | 'http_404'
  | 'offline'
  | 'bad_json'
  | 'bad_dto';

/** Сценарий для панели: код и надпись на чипе. */
export type TestScenarioOption = {
  /** Код сценария. */
  id: TestScenario;
  /** Надпись на чипе. */
  label: string;
};

/** Все сценарии в том порядке, в каком они стоят на панели. */
export const testScenarios: TestScenarioOption[] = [
  { id: 'off', label: 'Выкл' },
  { id: 'slow', label: 'Медленно 3 с' },
  { id: 'timeout', label: 'Задержка 12 с' },
  { id: 'http_404', label: 'HTTP 404' },
  { id: 'offline', label: 'Нет сети' },
  { id: 'bad_json', label: 'Битый JSON' },
  { id: 'bad_dto', label: 'Битый DTO' },
];

/** Текущий сценарий. Хранится вне React, потому что его читает и транспорт, и панели. */
let currentScenario: TestScenario = 'off';
/** Подписчики — функции, которые надо вызвать, когда сценарий меняется. */
const listeners = new Set<() => void>();

/**
 * Текущий сценарий.
 *
 * @returns Код сценария.
 */
export function getTestScenario(): TestScenario {
  return currentScenario;
}

/**
 * Выбрать сценарий и сообщить об этом всем подписчикам (панелям).
 *
 * @param scenario - Новый сценарий.
 */
export function setTestScenario(scenario: TestScenario) {
  currentScenario = scenario;
  listeners.forEach((listener) => listener());
}

/**
 * Подписаться на смену сценария. Нужна, чтобы панели в каталоге и в карточке показывали одно и то же.
 *
 * @param listener - Что вызвать при смене.
 * @returns Функцию отписки.
 */
export function subscribeTestScenario(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Настройки запроса — те же, что передаёт `transportService` в `fetch`. */
export type FetchInit = {
  /** HTTP-метод, у нас всегда `GET`. */
  method: string;
  /** Заголовки запроса. */
  headers: Record<string, string>;
  /** Сигнал отмены. Подмена тоже его слушает, поэтому timeout и отмена работают как в жизни. */
  signal: AbortSignal;
};

/**
 * Ошибка «запрос отменён» — такая же, как выдаёт настоящий `fetch` при отмене.
 *
 * @returns Ошибку с именем `AbortError`.
 */
function abortError() {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

/**
 * Подождать заданное время. Если запрос отменили раньше — сразу закончить с ошибкой отмены.
 *
 * @param ms - Сколько миллисекунд ждать.
 * @param signal - Сигнал отмены.
 * @returns Promise, который завершится через `ms` или при отмене.
 */
function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort);
  });
}

/**
 * Собрать поддельный ответ сервера с JSON.
 *
 * @param body - Что положить в ответ.
 * @param status - HTTP-статус.
 * @returns Ответ, как от настоящего сервера.
 */
function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Функция настоящего запроса. Её передаёт `transportService`, поэтому `fetch` вызывается только там. */
export type PassThrough = (url: string, init: FetchInit) => Promise<Response>;

/**
 * Подменённый запрос. Смотрит на текущий сценарий и либо ждёт, либо возвращает поддельный ответ,
 * либо делает настоящий запрос через `passThrough`.
 *
 * @param url - Полный адрес запроса.
 * @param init - Настройки запроса.
 * @param passThrough - Настоящий запрос.
 * @returns Ответ сервера (настоящий или поддельный).
 */
export async function testFetch(
  url: string,
  init: FetchInit,
  passThrough: PassThrough,
): Promise<Response> {
  const scenario = currentScenario;

  if (scenario === 'slow') {
    await wait(3000, init.signal);
    return passThrough(url, init);
  }
  if (scenario === 'timeout') {
    await wait(12000, init.signal);
    return passThrough(url, init);
  }

  await wait(300, init.signal);

  if (scenario === 'offline') {
    throw new TypeError('Network request failed');
  }
  if (scenario === 'http_404') {
    return jsonResponse({ message: 'Not found (test mode)' }, 404);
  }
  if (scenario === 'bad_json') {
    return new Response('{"products": [', { status: 200 });
  }
  if (scenario === 'bad_dto') {
    const isOneProduct = /\/products\/\d+(\?|$)/.test(url);
    const brokenProduct = { id: 1, title: null };
    return jsonResponse(
      isOneProduct ? brokenProduct : { products: [brokenProduct], total: 1, skip: 0, limit: 1 },
      200,
    );
  }
  return passThrough(url, init);
}
