import { Injectable } from '@angular/core';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { Week } from '../../models/time/week';
import { Year } from '../../models/time/year';
import { Platform } from 'ionic-angular';
import { TimeStorageProvider } from '../time-storage/time-storage';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Keeps the current state of the application.
 */
@Injectable()
export class StateProvider {
  readonly TODAY = new Date();

  /**
   * Gets the current year.
   */
  private _yearSubject: BehaviorSubject<Year>;
  year$: Observable<Year>;

  /**
   * Gets the current month.
   */
  private _monthSubject: BehaviorSubject<Month>;
  month$: Observable<Month>;

  /**
   * Gets the current week.
   */
  private _weekSubject: BehaviorSubject<Week>;
  week$: Observable<Week>;

  /**
   * Gets the current day.
   */
  private _daySubject: BehaviorSubject<Day>;
  day$: Observable<Day>;

  constructor(platform: Platform, storage: TimeStorageProvider) {
    this.createSubjects();

    platform.ready().then(() => {
      // Load saved state into memory.
      Year.getYear(storage, this.TODAY.getFullYear()).subscribe(year => {
        const month = year.months[this.TODAY.getMonth()];
        const day = month.days[this.TODAY.getDate() + 1];
        const week = month.weeks.filter(
          currentWeek => currentWeek.days.indexOf(day) > -1
        )[0];

        this.setCurrent(year, month, week, day);
      });
    });
  }

  /**
   * Creates the subjects.
   */
  private createSubjects() {
    this._yearSubject = new BehaviorSubject<Year>(null);
    this.year$ = this._yearSubject.asObservable();

    this._monthSubject = new BehaviorSubject<Month>(null);
    this.month$ = this._monthSubject.asObservable();

    this._weekSubject = new BehaviorSubject<Week>(null);
    this.week$ = this._weekSubject.asObservable();

    this._daySubject = new BehaviorSubject<Day>(null);
    this.day$ = this._daySubject.asObservable();
  }

  /**
   * Sets the current state.
   * @param year Current year.
   * @param month Current month.
   * @param week Current week.
   * @param day Current day.
   */
  setCurrent(year: Year, month?: Month, week?: Week, day?: Day): void {
    this._yearSubject.next(year);
    this._monthSubject.next(month);
    this._weekSubject.next(week);
    this._daySubject.next(day);

    console.log('State changed', {
      year,
      month,
      week,
      day
    });
  }
}
