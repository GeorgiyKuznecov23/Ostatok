import { useEffect, useState } from 'react';

import { apiManager } from '../../../api/apiManager';
import { toApiError, type ApiError } from '../../../shared/api/errors';
import { topics as demoTopics } from '../data/fixtures';
import { createRequestGuard } from './requestGuard';
import type { Topic } from './Topic';

export type ListStatus = 'loading' | 'success' | 'error';
export type DataSource = 'network' | 'demo';

export function useProductList() {
  const [source, setSource] = useState<DataSource>('network');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [status, setStatus] = useState<ListStatus>('loading');
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [guard] = useState(createRequestGuard);

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

  // Повторная загрузка с сервера, в том числе выход из демо-режима
  const reload = () => {
    if (source === 'network' && status === 'loading') return;
    setStatus('loading');
    setError(null);
    setSource('network');
    setAttempt((prev) => prev + 1);
  };

  const showDemo = () => setSource('demo');

  if (source === 'demo') {
    return { source, topics: demoTopics, status: 'success' as ListStatus, error: null, reload, showDemo };
  }
  return { source, topics, status, error, reload, showDemo };
}
