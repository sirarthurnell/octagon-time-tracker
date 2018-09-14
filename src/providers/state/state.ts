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
  private year: Year;
  private yearSubject: BehaviorSubject<Year>;
  year$: Observable<Year>;

  /**
   * Gets the current month.
   */
  private month: Month;
  private monthSubject: BehaviorSubject<Month>;
  month$: Observable<Month>;

  /**
   * Gets the current week.
   */
  private week: Week;
  private weekSubject: BehaviorSubject<Week>;
  week$: Observable<Week>;

  /**
   * Gets the current day.
   */
  private day: Day;
  private daySubject: BehaviorSubject<Day>;
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

        this.init(year, month, week, day);
      });
    });
  }

  /**
   * Creates the subjects.
   */
  private createSubjects() {
    this.yearSubject = new BehaviorSubject<Year>(null);
    this.year$ = this.yearSubject.asObservable();

    this.monthSubject = new BehaviorSubject<Month>(null);
    this.month$ = this.monthSubject.asObservable();

    this.weekSubject = new BehaviorSubject<Week>(null);
    this.week$ = this.weekSubject.asObservable();

    this.daySubject = new BehaviorSubject<Day>(null);
    this.day$ = this.daySubject.asObservable();
  }

  /**
   * Sets the current state.
   * @param year Current year.
   * @param month Current month.
   * @param week Current week.
   * @param day Current day.
   */
  private init(year: Year, month?: Month, week?: Week, day?: Day): void {
    this.setYear(year);
    this.monthSubject.next(month);
    this.weekSubject.next(week);
    this.daySubject.next(day);
  }

  /**
   * Sets the current year.
   * @param year Year.
   */
  setYear(year: Year): void {
    this.year = year;
    this.yearSubject.next(this.year);
  }

  /**
   * Sets the current month.
   * @param month Month.
   */
  setMonth(month: Month): void {
    this.month = month;
    this.monthSubject.next(this.month);
  }

  /**
   * Sets the current week.
   * @param week Week.
   */
  setWeek(week: Week): void {
    this.week = week;
    this.weekSubject.next(week);
  }

  /**
   * Sets the current day.
   * @param day Day.
   */
  setDay(day: Day): void {
    this.day = day;
    this.daySubject.next(day);
  }
}
