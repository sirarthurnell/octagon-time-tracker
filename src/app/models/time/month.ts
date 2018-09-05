import { Day } from './day';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';
import { DateMath } from './date-math';
import { DayOfWeek } from './day-of-week';
import { Week } from './week';
import { TimeStorageService } from '../../services/time-storage.service';

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
    private timeStorageService: TimeStorageService,
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
    const daysCount = DateMath.daysInMonth(this.yearNumber, this.monthNumber);
    const daysCheckings: Checking[][] = create2dArray(daysCount);
    const saveCb = () => this.save();

    for (const checking of this.checkingsOfMonth) {
      const dayIndex = checking.dateTime.getDate() - 1;
      daysCheckings[dayIndex].push(checking);
    }

    for (let i = 0; i < daysCount; i++) {
      const currentDayCheckings = daysCheckings[i];
      this._days.push(
        new Day(this.yearNumber, this.monthNumber, i + 1, currentDayCheckings, saveCb)
      );
    }
  }

  /**
   * Creates the weeks of the month.
   */
  private createWeeks(): void {
    const weeksAsDays = this.createWeeksAsDays();
    const weeks = this.toWeekArray(weeksAsDays);
    this._weeks.push(...weeks);
  }

  /**
   * Creates the weeks of the month as
   * arrays of days.
   */
  private createWeeksAsDays(): Day[][] {
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
      totalDays = totalDays.concat(this.previous._days);
    }

    if (this.next) {
      totalDays = totalDays.concat(this.next._days);
    }

    const beginIndex = this.previous ? this.previous._days.length - startOffset : 0;
    const endIndex = this.next ? this._days.length + endOffset : this._days.length;

    const weekCount = DateMath.weeksInMonth(this.yearNumber, this.monthNumber, this.firstDayOfWeek);
    const daysInWeeks: Day[][] = create2dArray<Day>(weekCount);
    let currentWeek: Day[] = [];
    for (let i = beginIndex, j = 0; i < endIndex; i++, j++) {

      if (j % 7 === 0) {
        daysInWeeks[j] = currentWeek;
        currentWeek = [];
      } else {
        currentWeek.push(totalDays[i]);
      }

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
      weeks.push(new Week(this.yearNumber, this.monthNumber, weekNumber, weekAsDays));
      weekNumber++;
    }

    return weeks;
  }

  /**
   * Saves the month to storage.
   */
  private save(): void {
    this.updateCheckings();
    this.invalidateWeeks();
    this.timeStorageService.saveMonth(this);
  }

  /**
   * Updates the month checkings.
   */
  private updateCheckings(): void {
    const newCheckingsState = [] as Checking[];

    for (const day of this.days) {
      newCheckingsState.push(...day.checkings);
    }

    this.checkingsOfMonth.splice(0, this.checkingsOfMonth.length);
    this.checkingsOfMonth.push(...newCheckingsState);
  }

  /**
   * Invalidates week info.
   */
  private invalidateWeeks(): void {
    this._weeks = null;
  }
}
