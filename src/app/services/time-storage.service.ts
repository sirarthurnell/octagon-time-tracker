import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
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
    return from(this.storage.get(this.createMonthKey(year, month))).pipe(
      map(
        checkings =>
          checkings
            ? new Month(year, month, checkings)
            : new Month(year, month, [])
      )
    );
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
