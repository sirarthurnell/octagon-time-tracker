import { Checking } from './checking';
import * as moment from 'moment';
import { TimeCalculation } from './time-calculation';
import { DayInfo } from './day-info';
import { Observable } from 'rxjs';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { DAYS_OF_WEEK } from '../../text-items/days-of-week';

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
  get name(): string {
    const dayOfWeekNumber = this.asDate.getDay();
    return DAYS_OF_WEEK[dayOfWeekNumber].name;
  }

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
   * Gets the total time as percent of the whole day.
   */
  getTotalTimeAsPercent(): number {
    const oneDayAsMilliseconds = 24 * 60 * 60 * 1000;
    const totalTimeAsMilliseconds = this.calculateTotalTime().as('milliseconds');

    return (totalTimeAsMilliseconds / oneDayAsMilliseconds) * 100;
  }

  /**
   * Gets the formatted total time.
   */
  getFormattedTotalTime(): string {
    return moment
      .utc(this.calculateTotalTime().as('milliseconds'))
      .format('HH:mm');
  }

  /**
   * Calculates the total time worked
   * during the current day.
   */
  calculateTotalTime(): moment.Duration {
    return TimeCalculation.sumWorkingTime(this);
  }

  /**
   * Saves the checkings of the day.
   * @param timeStorageProvider Storage.
   */
  save(timeStorageProvider: TimeStorageProvider): Observable<any> {
    return this.saveCb(timeStorageProvider);
  }
}
