/**
 * Gets the number of days in the specified
 * month.
 * @param year Year.
 * @param month Month.
 */
export function daysInMonth(year, month): number {
 const date = new Date(year, month + 1, 0);
 return date.getDate();
}
