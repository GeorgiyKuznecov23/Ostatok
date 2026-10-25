/**
 * Загрузка одного товара для экрана карточки.
 *
 * @module
 */

import { useEffect, useState } from 'react';

import { apiManager } from '../../../api/apiManager';
import { toApiError, type ApiError } from '../../../shared/api/errors';
import { createRequestGuard } from './requestGuard';
import type { Topic } from './Topic';

/** Состояние карточки — одно из четырёх: загрузка, успех (есть товар), «не найден» (ответ 404), ошибка. */
export type TopicState =
  | {
      /** Товар загружается. */
      status: 'loading';
    }
  | {
      /** Товар загружен. */
      status: 'success';
      /** Загруженный товар. */
      topic: Topic;
    }
  | {
      /** Сервер ответил 404: товара с таким номером нет. */
      status: 'not_found';
    }
  | {
      /** Не удалось загрузить: нет сети, timeout, ошибка сервера или неверный формат ответа. */
      status: 'error';
      /** Что именно пошло не так. */
      error: ApiError;
    };

/** Ответ, который уже пришёл, и номер товара, для которого он пришёл. */
type LoadedTopic = {
  /** Номер товара, для которого получен ответ. */
  id: string;
  /** Чем закончилась загрузка этого товара. */
  state: TopicState;
};

/** То, что хук отдаёт экрану. */
export type TopicResult = {
  /** Текущее состояние карточки. */
  state: TopicState;
  /** Загрузить товар заново (кнопка «Повторить»). */
  retry: () => void;
};

/**
 * Хук загрузки карточки.
 *
 * Карточка сама загружает товар по номеру через `apiManager.products.getById`, даже если каталог ещё не загружен —
 * так работает открытие по прямой ссылке. Без правильного номера запроса нет.
 * При смене номера или закрытии карточки старый запрос отменяется, поздний ответ игнорируется.
 *
 * @param id - Номер товара или `undefined`, если номер неверный или включён демо-режим.
 * @returns Состояние карточки и функцию `retry`.
 */
export function useTopic(id: string | undefined): TopicResult {
  /** Последний пришедший ответ вместе с номером товара (state). */
  const [loaded, setLoaded] = useState<LoadedTopic | null>(null);
  /** Номер попытки. «Повторить» увеличивает его, и эффект загрузки запускается снова. */
  const [attempt, setAttempt] = useState(0);
  /** Счётчик запросов для защиты от устаревших ответов. */
  const [guard] = useState(createRequestGuard);

  /**
   * Загрузка товара. Запускается при открытии карточки, смене номера и повторе.
   * Ответ 404 превращается в «не найден», остальные ошибки — в `error`. Отмена ошибкой не считается.
   * Cleanup отменяет запрос, если карточку закрыли или номер сменился.
   */
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const isActual = guard.start();

    apiManager.products
      .getById(id, { signal: controller.signal })
      .then((topic) => {
        if (!isActual() || controller.signal.aborted) return;
        setLoaded({ id, state: { status: 'success', topic } });
      })
      .catch((reason: unknown) => {
        if (!isActual() || controller.signal.aborted) return;
        const failure = toApiError(reason);
        if (failure.kind === 'cancel') return;
        if (failure.kind === 'http_error' && failure.status === 404) {
          setLoaded({ id, state: { status: 'not_found' } });
        } else {
          setLoaded({ id, state: { status: 'error', error: failure } });
        }
      });

    return () => controller.abort();
  }, [id, attempt, guard]);

  /** Текущее состояние. Если номер уже сменился, а ответа для нового ещё нет — показываем загрузку, а не прошлую карточку. */
  const state: TopicState = loaded && loaded.id === id ? loaded.state : { status: 'loading' };

  /** Загрузить заново. Пока идёт загрузка, повтор не запускается. */
  const retry = () => {
    if (!id || state.status === 'loading') return;
    setLoaded(null);
    setAttempt((prev) => prev + 1);
  };

  return { state, retry };
}
