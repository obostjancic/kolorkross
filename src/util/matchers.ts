export const partialMatch = <T>(p: T, q: Partial<T>): boolean => {
  for (const key of Object.keys(q)) {
    //@ts-expect-error - find a way to make this work
    if (p[key] !== q[key]) {
      return false;
    }
  }
  return true;
};
