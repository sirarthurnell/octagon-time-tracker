import { Month } from './month';
import { TimeStorageService } from '../../services/time-storage.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Checking } from './checking';
import { TimeCalculation } from './time-calculation';
import { Day } from './day';

/**
 * Represents a year.
 */
export class Year {
  private static readonly MONTH_COUNT = 12;

  private constructor(public readonly yearNumber: number, public readonly months: Month[]) { }

  /**
   * Creates a year.
   * @param year Year.
   */
  static getYear(timeStorageService: TimeStorageService, year: number): Observable<Year> {
    return this.createYear(timeStorageService, year);
  }

  /**
   * Creates the year.
   */
  private static createYear(timeStorageService: TimeStorageService, year: number): Observable<Year> {
    const months$ = this.getMonths(timeStorageService, year);
    const year$ = months$.pipe(map(months => new Year(year, months)));

    return year$;
  }

  /**
   * Creates the months of the year.
   */
  private static getMonths(timeStorageService: TimeStorageService, year: number): Observable<Month[]> {
    const monthObservables: Observable<Month>[] = [];

    const previousMonth$ = timeStorageService.getMonth(year - 1, this.MONTH_COUNT - 1);
    monthObservables.push(previousMonth$);

    for (let i = 0; i < this.MONTH_COUNT; i++) {
      const currentMonth$ = timeStorageService.getMonth(year, i);
      monthObservables.push(currentMonth$);
    }

    const nextMonth$ = timeStorageService.getMonth(year + 1, 0);
    monthObservables.push(nextMonth$);

    const months$ = forkJoin(monthObservables).pipe(
      map(
        months => {
          this.setPreviousNext(months);
          months.shift();
          months.pop();

          return months;
        }
      )
    );

    return months$;
  }

  /**
   * Sets the previous month and next month of
   * every month inside the array.
   * @param months Months.
   */
  private static setPreviousNext(months: Month[]): void {
    for (let i = 1; i < this.MONTH_COUNT; i++) {
      const currentMonth = months[i];
      currentMonth.previous = months[i - 1];
      currentMonth.next = months[i + 1];
    }
  }

  /**
   * Calculates the total time worked
   * this current year.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.getDays());
  }

  /**
   * Gets all the days of the year.
   */
  private getDays(): Day[] {
    let totalDays: Day[] = [];
    this.months.forEach(month => totalDays = totalDays.concat(month.days));
    return totalDays;
  }
}
