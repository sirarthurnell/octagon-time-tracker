import * as moment from 'moment';
import { Day } from './day';
import { TimeCalculation } from './time-calculation';
import { MONTH_NAMES } from '../../text-items/months';

/**
 * Represents a week.
 */
export class Week {
  /**
   * Gets the name of the week.
   */
  get name(): string {
    const firstDay = this.getFirstDay();
    const lastDay = this.getLastDay();

    if (firstDay.monthNumber === lastDay.monthNumber) {
      return `${MONTH_NAMES[firstDay.monthNumber]} ${firstDay.dayNumber} - ${
        lastDay.dayNumber
      }`;
    } else {
      return `${MONTH_NAMES[firstDay.monthNumber].substr(0, 3)}. ${
        firstDay.dayNumber
      } - ${MONTH_NAMES[lastDay.monthNumber].substr(0, 3)}. ${
        lastDay.dayNumber
      }`;
    }
  }

  /**
   * Gets the days of the week.
   */
  get days(): Day[] {
    return [].concat(this.daysOfWeek);
  }

  constructor(
    public yearNumber: number,
    public monthNumber: number,
    public weekNumber: number,
    private daysOfWeek: Day[]
  ) {}

  /**
   * Gets the first day of the week.
   */
  getFirstDay(): Day {
    return this.days[0];
  }

  /**
   * Gets the last day of the week.
   */
  getLastDay(): Day {
    return this.days[this.days.length - 1];
  }

  /**
   * Checks if the day specified is from the
   * month of this week.
   * @param day Day to check.
   */
  isFromPreviusNextMonth(day: Day): boolean {
    const differentMonth = day.monthNumber !== this.monthNumber;
    return differentMonth;
  }

  /**
   * Gets worked average time as the percent of a day.
   */
  getWorkedAverageTimeAsPercent(): number {
    const oneDayAsMilliseconds = 24 * 60 * 60 * 1000;
    const average = this.calculateWorkedAverageTime().as('milliseconds');

    return (average / oneDayAsMilliseconds) * 100;
  }

  /**
   * Gets the formatted total time.
   */
  getFormattedWorkedAverageTime(): string {
    return moment
      .utc(this.calculateWorkedAverageTime().as('milliseconds'))
      .format('HH:mm');
  }

  /**
   * Calculates the worked average time per day worked.
   */
  calculateWorkedAverageTime(): moment.Duration {
    if (this.isWorked()) {
      const average = Math.floor(
        this.calculateTotalTime().as('milliseconds') / this.getDaysWorkedCount()
      );

      return moment.duration(average);
    } else {
      return moment.duration();
    }
  }

  /**
   * Gets the number of days worked.
   */
  getDaysWorkedCount(): number {
    const workedDays = this.days.filter(
      day => day.isWorked()
    );

    return workedDays.length;
  }

  /**
   * This week was worked.
   */
  isWorked(): boolean {
    return this.calculateTotalTime().as('milliseconds') > 0;
  }

  /**
   * Gets the formatted total time.
   */
  getFormattedWorkedTotalTime(): string {
    return moment
      .utc(this.calculateTotalTime().as('milliseconds'))
      .format('hh:mm');
  }

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.days);
  }

  /**
   * Checks if the week is the current week.
   */
  isThisWeek(): boolean {
    const today = new Date();

    return (
      this.yearNumber === today.getFullYear() &&
      this.monthNumber === today.getMonth() &&
      !!this.days.find(day => day.dayNumber === today.getDate())
    );
  }
}
