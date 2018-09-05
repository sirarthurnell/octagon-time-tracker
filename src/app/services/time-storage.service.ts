import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Year } from '../models/time/year';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Month } from '../models/time/month';
import { Settings } from '../models/settings/settings';

/**
 * Service to save time related entities.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeStorageService {
  private readonly SETTINGS_KEY = 'settings';

  constructor(private storage: Storage) { }

  /**
   * Saves the settings.
   * @param settings Settings.
   */
  saveSettings(settings: Settings): void {
    this.storage.set(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  /**
   * Retrieves the settings.
   */
  getSettings(): Observable<Settings> {
    return from(this.storage.get(this.SETTINGS_KEY));
  }

  /**
   * Saves the specified month.
   * @param month Month to save.
   */
  saveMonth(month: Month): void {
    this.storage.set(this.createMonthKey(month.yearNumber, month.monthNumber), JSON.stringify(month.checkings));
  }

  /**
   * Gets the specified month.
   * @param year Year of the month to recover.
   * @param month Month to recover.
   */
  getMonth(year: number, month: number): Observable<Month> {
    return from(this.storage.get(this.createMonthKey(year, month)))
      .pipe(map(checkings => checkings ? new Month(year, month, checkings) : new Month(year, month, [])));
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
