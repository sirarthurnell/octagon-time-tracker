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
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.days);
  }
}
