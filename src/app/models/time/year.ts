import { Month } from './month';
import { TimeStorageService } from '../../services/time-storage.service';
import { Observable, forkJoin } from 'rxjs';

/**
 * Represents a year.
 */
export class Year {
  private readonly MONTH_COUNT = 12;
  readonly months: Month[] = [];

  constructor(public readonly yearNumber: number, private timeStorageService: TimeStorageService) {
    this.createMonths();
  }

  /**
   * Creates the months of the year.
   */
  private createMonths() {
    const monthObservables: Observable<Month>[] = [];

    const previousMonth$ = this.timeStorageService.getMonth(this.yearNumber - 1, this.MONTH_COUNT - 1);
    monthObservables.push(previousMonth$);

    for (let i = 0; i < this.MONTH_COUNT; i++) {
      const currentMonth$ = this.timeStorageService.getMonth(this.yearNumber, i);
      monthObservables.push(currentMonth$);
    }

    const nextMonth$ = this.timeStorageService.getMonth(this.yearNumber + 1, 0);
    monthObservables.push(nextMonth$);

    const months$ = forkJoin(monthObservables);
    months$.subscribe(months => {
      this.setPreviousNext(months);
      months.shift();
      months.pop();
      this.months.push(...months);
    });
  }

  /**
   * Sets the previous month and next month of
   * every month inside the array.
   * @param months Months.
   */
  private setPreviousNext(months: Month[]): void {
    for (let i = 1; i < this.MONTH_COUNT; i++) {
      const currentMonth = months[i];
      currentMonth.previous = months[i - 1];
      currentMonth.next = months[i + 1];
    }
  }
}
