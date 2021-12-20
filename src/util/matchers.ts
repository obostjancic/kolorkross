export const partialMatch = <T>(p: T, q: Partial<T>) => {
  for (const key of Object.keys(q)) {
    //@ts-ignore
    if (p[key] !== q[key]) {
      return false;
    }
  }
  return true;
};
