/**
 * Creates a new 2D array.
 * @param length Length of the new array.
 */
export function create2dArray<T>(length: number): T[][] {
  const arr: T[][] = [];

  for (let i = 0; i < length; i++) {
    arr.push([]);
  }

  return arr;
}

/**
 * Gets the last element of the array
 * or null if the array is empty.
 * @param arr Array.
 */
export function getLast<T>(arr: T[]): T {
  if (isNullOrEmpty(arr)) {
    return null;
  } else {
    return arr[arr.length - 1];
  }
}

/**
 * Gets the first element of the array.
 * @param arr Array.
 */
export function getFirst<T>(arr: T[]): T {
  if(isNullOrEmpty(arr)) {
    return null;
  } else {
    return arr[0];
  }
}

/**
 * Returns true if the array has no elements.
 * False if it has.
 * @param arr Array to check.
 */
export function isNullOrEmpty(arr: any[]): boolean {
  return !!!arr || arr.length === 0;
}

/**
 * Returns true if the array has elements.
 * False if it's empty.
 * @param arr Array.
 */
export function hasAny(arr: any[]): boolean {
  return !isNullOrEmpty(arr);
}
