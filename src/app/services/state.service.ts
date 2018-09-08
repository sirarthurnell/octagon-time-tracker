import { Injectable } from '@angular/core';
import { Year } from '../models/time/year';
import { Month } from '../models/time/month';
import { Day } from '../models/time/day';
import { Week } from '../models/time/week';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  /**
   * Gets the current year.
   */
  private _year: Year;
  get year(): Year {
    return this._year;
  }

  /**
   * Gets the current month.
   */
  private _month: Month;
  get month(): Month {
    return this._month;
  }

  /**
   * Gets the current week.
   */
  private _week: Week;
  get week(): Week {
    return this._week;
  }

  /**
   * Gets the current day.
   */
  private _day: Day;
  get day(): Day {
    return this._day;
  }

  constructor() { }

  /**
   * Sets the current state.
   * @param year Current year.
   * @param month Current month.
   * @param week Current week.
   * @param day Current day.
   */
  setCurrent(year: Year, month?: Month, week?: Week, day?: Day): void {
    this._year = year;
    this._month = month;
    this._week = week;
    this._day = day;
  }
}