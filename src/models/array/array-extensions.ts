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
