import * as moment from 'moment';
import 'moment-duration-format';
import { Observable } from 'rxjs';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { SHORT_TIME_FORMAT } from '../../text-items/date-time-formats';
import { TimeNames } from '../../text-items/time-names';
import { Checking } from './checking';
import { DayInfo } from './day-info';
import { TimeCalculation } from './time-calculation';

/**
 * Represents a day.
 */
export class Day {
  /**
   * Gets the date representation of the day.
   */
  public readonly asDate: Date;

  /**
   * Previous day.
   */
  previous: Day;

  /**
   * Next day.
   */
  next: Day;

  /**
   * Gets the name of the day.
   */
  readonly name: string;

  constructor(
    public yearNumber: number,
    public monthNumber: number,
    public dayNumber: number,
    readonly checkings: Checking[],
    private saveCb: (
      timeStorageProvider: TimeStorageProvider
    ) => Observable<any>,
    public info?: DayInfo
  ) {
    this.asDate = new Date(this.yearNumber, this.monthNumber, this.dayNumber);
    this.name = TimeNames.getDayOfWeekName(this.asDate.getDay());
  }

  /**
   * Checks if the current day is Saturday.
   */
  isSaturday(): boolean {
    return this.asDate.getDay() === 6;
  }

  /**
   * Checks if the current day is Sunday.
   */
  isSunday(): boolean {
    return this.asDate.getDay() === 0;
  }

  /**
   * Gets the most recent checking of the day.
   */
  getMostRecentChecking(): Checking {
    const orderedCheckings = this.getOrderedCheckings();

    if(orderedCheckings.length > 0) {
      return orderedCheckings.pop();
    } else {
      return null;
    }
  }

  /**
   * Gets the oldest checking of the day.
   */
  getOldestChecking(): Checking {
    const orderedCheckings = this.getOrderedCheckings();

    if(orderedCheckings.length > 0) {
      return orderedCheckings[0];
    } else {
      return null;
    }
  }

  /**
   * Gets the checkings of this day adjusted.
   */
  getAdjustedCheckings(): Checking[] {
    return TimeCalculation.adjustCheckings(this);
  }

  /**
   * Gets the day checkins ordered in ascending way.
   */
  getOrderedCheckings(): Checking[] {
    return TimeCalculation.orderAscending(this.checkings);
  }

  /**
   * Gets the total time as percent of the whole day.
   */
  getTotalTimeAsPercent(): number {
    const oneDayAsMilliseconds = 24 * 60 * 60 * 1000;
    const totalTimeAsMilliseconds = this.calculateTotalTime().as('milliseconds');

    return (totalTimeAsMilliseconds / oneDayAsMilliseconds) * 100;
  }

  /**
   * Checks if the day is the current day.
   */
  isToday(): boolean {
    const today = new Date();

    return (
      this.yearNumber === today.getFullYear() &&
      this.monthNumber === today.getMonth() &&
      this.dayNumber === today.getDate()
    );
  }

  /**
   * Gets the formatted total time.
   */
  getFormattedTotalTime(): string {
    return this.calculateTotalTime().format(SHORT_TIME_FORMAT, { trim: false })
  }

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumWorkingTime(this);
  }

  /**
   * This week was worked.
   */
  isWorked(): boolean {
    return this.calculateTotalTime().as('milliseconds') > 0;
  }

  /**
   * Saves the checkings of the day.
   * @param timeStorageProvider Storage.
   */
  save(timeStorageProvider: TimeStorageProvider): Observable<any> {
    return this.saveCb(timeStorageProvider);
  }
}
