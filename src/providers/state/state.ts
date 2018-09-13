import { Injectable } from '@angular/core';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { Week } from '../../models/time/week';
import { Year } from '../../models/time/year';

/**
 * Keeps the current state of the application.
 */
@Injectable()
export class StateProvider {
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

    console.log('State changed', {
      year,
      month,
      week,
      day
    });
  }

}
