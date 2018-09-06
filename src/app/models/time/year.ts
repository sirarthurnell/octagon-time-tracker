import { Month } from './month';
import { TimeStorageService } from '../../services/time-storage.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Checking } from './checking';
import { CheckingOperations } from './checking-operations';

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
    return CheckingOperations.sumDuration(this.getTotalCheckings());
  }

  /**
   * Get all the checkings from the months of the year.
   */
  private getTotalCheckings(): Checking[] {
    let totalCheckings: Checking[] = [];
    this.months.forEach(month => totalCheckings = totalCheckings.concat(month.checkings));
    return totalCheckings;
  }
}
