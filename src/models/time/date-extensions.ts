/**
 * Returns the current date (today, now).
 */
export function now(): Date {
  return new Date();
}

/**
 * Checks if now comes after the specified date.
 * @param date Date to check.
 */
export function isNowAfter(date: Date): boolean {
  return now().valueOf() > date.valueOf();
}
