import { Day } from './day';
import { Checking } from './checking';
import { create2dArray } from '../array/array-extensions';
import { DateOperations } from './date-operations';
import { DayOfWeek } from './day-of-week';
import { Week } from './week';
import { TimeCalculation } from './time-calculation';
import * as moment from 'moment';
import { DayInfo } from './day-info';
import { Observable } from 'rxjs';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';

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
    this.setFirstPreviousDay();
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
    this.setLastNextDay();
    this.invalidateWeeks();
  }

  /**
   * Total checkings of the month.
   */
  get checkings(): Checking[] {
    let checkings = [] as Checking[];
    this.days.forEach(day => checkings = checkings.concat(day.checkings));
    return checkings;
  }

  constructor(
    public readonly yearNumber: number,
    public readonly monthNumber: number,
    public readonly firstDayOfWeek: DayOfWeek,
    private readonly checkingsOfMonth: Checking[],
    private dayInfos: { [day: number]: DayInfo } = {}
  ) {
    this.createDays();
    this.setPreviousNextDays();
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
    const saveCb = (timeStorageProvider: TimeStorageProvider) =>
      this.save(timeStorageProvider);

    for (const checking of this.checkingsOfMonth) {
      const dayIndex = checking.dateTime.getDate() - 1;
      daysCheckings[dayIndex].push(checking);
    }

    for (let i = 0; i < daysCount; i++) {
      const currentDayCheckings = daysCheckings[i];
      const dayNumber = i + 1;
      let dayInfo;

      if (this.dayInfos[dayNumber]) {
        dayInfo = this.dayInfos[dayNumber];
      }

      const newDay = new Day(
        this.yearNumber,
        this.monthNumber,
        dayNumber,
        currentDayCheckings,
        saveCb,
        dayInfo
      );

      this._days.push(newDay);
    }
  }

  /**
   * Sets the previous next relationships between
   * the days of the month.
   */
  private setPreviousNextDays(): void {
    // First day treatement.
    this.setFirstPreviousDay();
    const firstDay = this.days[0];
    const secondDay = this.days[1];
    firstDay.next = secondDay;

    // Days in the middle treatement
    for (let i = 1; i < this.days.length - 1; i++) {
      const currentDay = this.days[i];
      currentDay.previous = this.days[i - 1];
      currentDay.next = this.days[i + 1];
    }

    // Last day treatement.
    const lastDay = this.days[this.days.length - 1];
    const beforeLastDay = this.days[this.days.length - 2];
    lastDay.previous = beforeLastDay;
    this.setLastNextDay();
  }

  /**
   * Sets the previous day of the first
   * day of the current month.
   */
  private setFirstPreviousDay(): void {
    const firstDayCurrentMonth = this.days[0];

    if (this.previous) {
      const lastDayPreviousMonth = this.previous.days[this.previous.days.length - 1];
      firstDayCurrentMonth.previous = lastDayPreviousMonth;
    } else {
      firstDayCurrentMonth.previous = undefined;
    }
  }

  /**
   * Sets the next day of the last day
   * of the current month.
   */
  private setLastNextDay(): void {
    const lastDayCurrentMonth = this.days[this.days.length - 1];

    if (this.next) {
      const firstDayNextMonth = this.next.days[0];
      lastDayCurrentMonth.next = firstDayNextMonth;
    } else {
      lastDayCurrentMonth.next = undefined;
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
      ? previousDaysLength +
        this._days.length +
        (daysInWeekUpperIndex - endOffset)
      : this._days.length;

    const weekCount = DateOperations.weeksInMonth(
      this.yearNumber,
      this.monthNumber,
      this.firstDayOfWeek
    );
    const daysInWeeks: Day[][] = create2dArray<Day>(weekCount);
    let weekIndex = -1;
    let dayOfWeekIndex = 0;
    for (
      let totalDaysIndex = beginIndexInclusive, i = 0;
      totalDaysIndex < endIndexExclusive;
      totalDaysIndex++, i++
    ) {
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
  private save(timeStorageProvider: TimeStorageProvider): Observable<any> {
    this.invalidateWeeks();
    return timeStorageProvider.saveMonth(this);
  }

  /**
   * Invalidates week info.
   */
  private invalidateWeeks(): void {
    this._weeks = null;
  }

  /**
   * Gets the week where the specified
   * day is.
   * @param day Day.
   */
  getWeek(day: Day): Week {
    const week = this.weeks.filter(week => week.days.indexOf(day) > -1)[0];
    return week;
  }

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumDaysDuration(this.days);
  }
}
