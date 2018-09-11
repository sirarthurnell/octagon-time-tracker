import { Checking } from './checking';
import * as moment from 'moment';
import { TimeCalculation } from './time-calculation';
import { DayInfo } from './day-info';
import { Observable } from 'rxjs';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';

/**
 * Represents a day.
 */
export class Day {

  /**
   * Previous day.
   */
  previous: Day;

  /**
   * Next day.
   */
  next: Day;

  constructor(
    public yearNumber: number,
    public monthNumber: number,
    public dayNumber: number,
    readonly checkings: Checking[],
    private saveCb: (timeStorageProvider: TimeStorageProvider) => Observable<any>,
    public info?: DayInfo
  ) {}

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
