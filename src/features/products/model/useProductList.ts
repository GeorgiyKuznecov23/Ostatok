/**
 * Загрузка списка товаров с сервера и демо-режим.
 *
 * @module
 */

import { useEffect, useState } from 'react';

import { apiManager } from '../../../api/apiManager';
import { toApiError, type ApiError } from '../../../shared/api/errors';
import { topics as demoTopics } from '../data/fixtures';
import { createRequestGuard } from './requestGuard';
import type { Topic } from './Topic';

/** Состояние загрузки списка: `loading` — грузится, `success` — загружен, `error` — ошибка. */
export type ListStatus = 'loading' | 'success' | 'error';
/** Откуда данные: `network` — с сервера, `demo` — из демо-данных. */
export type DataSource = 'network' | 'demo';

/** То, что хук отдаёт наружу. */
export type ProductListState = {
  /** Откуда сейчас данные: с сервера или демо. */
  source: DataSource;
  /** Загруженные товары (или демо-товары в демо-режиме). */
  topics: Topic[];
  /** Состояние загрузки. В демо-режиме всегда `success`. */
  status: ListStatus;
  /** Ошибка последней загрузки или `null`, если ошибки нет. */
  error: ApiError | null;
  /** Загрузить список заново. Это и «Повторить», и «Обновить», и «Вернуться к сети». */
  reload: () => void;
  /** Включить демо-данные. Вызывается только кнопкой, сам режим не включается. */
  showDemo: () => void;
};

/**
 * Хук загрузки списка.
 *
 * После отрисовки `useEffect` вызывает `apiManager.products.list()`. Пока ответа нет, статус `loading`.
 * Пришёл ответ — товары и статус `success`. Ошибка — статус `error` и сама ошибка.
 * При уходе с экрана или новой загрузке старый запрос отменяется, а его поздний ответ игнорируется.
 *
 * @returns Товары, состояние загрузки и функции `reload` и `showDemo`.
 */
export function useProductList(): ProductListState {
  /** Откуда данные (state). По умолчанию — с сервера. */
  const [source, setSource] = useState<DataSource>('network');
  /** Загруженные с сервера товары (state). */
  const [topics, setTopics] = useState<Topic[]>([]);
  /** Состояние загрузки (state). Сразу `loading`, чтобы не показать пустой список до ответа. */
  const [status, setStatus] = useState<ListStatus>('loading');
  /** Ошибка последней загрузки (state). */
  const [error, setError] = useState<ApiError | null>(null);
  /** Номер попытки. Увеличивается при «Повторить», от этого эффект загрузки запускается снова. */
  const [attempt, setAttempt] = useState(0);
  /** Счётчик запросов для защиты от устаревших ответов. Создаётся один раз. */
  const [guard] = useState(createRequestGuard);

  /**
   * Загрузка списка. Запускается при открытии экрана и при смене `source` или `attempt`.
   * `AbortController` — «пульт отмены» запроса. В cleanup (`return`) запрос отменяется.
   * Ответ применяется, только если этот запрос последний (`isActual`) и не отменён.
   * Отмена (`cancel`) ошибкой для пользователя не считается.
   */
  useEffect(() => {
    if (source === 'demo') return;

    const controller = new AbortController();
    const isActual = guard.start();

    apiManager.products
      .list({ signal: controller.signal })
      .then((loaded) => {
        if (!isActual() || controller.signal.aborted) return;
        setTopics(loaded);
        setStatus('success');
      })
      .catch((reason: unknown) => {
        if (!isActual() || controller.signal.aborted) return;
        const failure = toApiError(reason);
        if (failure.kind === 'cancel') return;
        setError(failure);
        setStatus('error');
      });

    return () => controller.abort();
  }, [source, attempt, guard]);

  /** Загрузить заново. Пока идёт загрузка, повторное нажатие игнорируется — второй такой же запрос не нужен. */
  const reload = () => {
    if (source === 'network' && status === 'loading') return;
    setStatus('loading');
    setError(null);
    setSource('network');
    setAttempt((prev) => prev + 1);
  };

  /** Переключиться на демо-данные. */
  const showDemo = () => setSource('demo');

  if (source === 'demo') {
    return { source, topics: demoTopics, status: 'success', error: null, reload, showDemo };
  }
  return { source, topics, status, error, reload, showDemo };
}
