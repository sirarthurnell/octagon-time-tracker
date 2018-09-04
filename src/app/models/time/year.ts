import { Month } from './month';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';

/**
 * Represents a year.
 */
export class Year {
  readonly months: Month[] = [];

  constructor(public readonly yearNumber: number, public readonly checkings: Checking[]) {
    this.createMonths();
  }

  /**
   * Creates the months of the year.
   */
  private createMonths() {
    const monthCheckings: Checking[][] = create2dArray(12);

    for (const checking of this.checkings) {
      const monthIndex = checking.dateTime.getMonth();
      monthCheckings[monthIndex].push(checking);
    }

    for (let i = 0; i < 12; i++) {
      const currentMonthCheckings = monthCheckings[i];
      this.months.push(new Month(this.yearNumber, i, currentMonthCheckings));
    }
  }
}
