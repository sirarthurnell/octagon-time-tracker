import * as moment from 'moment';

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

/**
 * Returns the localized format applied to times.
 */
export function getLocalizedTimeFormat(): string {
  return getLocalizedFormat('LT');
}

/**
 * Returns the localized format applied to short dates.
 */
export function getLocalizedShortDateFormat(): string {
  const somethingInsideBrackets = /\[[\s\S]*?\]/g;
  const multipleSpaces = /\s+/g;
  const format = getLocalizedFormat('ll')
    .replace(somethingInsideBrackets, '')
    .replace(multipleSpaces, ' ');

  return format;
}

/**
 * Gets the localized format corresponding to the
 * specified key.
 * @param formatKey Format key.
 */
function getLocalizedFormat(formatKey: moment.LongDateFormatKey): string {
  const format = moment()
    .locale(getLocale())
    .localeData()
    .longDateFormat(formatKey);

  return format;
}
