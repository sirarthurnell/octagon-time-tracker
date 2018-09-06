import { Day } from './day';
import * as moment from 'moment';
import { CheckingOperations } from './checking-operations';
import { Checking } from './checking';

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
    return CheckingOperations.sumDuration(this.getTotalCheckings());
  }

  /**
   * Get all the checkings from the days of the week.
   */
  private getTotalCheckings(): Checking[] {
    let totalCheckings: Checking[] = [];
    this.days.forEach(day => totalCheckings = totalCheckings.concat(day.checkings));
    return totalCheckings;
  }
}
