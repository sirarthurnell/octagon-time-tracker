import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Year } from '../../models/time/year';
import { Subscription } from 'rxjs';
import { Month } from '../../models/time/month';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { create2dArray } from '../../models/array/array-extensions';
import { DAYS_OF_WEEK, DayOfWeek } from '../../text-items/days-of-week';
import { MONTH_NAMES } from '../../text-items/months';
import { Day } from '../../models/time/day';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';

/**
 * Shows info about the specified year.
 */
@IonicPage()
@Component({
  selector: 'page-year',
  templateUrl: 'year.html'
})
export class YearPage {
  @ViewChild('previousNext')
  previousNext: PreviousNextComponent;

  /**
   * Year to show.
   */
  year: Year;

  private changeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(
      change => (this.year = change.year)
    );
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Go to the month page.
   * @param month Month to show.
   */
  showMonth(month: Month): void {
    this.state
      .setMonth(month)
      .subscribe(_ => this.navCtrl.setRoot('MonthPage'));
  }

  /**
   * Sets the previous year.
   */
  setPrevious(): void {
    this.state.setPreviousYear().subscribe(change => {
      this.year = change.year;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next year.
   */
  setNext(): void {
    this.state.setNextYear().subscribe(change => {
      this.year = change.year;
      this.previousNext.animateNext();
    });
  }

  /**
   * Gets the name of the days.
   */
  getDaysOfWeek(): DayOfWeek[] {
    return DAYS_OF_WEEK;
  }

  /**
   * Gets the name of the month.
   * @param month Month.
   */
  getMonthName(month: Month): string {
    return MONTH_NAMES[month.monthNumber];
  }

  /**
   * Gets the months of the year distributed
   * in rows.
   */
  getRowsOfMonths(): Month[][] {
    let monthRows: Month[][];
    let monthsPerRow: number;

    if (this.screenOrientation.type.indexOf('portrait') > -1) {
      monthsPerRow = 3;
    } else {
      monthsPerRow = 6;
    }

    monthRows = create2dArray<Month>(this.year.months.length / monthsPerRow);

    for (let i = 0; i < this.year.months.length; i++) {
      const currentMonth = this.year.months[i];
      monthRows[Math.floor(i / monthsPerRow)].push(currentMonth);
    }

    return monthRows;
  }

  /**
   * Checks if the day specified is the day
   * selected by the user.
   * @param day Day to check.
   */
  isSelectedDay(day: Day): boolean {
    return this.state.isSelectedDay(day);
  }

  /**
   * Checks if the day specified is the current day.
   * @param day Day to check.
   */
  isToday(day: Day): boolean {
    return this.state.isToday(day);
  }

  /**
   * Checks if the month specified is the current month.
   * @param month Month to check.
   */
  isThisMonth(month: Month): boolean {
    return this.state.isThisMonth(month);
  }

  /**
   * Checks if the year specified is the current year.
   * @param year Year to check.
   */
  isThisYear(year: Year): boolean {
    return this.state.isThisYear(year);
  }
}
