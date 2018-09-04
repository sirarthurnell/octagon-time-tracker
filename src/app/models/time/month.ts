import { Day } from './day';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';
import { daysInMonth } from './date-math';

/**
 * Represents a month.
 */
export class Month {
  days: Day[] = [];
  previous: Month;
  next: Month;

  constructor(
    public readonly yearNumber: number,
    public readonly monthNumber: number,
    public readonly checkings: Checking[]
  ) {
    this.createDays();
  }

  /**
   * Creates the days of the month.
   */
  private createDays() {
    const daysCount = daysInMonth(this.yearNumber, this.monthNumber);
    const daysCheckings: Checking[][] = create2dArray(daysCount);

    for (const checking of this.checkings) {
      const dayIndex = checking.dateTime.getDate() - 1;
      daysCheckings[dayIndex].push(checking);
    }

    for (let i = 0; i < daysCount; i++) {
      const currentDayCheckings = daysCheckings[i];
      this.days.push(new Day(this.yearNumber, this.monthNumber, i + 1, currentDayCheckings));
    }
  }
}
