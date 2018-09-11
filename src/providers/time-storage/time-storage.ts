import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators';
import { StorableMonth } from '../../models/storage/storable-month';
import { Month } from '../../models/time/month';
import { SettingsProvider } from '../settings/settings';


@Injectable()
export class TimeStorageProvider {
  constructor(private storage: Storage, private settings: SettingsProvider) {}

  /**
   * Saves the specified month.
   * @param month Month to save.
   */
  saveMonth(month: Month): Observable<any> {
    return from(
      this.storage.set(
        this.createMonthKey(month.yearNumber, month.monthNumber),
        JSON.stringify(StorableMonth.toStorable(month))
      )
    );
  }

  /**
   * Gets the specified month.
   * @param year Year of the month to recover.
   * @param month Month to recover.
   */
  getMonth(year: number, month: number): Observable<Month> {
    const settings$ = this.settings.getSettings();
    const storedMonth$ = from(this.storage.get(this.createMonthKey(year, month)));
    const month$ = zip(settings$, storedMonth$).pipe(
      map(both => {
        const settings = both[0];
        const stored = both[1]
          ? (JSON.parse(both[1]) as StorableMonth) : null;

        if (stored) {
          return StorableMonth.fromStorable(year, month, settings.firstDayOfWeek, stored);
        } else {
          return new Month(year, month, settings.firstDayOfWeek, [], {});
        }
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
