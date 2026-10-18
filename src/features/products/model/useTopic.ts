import { useEffect, useState } from 'react';

import { apiManager } from '../../../api/apiManager';
import { toApiError, type ApiError } from '../../../shared/api/errors';
import { createRequestGuard } from './requestGuard';
import type { Topic } from './Topic';

export type TopicState =
  | { status: 'loading' }
  | { status: 'success'; topic: Topic }
  | { status: 'not_found' }
  | { status: 'error'; error: ApiError };

type LoadedTopic = {
  id: string;
  state: TopicState;
};

// Карточка сама загружает товар по id, даже если список ещё не загружен.
// Без корректного id запроса нет.
export function useTopic(id: string | undefined) {
  const [loaded, setLoaded] = useState<LoadedTopic | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [guard] = useState(createRequestGuard);

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

  // Если id сменился, а ответа для него ещё нет, показываем загрузку, а не прошлую карточку
  const state: TopicState = loaded && loaded.id === id ? loaded.state : { status: 'loading' };

  const retry = () => {
    if (!id || state.status === 'loading') return;
    setLoaded(null);
    setAttempt((prev) => prev + 1);
  };

  return { state, retry };
}
