import { Checking } from './checking';
import * as moment from 'moment';
import { TimeCalculation } from './time-calculation';
import { TimeStorageService } from '../../services/time-storage.service';
import { DayInfo } from './day-info';
import { Observable } from 'rxjs';

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
    private saveCb: (timeStorageService: TimeStorageService) => Observable<any>,
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
   * @param timeStorageService Storage.
   */
  save(timeStorageService: TimeStorageService): Observable<any> {
    return this.saveCb(timeStorageService);
  }
}
