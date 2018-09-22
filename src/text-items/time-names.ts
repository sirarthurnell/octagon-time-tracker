import * as moment from 'moment';
import { getLocale, getLocalizedFirstDayOfWeek } from './date-time-formats';

/**
 * Contains information about the day of
 * the week.
 */
export interface DayOfWeek {
  name: string;
  type: string;
}

/**
 * Contains localized names for different time
 * periods.
 */
export class TimeNames {
  private static readonly MONTH_COUNT = 12;
  private static readonly DAYS_OF_WEEK_COUNT = 7;

  /**
   * Gets the name of the month.
   * @param monthNumber Month number starting at 0.
   */
  static getMonthName(monthNumber: number): string {
    const now = new Date();
    const forLocalization = new Date(now.getFullYear(), monthNumber + 1, 0);
    return moment(forLocalization)
      .locale(getLocale())
      .format('MMMM');
  }

  /**
   * Get the names of the months.
   */
  static getMonthNames(short = false): string[] {
    const names = [] as string[];

    for (let i = 0; i < this.MONTH_COUNT; i++) {
      const monthName = short
        ? this.getMonthName(i).substr(0, 3)
        : this.getMonthName(i);

      names.push(TimeNames.capitalize(monthName));
    }

    return names;
  }

  /**
   * Capitalizes the specified string.
   * @param str String to capitalize.
   */
  private static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Gets the name of the day.
   * @param dayOfWeekNumber Day of week starting at 0 (Sunday).
   */
  static getDayOfWeekName(dayOfWeekNumber: number): string {
    const forLocalization = new Date(2018, 8, 9 + dayOfWeekNumber);
    return moment(forLocalization)
      .locale(getLocale())
      .format('dddd');
  }

  /**
   * Gets the days of the week.
   */
  static getDaysOfWeek(): DayOfWeek[] {
    const original = [
      { name: this.getDayOfWeekName(0).substr(0, 1), type: 'sunday' },
      { name: this.getDayOfWeekName(1).substr(0, 1), type: 'normal' },
      { name: this.getDayOfWeekName(2).substr(0, 1), type: 'normal' },
      { name: this.getDayOfWeekName(3).substr(0, 1), type: 'normal' },
      { name: this.getDayOfWeekName(4).substr(0, 1), type: 'normal' },
      { name: this.getDayOfWeekName(5).substr(0, 1), type: 'normal' },
      { name: this.getDayOfWeekName(6).substr(0, 1), type: 'saturday' }
    ];

    const reordered = [] as DayOfWeek[];
    const firstDayOfWeek = getLocalizedFirstDayOfWeek();
    for (let i = 0; i < this.DAYS_OF_WEEK_COUNT; i++) {
      reordered.push(original[(i + firstDayOfWeek) % this.DAYS_OF_WEEK_COUNT]);
    }

    return reordered;
  }
}
