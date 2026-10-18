// Подмена ответов сервера для проверки ошибок. Работает только в режиме разработки.

export type TestScenario =
  | 'off'
  | 'slow'
  | 'timeout'
  | 'http_404'
  | 'offline'
  | 'bad_json'
  | 'bad_dto';

export const testScenarios: { id: TestScenario; label: string }[] = [
  { id: 'off', label: 'Выкл' },
  { id: 'slow', label: 'Медленно 3 с' },
  { id: 'timeout', label: 'Задержка 12 с' },
  { id: 'http_404', label: 'HTTP 404' },
  { id: 'offline', label: 'Нет сети' },
  { id: 'bad_json', label: 'Битый JSON' },
  { id: 'bad_dto', label: 'Битый DTO' },
];

let currentScenario: TestScenario = 'off';
const listeners = new Set<() => void>();

export function getTestScenario(): TestScenario {
  return currentScenario;
}

export function setTestScenario(scenario: TestScenario) {
  currentScenario = scenario;
  listeners.forEach((listener) => listener());
}

// Панель есть и в каталоге, и в карточке: подписка нужна, чтобы обе показывали одно и то же
export function subscribeTestScenario(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

type FetchInit = {
  method: string;
  headers: Record<string, string>;
  signal: AbortSignal;
};

function abortError() {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

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

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type PassThrough = (url: string, init: FetchInit) => Promise<Response>;

// passThrough — настоящий запрос, его передаёт transportService
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
