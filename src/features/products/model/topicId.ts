// id из адреса может быть чем угодно: /topic/abc, /topic/0, /topic/1/2.
// У DummyJSON id товара — целое число больше нуля.
export function parseTopicId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return /^[1-9]\d*$/.test(value) ? value : undefined;
}
