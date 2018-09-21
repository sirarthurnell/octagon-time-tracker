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

/**
 * Compares two dates.
 * @param first First date.
 * @param second Second date.
 * @returns Number greater than 0 if first
 * date is older than second date. Number less
 * than 0 if second date is older than first date.
 * 0 if they are equal.
 */
export function compareDates(first: Date, second: Date): number {
  return first.valueOf() - second.valueOf();
}
