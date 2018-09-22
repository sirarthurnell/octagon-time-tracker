/**
 * Time for just one day.
 */
export const SHORT_TIME_FORMAT = 'HH:mm';

/**
 * Time for more than one day.
 */
export const LONG_TIME_FORMAT = 'HHH:mm';

/**
 * Gets the locale to apply to dates
 * and times.
 */
export function getLocale(): string {
  if (navigator.languages != undefined) {
    return navigator.languages[0];
  } else {
    return navigator.language;
  }
}
