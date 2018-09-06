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
  static daysInMonth(year, month): number {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  /**
   * Gets the offset in days at the start
   * of the month.
   * @param year Year.
   * @param month Month.
   * @param day Day.
   * @param firstDayOfWeek First day of the week.
   */
  static weekStartOffset(year: number, month: number, day: number, firstDayOfWeek: DayOfWeek): number {
    const dayOfWeek = new Date(year, month, day);
    const startOffset = dayOfWeek.getDay() - firstDayOfWeek.valueOf();

    return startOffset;
  }

  /**
   * Gets how many weeks are in the specified month.
   * @param year Year.
   * @param month Month.
   * @param firstDayOfWeek First day of the week.
   */
  static weeksInMonth(year: number, month: number, firstDayOfWeek: DayOfWeek): number {
    const firstDay = 1;
    const startOffset = DateOperations.weekStartOffset(year, month, firstDay, firstDayOfWeek);
    const daysCount = DateOperations.daysInMonth(year, month);

    if (startOffset === 0 && daysCount % 7 === 0) {
        return 4;
    } else {
        return DateOperations.countFirstDayOfWeekTimeInMonth(year, month, firstDayOfWeek) + 1;
    }
  }

  /**
   * Counts the number of occurrences of
   * days considered first day of the week.
   * @param year Year.
   * @param month Month.
   * @param firstDayOfWeek First day of the week.
   */
  private static countFirstDayOfWeekTimeInMonth(year: number, month: number, firstDayOfWeek: DayOfWeek): number {
      const daysInMonth = DateOperations.daysInMonth(year, month);
      let firstsCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        if (currentDay.getDay() === firstDayOfWeek.valueOf()) {
            firstsCount++;
        }
      }

      return firstsCount;
  }
}
