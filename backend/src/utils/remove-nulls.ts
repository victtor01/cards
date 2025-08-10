export function removeNulls<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeNulls(item)) as any;
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [key, removeNulls(value)])
    ) as T;
  }

  return obj;
}
