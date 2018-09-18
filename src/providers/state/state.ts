import { Injectable } from '@angular/core';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { Week } from '../../models/time/week';
import { Year } from '../../models/time/year';
import { Platform } from 'ionic-angular';
import { TimeStorageProvider } from '../time-storage/time-storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

/**
 * Contains the new state of the application
 * after a change.
 */
export class StateChanged {
  year: Year;
  month: Month;
  week: Week;
  day: Day;

  static empty(): StateChanged {
    return {
      year: null,
      month: null,
      week: null,
      day: null
    };
  }
}

/**
 * Keeps the current state of the application.
 */
@Injectable()
export class StateProvider {
  /**
   * Gets the current computed day.
   */
  public get TODAY(): Date {
    return new Date();
  }

  private _changeSubject = new BehaviorSubject<StateChanged>(
    StateChanged.empty()
  );
  change$ = this._changeSubject.asObservable();

  /**
   * Gets the current year.
   */
  private _yearSnapshot: Year;
  get yearSnapshot(): Year {
    return this._yearSnapshot;
  }

  /**
   * Gets the current month.
   */
  private _monthSnapshot: Month;
  get monthSnapshot(): Month {
    return this._monthSnapshot;
  }

  /**
   * Gets the current week.
   */
  private _weekSnapshot: Week;
  get weekSnapshot(): Week {
    return this._weekSnapshot;
  }

  /**
   * Gets the current day.
   */
  private _daySnapshot: Day;
  get daySnapshot(): Day {
    return this._daySnapshot;
  }

  constructor(platform: Platform, private storage: TimeStorageProvider) {
    platform.ready().then(() => {
      Year.getYear(this.storage, this.TODAY.getFullYear()).subscribe(year =>
        this.init(year)
      );
    });
  }

  /**
   * Initializes the state with the
   * specified year.
   * @param newYear Year.
   */
  private init(newYear: Year): void {
    const year = this.changeYear(newYear);
    const month = this.changeMonth(this.TODAY.getMonth(), year.months);
    const day = this.changeDay(this.TODAY.getDate(), month.days);
    this.changeWeek(day, month);

    this.emitChange();
  }

  /**
   * Checks if the day specified is the day
   * selected by the user.
   * @param day Day to check.
   */
  isSelectedDay(day: Day): boolean {
    return day.dayNumber === this.daySnapshot.dayNumber;
  }

  /**
   * Checks if the day specified is the current day.
   * @param day Day to check.
   */
  isToday(day: Day): boolean {
    return day.isToday();
  }

  /**
   * Checks if the month specified is the current month.
   * @param month Month to check.
   */
  isThisMonth(month: Month): boolean {
    return month.isThisMonth();
  }

  /**
   * Checks if the week specified is the current week.
   * @param week Week to check.
   */
  isThisWeek(week: Week): boolean {
    return week.isThisWeek();
  }

  /**
   * Checks if the year specified is the current year.
   * @param year Year to check.
   */
  isThisYear(year: Year): boolean {
    return year.isThisYear();
  }

  /**
   * Sets today as the current state.
   */
  setToday(): Observable<StateChanged> {
    return this.setByDate(this.TODAY);
  }

  /**
   * Sets the next year.
   */
  setNextYear(): Observable<StateChanged> {
    return this.setByDate(
      new Date(
        this.yearSnapshot.yearNumber + 1,
        this.monthSnapshot.monthNumber,
        this.daySnapshot.dayNumber
      )
    );
  }

  /**
   * Sets the previous year.
   */
  setPreviousYear(): Observable<StateChanged> {
    return this.setByDate(
      new Date(
        this.yearSnapshot.yearNumber - 1,
        this.monthSnapshot.monthNumber,
        this.daySnapshot.dayNumber
      )
    );
  }

  /**
   * Sets the state to reflect the specified
   * year, but preserving month, day and week
   * (if possible).
   * @param year New year.
   */
  setYear(year: Year): Observable<StateChanged> {
    return this.setByDate(
      new Date(
        year.yearNumber,
        this.monthSnapshot.monthNumber,
        this.daySnapshot.dayNumber
      )
    );
  }

  /**
   * Sets the previous month.
   */
  setPreviousMonth(): Observable<StateChanged> {
    return this.setMonth(this.monthSnapshot.previous);
  }

  /**
   * Sets the next month.
   */
  setNextMonth(): Observable<StateChanged> {
    return this.setMonth(this.monthSnapshot.next);
  }

