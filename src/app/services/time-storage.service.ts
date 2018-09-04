import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Year } from '../models/time/year';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service to save time related entities.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeStorageService {

  constructor(private storage: Storage) { }

  /**
   * Saves the specified year.
   * @param year Year to save.
   */
  saveYear(year: Year): void {
    this.storage.set(year.yearNumber.toString(), JSON.stringify(year.checkings));
  }

  /**
   * Gets the specified year.
   * @param year Year to recover.
   */
  getYear(year: number): Observable<Year> {
    return from(this.storage.get(year.toString()))
      .pipe(map(checkings => checkings ? new Year(year, checkings) : new Year(year, [])));
  }

}
