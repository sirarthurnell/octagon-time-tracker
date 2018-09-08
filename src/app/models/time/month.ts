import { Day } from './day';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';
import { DateOperations } from './date-operations';
import { DayOfWeek } from './day-of-week';
import { Week } from './week';
import { TimeStorageService } from '../../services/time-storage.service';
import { CheckingOperations } from './checking-operations';
import * as moment from 'moment';

/**
 * Represents a month.
 */
export class Month {
  /**
   * Gets the days of the month.
   */
  private _days: Day[] = [];
  get days(): Day[] {
    return [].concat(this._days);
  }

  /**
   * Gets the weeks of the month.
   */
  private _weeks: Week[] = null;
  get weeks(): Week[] {
    if (!this._weeks) {
      this.createWeeks();
    }

    return [].concat(this._weeks);
  }

  /**
   * Previous month.
   */
  private _previous: Month;

  get previous(): Month {
    return this._previous;
  }

  set previous(previous: Month) {
    this._previous = previous;
    this.invalidateWeeks();
  }

  /**
   * Next month.
   */
  private _next: Month;

  get next(): Month {
    return this._next;
  }

  set next(next: Month) {
    this._next = next;
    this.invalidateWeeks();
  }

  /**
   * Checkings of the month.
   */
  get checkings(): Checking[] {
    return [].concat(this.checkingsOfMonth);
  }

  constructor(
    public readonly yearNumber: number,
    public readonly monthNumber: number,
    public readonly firstDayOfWeek: DayOfWeek,
    private readonly checkingsOfMonth: Checking[]
  ) {
    this.createDays();
  }

  /**
   * Creates the days of the month.
   */
  private createDays(): void {
    const daysCount = DateOperations.daysInMonth(
      this.yearNumber,
      this.monthNumber
    );
    const daysCheckings: Checking[][] = create2dArray(daysCount);
    const saveCb = (timeStorageService: TimeStorageService) => this.save(timeStorageService);

    for (const checking of this.checkingsOfMonth) {
      const dayIndex = checking.dateTime.getDate() - 1;
      daysCheckings[dayIndex].push(checking);
    }

    for (let i = 0; i < daysCount; i++) {
      const currentDayCheckings = daysCheckings[i];
      this._days.push(
        new Day(
          this.yearNumber,
          this.monthNumber,
          i + 1,
          currentDayCheckings,
          saveCb
        )
      );
    }
  }

  /**
   * Creates the weeks of the month.
   */
  private createWeeks(): void {
    const weeksAsDays = this.createWeeksAsDays();
    const weeks = this.toWeekArray(weeksAsDays);
    this._weeks = weeks;
  }

  /**
   * Creates the weeks of the month as
   * arrays of days.
   */
  private createWeeksAsDays(): Day[][] {
    const daysInWeekCount = 7;
    const daysInWeekUpperIndex = daysInWeekCount - 1;
    const firstDay = 1;
    const lastDay = DateOperations.daysInMonth(
      this.yearNumber,
      this.monthNumber
    );
    const startOffset = DateOperations.weekStartOffset(
      this.yearNumber,
      this.monthNumber,
      firstDay,
      this.firstDayOfWeek
    );
    const endOffset = DateOperations.weekStartOffset(
      this.yearNumber,
      this.monthNumber,
      lastDay,
      this.firstDayOfWeek
    );

    let totalDays: Day[] = [];
    if (this.previous) {
      totalDays = totalDays.concat(this.previous._days);
    }

    totalDays = totalDays.concat(this._days);

    if (this.next) {
      totalDays = totalDays.concat(this.next._days);
    }

    const previousDaysLength = this._previous ? this._previous._days.length : 0;
    const beginIndexInclusive = this.previous
      ? previousDaysLength - startOffset
      : 0;

    const endIndexExclusive = this.next
      ? previousDaysLength + this._days.length + (daysInWeekUpperIndex - endOffset)
      : this._days.length;

    const weekCount = DateOperations.weeksInMonth(
      this.yearNumber,
      this.monthNumber,
      this.firstDayOfWeek
    );
    const daysInWeeks: Day[][] = create2dArray<Day>(weekCount);
    let weekIndex = -1;
    let dayOfWeekIndex = 0;
    for (let totalDaysIndex = beginIndexInclusive, i = 0; totalDaysIndex < endIndexExclusive; totalDaysIndex++, i++) {

      dayOfWeekIndex = i % 7;
      weekIndex = dayOfWeekIndex === 0 ? weekIndex + 1 : weekIndex;
      daysInWeeks[weekIndex][dayOfWeekIndex] = totalDays[totalDaysIndex];

    }

    return daysInWeeks;
  }

  /**
   * Converts a 2D array of days to
   * an array of Weeks.
   * @param days Days as array.
   */
  private toWeekArray(days: Day[][]): Week[] {
    const weeks: Week[] = [];

    let weekNumber = 0;
    for (const weekAsDays of days) {
      weeks.push(
        new Week(this.yearNumber, this.monthNumber, weekNumber, weekAsDays)
      );
      weekNumber++;
    }

    return weeks;
  }

  /**
   * Saves the month to storage.
   */
  private save(timeStorageService: TimeStorageService): void {
    this.updateCheckings();
    this.invalidateWeeks();
    timeStorageService.saveMonth(this);
  }

  /**
   * Updates the month checkings.
   */
  private updateCheckings(): void {
    const newCheckingsState = [] as Checking[];

    for (const day of this.days) {
      day.checkings.forEach(checking => newCheckingsState.push(checking));
    }

    this.checkingsOfMonth.splice(0, this.checkingsOfMonth.length); // Clear.
    newCheckingsState.forEach(checking => this.checkingsOfMonth.push(checking)); // Dump.
  }

  /**
   * Invalidates week info.
   */
  private invalidateWeeks(): void {
    this._weeks = null;
  }

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return CheckingOperations.sumDuration(this.checkings);
  }
}