  /**
   * Sets the state to reflect the specified
   * month, but preserving the year, day and week
   * (if possible).
   * @param month New month.
   */
  setMonth(month: Month): Observable<StateChanged> {
    return this.setByDate(
      new Date(month.yearNumber, month.monthNumber, this.daySnapshot.dayNumber)
    );
  }

  /**
   * Sets the previous week.
   */
  setPreviousWeek(): Observable<StateChanged> {
    return this.setDay(this.weekSnapshot.getFirstDay().previous);
  }

  /**
   * Sets the next week.
   */
  setNextWeek(): Observable<StateChanged> {
    return this.setDay(this.weekSnapshot.getLastDay().next);
  }

  /**
   * Sets the state to reflect the specified week.
   * @param month Month that includes the week.
   * @param day Day that indentifies the week.
   */
  setWeek(day: Day): Observable<StateChanged> {
    return this.setByDate(
      new Date(day.yearNumber, day.monthNumber, day.dayNumber)
    );
  }

  /**
   * Sets the previous day.
   */
  setPreviousDay(): Observable<StateChanged> {
    return this.setDay(this.daySnapshot.previous);
  }

  /**
   * Sets the next day.
   */
  setNextDay(): Observable<StateChanged> {
    return this.setDay(this.daySnapshot.next);
  }

  /**
   * Sets the state to reflect the day specified.
   * @param day Day to set.
   */
  setDay(day: Day): Observable<StateChanged> {
    return this.setByDate(
      new Date(day.yearNumber, day.monthNumber, day.dayNumber)
    );
  }

  /**
   * Sets the state specified by date.
   * @param date Date to set.
   */
  setByDate(date: Date): Observable<StateChanged> {
    let observable: Observable<StateChanged> = empty();

    if (date.getFullYear() !== this.yearSnapshot.yearNumber) {
      observable = Year.getYear(this.storage, date.getFullYear()).pipe(
        tap(newYear => {
          const year = this.changeYear(newYear);
          const month = this.changeMonth(date.getMonth(), year.months);
          const day = this.changeDay(date.getDate(), month.days);
          this.changeWeek(day, month);
        }),
        map(_ => this.emitChange())
      );
    } else if (date.getMonth() !== this.monthSnapshot.monthNumber) {
      const month = this.changeMonth(date.getMonth(), this.yearSnapshot.months);
      const day = this.changeDay(date.getDate(), month.days);
      this.changeWeek(day, month);

      observable = of(this.emitChange());
    } else if (date.getDate() !== this.daySnapshot.dayNumber) {
      const day = this.changeDay(date.getDate(), this.monthSnapshot.days);
      const newWeek = this.monthSnapshot.getWeek(day);
      if (newWeek !== this._weekSnapshot) {
        this.changeWeek(day, this.monthSnapshot);
      }

      observable = of(this.emitChange());
    } else {
      observable = of(this.emitChange());
    }

    return observable;
  }

  /**
   * Changes the year.
   * @param year Year.
   */
  private changeYear(year: Year): Year {
    this._yearSnapshot = year;
    return year;
  }

  /**
   * Changes the month by month number.
   * @param monthNumber Number of the new month.
   * @param months Months where the new month is.
   */
  private changeMonth(monthNumber: number, months: Month[]): Month {
    const month = months[monthNumber];
    this._monthSnapshot = month;

    return month;
  }

  /**
   * Changes the current day by number.
   * @param dayNumber Day number.
   * @param days Days where the new day is.
   */
  private changeDay(dayNumber: number, days: Day[]): Day {
    const candidateDays = days.filter(day => day.dayNumber === dayNumber);

    let day: Day;
    if (candidateDays.length > 0) {
      day = candidateDays[0];
    } else {
      day = days[days.length - 1];
    }

    this._daySnapshot = day;
    return day;
  }

  /**
   * Changes the current week by day.
   * @param day Day included in the new week.
   * @param month Month where the new weeks is.
   */
  private changeWeek(day: Day, month: Month): Week {
    const week = month.weeks.filter(week => week.days.indexOf(day) > -1)[0];
    this._weekSnapshot = week;

    return week;
  }

  /**
   * Emits a change in the state.
   */
  private emitChange(): StateChanged {
    const newState: StateChanged = {
      year: this._yearSnapshot,
      month: this._monthSnapshot,
      week: this._weekSnapshot,
      day: this._daySnapshot
    };

    this._changeSubject.next(newState);
    return newState;
  }
}
