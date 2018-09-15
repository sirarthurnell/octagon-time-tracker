import * as moment from 'moment';
import { Day } from './day';
import { TimeCalculation } from './time-calculation';

/**
 * Represents a week.
 */
export class Week {
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
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.days);
  }
}
