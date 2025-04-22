import { format } from 'date-fns';

export function arrayEquals(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) {
    return false;
  }

  let i = a1.length;
  while (i--) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

export function deepCopy<T>(input: T): T {
  if (input === null || typeof input !== "object") {
    return input; // Return primitive types or null directly.
  }

  const copy = (Array.isArray(input) ? [] : {}) as T; // Create an array or object based on the input type.

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      // Recursively copy each property or element.
      (copy as any)[key] = deepCopy((input as any)[key]);
    }
  }

  return copy;
}
