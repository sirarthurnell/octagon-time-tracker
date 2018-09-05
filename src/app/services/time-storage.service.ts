import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Month } from '../models/time/month';
import { SettingsService } from './settings.service';

/**
 * Service to save time related entities.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeStorageService {
  constructor(private storage: Storage, private settings: SettingsService) {}

  /**
   * Saves the specified month.
   * @param month Month to save.
   */
  saveMonth(month: Month): void {
    this.storage.set(
      this.createMonthKey(month.yearNumber, month.monthNumber),
      JSON.stringify(month.checkings)
    );
  }

  /**
   * Gets the specified month.
   * @param year Year of the month to recover.
   * @param month Month to recover.
   */
  getMonth(year: number, month: number): Observable<Month> {
    const settings$ = this.settings.getSettings();
    const checkings$ = from(this.storage.get(this.createMonthKey(year, month)));
    const month$ = zip(settings$, checkings$).pipe(
      map(both => {
        const settings = both[0];
        const checkings = both[1];

        return checkings
          ? new Month(this, year, month, settings.firstDayOfWeek, checkings)
          : new Month(this, year, month, settings.firstDayOfWeek, []);
      })
    );

    return month$;
  }

  /**
   * Creates the month key used to store and
   * retrieve Month objects.
   * @param year Year.
   * @param month Month.
   */
  private createMonthKey(year: number, month: number): string {
    return `${year}/${month}`;
  }
}
