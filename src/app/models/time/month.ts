import { Day } from './day';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';
import { DateMath } from './date-math';
import { DayOfWeek } from './day-of-week';

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
    private readonly firstDayOfWeek: DayOfWeek,
    public readonly checkings: Checking[]
  ) {
    this.createDays();
  }

  /**
   * Creates the days of the month.
   */
  private createDays(): void {
    const daysCount = DateMath.daysInMonth(this.yearNumber, this.monthNumber);
    const daysCheckings: Checking[][] = create2dArray(daysCount);

    for (const checking of this.checkings) {
      const dayIndex = checking.dateTime.getDate() - 1;
      daysCheckings[dayIndex].push(checking);
    }

    for (let i = 0; i < daysCount; i++) {
      const currentDayCheckings = daysCheckings[i];
      this.days.push(
        new Day(this.yearNumber, this.monthNumber, i + 1, currentDayCheckings)
      );
    }
  }

  /**
   * Creates the weeks of the month.
   */
  private createWeeks(): void {
    const firstDay = 1;
    const lastDay = DateMath.daysInMonth(this.yearNumber, this.monthNumber);
    const startOffset = DateMath.weekStartOffset(
      this.yearNumber,
      this.monthNumber,
      firstDay,
      this.firstDayOfWeek
    );
    const endOffset = DateMath.weekStartOffset(
      this.yearNumber,
      this.monthNumber,
      lastDay,
      this.firstDayOfWeek
    );

    let totalDays: Day[] = [];
    if (this.previous) {
      totalDays = totalDays.concat(this.previous.days);
    }

    if (this.next) {
      totalDays = totalDays.concat(this.next.days);
    }

    const beginIndex = this.previous ? this.previous.days.length - startOffset : 0;
    const endIndex = this.next ? this.days.length + endOffset : this.days.length;

    const weekCount = DateMath.weeksInMonth(this.yearNumber, this.monthNumber, this.firstDayOfWeek);
    const daysInWeeks: Day[][] = create2dArray<Day>(weekCount);
    for (let i = beginIndex; i < endIndex; i++) {
      // TODO Treat the whole array.
    }
  }
}
