import { Component, ViewChild } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { create2dArray } from '../../models/array/array-extensions';
import { CssVariables } from '../../models/css/CssVariables';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { Year } from '../../models/time/year';
import { StateProvider } from '../../providers/state/state';
import { DayOfWeek, DAYS_OF_WEEK } from '../../text-items/days-of-week';

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
    this.state.setMonth(month).subscribe(_ => this.navCtrl.push('MonthPage'));
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
    return month.name;
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
   * Gets the corresponding background color
   * of the specified day calculated based on
   * its worked time.
   * @param day Day.
   */
  getDayBackgroundColor(day: Day): string {
    const timeAsPercent = day.getTotalTimeAsPercent();
    const opacity = Math.floor((timeAsPercent / 100) * 255);
    const opacityAsHex = opacity.toString(16);
    const backgroundColor = CssVariables.workingTimeColor + opacityAsHex;

    return backgroundColor;
  }
}
