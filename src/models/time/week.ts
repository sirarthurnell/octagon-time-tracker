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
