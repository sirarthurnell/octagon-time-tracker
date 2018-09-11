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
    yearNumber: number,
    monthNumber: number,
    weekNumber: number,
    private daysOfWeek: Day[]
  ) {}

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.days);
  }
}
