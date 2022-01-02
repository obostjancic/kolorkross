export const partialMatch = <T>(p: T, q: Partial<T>): boolean => {
  for (const key of Object.keys(q) as Array<keyof T>) {
    if (p[key] !== q[key]) {
      return false;
    }
  }
  return true;
};
