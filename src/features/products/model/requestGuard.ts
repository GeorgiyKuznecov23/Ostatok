// Помнит номер последнего запроса. Ответ старого запроса считается устаревшим.
export function createRequestGuard() {
  let lastId = 0;

  return {
    start() {
      lastId += 1;
      const id = lastId;
      return () => id === lastId;
    },
  };
}
