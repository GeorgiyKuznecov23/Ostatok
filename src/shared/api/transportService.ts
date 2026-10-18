import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';
import { apiError, isApiError, type ApiError, type ApiErrorKind } from './errors';
import { logEvent } from './logger';
import { getTestScenario, testFetch } from './testMode';

type RequestOptions = {
  signal?: AbortSignal;
  // Метка маршрута для логов, без query и конкретных id
  route?: string;
};

export type JsonResult = {
  data: unknown;
  status: number;
  requestId: string;
};

let requestCounter = 0;

function createRequestId() {
  requestCounter += 1;
  return `${Date.now().toString(36)}-${requestCounter}`;
}

// Единственное место в проекте, где вызывается fetch
export async function requestJson(path: string, options: RequestOptions = {}): Promise<JsonResult> {
  const requestId = createRequestId();
  const route = options.route ?? path.split('?')[0];
  const startedAt = Date.now();

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const outerSignal = options.signal;
  const onOuterAbort = () => controller.abort();
  if (outerSignal?.aborted) {
    controller.abort();
  } else {
    outerSignal?.addEventListener('abort', onOuterAbort);
  }

  let status: number | null = null;
  let outcome: ApiErrorKind | 'success' = 'success';

  logEvent('http.start', { requestId, method: 'GET', route });

  const toFailure = (error: unknown): ApiError => {
    if (isApiError(error)) return error;
    if (timedOut) return apiError('timeout', `No response in ${REQUEST_TIMEOUT_MS} ms`, status, requestId);
    if (controller.signal.aborted) return apiError('cancel', 'Request cancelled', status, requestId);
    const message = error instanceof Error ? error.message : 'Network error';
    return apiError('network_error', message, status, requestId);
  };

  try {
    if (controller.signal.aborted) {
      throw apiError('cancel', 'Request cancelled before start', null, requestId);
    }

    const url = API_BASE_URL + path;
    const init = {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    };
    const response =
      __DEV__ && getTestScenario() !== 'off' ? await testFetch(url, init, fetch) : await fetch(url, init);
    status = response.status;

    if (!response.ok) {
      throw apiError('http_error', `HTTP ${response.status}`, response.status, requestId);
    }

    const text = await response.text();
    try {
      return { data: JSON.parse(text) as unknown, status: response.status, requestId };
    } catch {
      throw apiError('parse_error', 'Response is not valid JSON', response.status, requestId);
    }
  } catch (error) {
    const failure = toFailure(error);
    outcome = failure.kind;
    throw failure;
  } finally {
    clearTimeout(timer);
    outerSignal?.removeEventListener('abort', onOuterAbort);
    logEvent('http.end', {
      requestId,
      method: 'GET',
      route,
      status,
      outcome,
      durationMs: Date.now() - startedAt,
    });
  }
}
