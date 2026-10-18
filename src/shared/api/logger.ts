type LogFields = Record<string, string | number | null>;

// Пишем только разрешённые поля: без тел ответов, токенов и поисковых строк
export function logEvent(event: string, fields: LogFields) {
  if (!__DEV__) return;
  console.info(JSON.stringify({ event, timestamp: new Date().toISOString(), ...fields }));
}
