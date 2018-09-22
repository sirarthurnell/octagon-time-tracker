import { DayOfWeek } from './day-of-week';

/**
 * Contains operations with dates.
 */
export class DateOperations {
  private constructor() {}

  /**
   * Gets the number of days in the specified
   * month.
   * @param year Year.
   * @param month Month.
   */
  static daysInMonth(year: number, month: number): number {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  /**
   * Gets the offset of days at the end
   * of the month.
   * @param year Year.
   * @param month Month.
   * @param day Day.
   * @param firstDayOfWeek First day of the week.
   */
  static weekOffset(
    year: number,
    month: number,
    day: number,
    firstDayOfWeek: DayOfWeek
  ): number {
    const dayOfWeek = new Date(year, month, day);
    const dayOfWeekNumber = dayOfWeek.getDay();
    const firstDayOfWeekNumber = firstDayOfWeek.valueOf();

    if (
      dayOfWeekNumber > firstDayOfWeekNumber ||
      dayOfWeekNumber === firstDayOfWeekNumber
    ) {
      return dayOfWeekNumber - firstDayOfWeekNumber;
    } else {
      return 6 - dayOfWeekNumber;
    }
  }

  /**
   * Gets how many weeks are in the specified month.
   * @param year Year.
   * @param month Month.
   * @param firstDayOfWeek First day of the week.
   */
  static weeksInMonth(year: number,
    month: number,
    firstDayOfWeek: DayOfWeek
  ) {
    let firstWeekEnd = 7 - DateOperations.weekOffset(year, month, 1, firstDayOfWeek);
    let numDays = DateOperations.daysInMonth(year, month);

    let i = 1;
    while (firstWeekEnd < numDays) {
      firstWeekEnd += 7;
      i++;
    }

    return i;
  }
}
