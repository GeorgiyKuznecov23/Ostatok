/**
 * Тесты защиты от устаревших ответов.
 *
 * @module
 */

import { expect, test } from '@jest/globals';

import { createRequestGuard } from './requestGuard';

test('актуален только последний запрос', () => {
  const guard = createRequestGuard();
  const first = guard.start();
  const second = guard.start();

  expect(first()).toBe(false);
  expect(second()).toBe(true);
});

test('поздний ответ старого запроса не заменяет новый результат', async () => {
  const guard = createRequestGuard();
  let shown = '';

  /** Имитация запроса: через `delay` мс показывает `text`, но только если этот запрос всё ещё последний. */
  const load = (text: string, delay: number) => {
    const isActual = guard.start();
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (isActual()) shown = text;
        resolve();
      }, delay);
    });
  };

  // Запрос A отвечает позже, чем AB, но на экране должен остаться AB
  await Promise.all([load('A', 100), load('AB', 10)]);

  expect(shown).toBe('AB');
});
