/**
 * Тесты транспорта: как различаются ошибки, timeout, отмена и логи.
 * Настоящий сервер не используется: `fetch` подменяется.
 *
 * @module
 */

import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { requestJson } from './transportService';

/** Подменённый `fetch`: в каждом тесте задаём, что он «ответит». */
const fetchMock = jest.spyOn(globalThis, 'fetch');
/** Подменённый `console.info`: перехватывает логи, чтобы их проверить и не засорять вывод тестов. */
const infoMock = jest.spyOn(console, 'info').mockImplementation(() => {});

beforeEach(() => {
  fetchMock.mockReset();
  infoMock.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

/**
 * Поддельный запрос, который никогда не отвечает, а только ждёт отмены.
 * Нужен для тестов отмены и timeout.
 *
 * @param signal - Сигнал отмены.
 * @returns Promise, который завершится ошибкой при отмене.
 */
function waitForAbort(signal: AbortSignal) {
  return new Promise<Response>((_, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Aborted')));
  });
}

test('успешный ответ возвращает JSON', async () => {
  fetchMock.mockResolvedValue(new Response('{"id":1}', { status: 200 }));

  const result = await requestJson('/products/1');

  expect(result.data).toEqual({ id: 1 });
  expect(result.status).toBe(200);
});

test('HTTP 404 — это http_error, а не ошибка сети', async () => {
  fetchMock.mockResolvedValue(new Response('{"message":"not found"}', { status: 404 }));

  await expect(requestJson('/products/9999')).rejects.toMatchObject({
    kind: 'http_error',
    status: 404,
  });
});

test('повреждённый JSON — parse_error', async () => {
  fetchMock.mockResolvedValue(new Response('{"products": [', { status: 200 }));

  await expect(requestJson('/products')).rejects.toMatchObject({ kind: 'parse_error' });
});

test('fetch не смог отправить запрос — network_error без статуса', async () => {
  fetchMock.mockRejectedValue(new TypeError('Network request failed'));

  await expect(requestJson('/products')).rejects.toMatchObject({
    kind: 'network_error',
    status: null,
  });
});

test('отмена снаружи — cancel', async () => {
  fetchMock.mockImplementation((_url, init) => waitForAbort(init!.signal!));
  const controller = new AbortController();

  const promise = requestJson('/products', { signal: controller.signal });
  controller.abort();

  await expect(promise).rejects.toMatchObject({ kind: 'cancel' });
});

test('нет ответа 10 секунд — timeout', async () => {
  jest.useFakeTimers();
  fetchMock.mockImplementation((_url, init) => waitForAbort(init!.signal!));

  const promise = requestJson('/products');
  jest.advanceTimersByTime(10000);

  await expect(promise).rejects.toMatchObject({ kind: 'timeout' });
});

test('на каждый запрос пишется ровно одно событие http.end', async () => {
  fetchMock.mockResolvedValue(new Response('{"message":"not found"}', { status: 404 }));

  await requestJson('/products/9999', { route: '/products/:id' }).catch(() => {});

  const events = infoMock.mock.calls.map((call) => JSON.parse(String(call[0])));
  expect(events.map((event) => event.event)).toEqual(['http.start', 'http.end']);
  expect(events[1]).toMatchObject({ route: '/products/:id', status: 404, outcome: 'http_error' });
  expect(events[1].requestId).toBe(events[0].requestId);
});
