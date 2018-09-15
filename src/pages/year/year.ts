import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Year } from '../../models/time/year';
import { Subscription } from 'rxjs';
import { Month } from '../../models/time/month';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { create2dArray } from '../../models/array/array-extensions';

/**
 * Shows info about the specified year.
 */
@IonicPage()
@Component({
  selector: 'page-year',
  templateUrl: 'year.html'
})
export class YearPage {
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
   * Gets the name of the days.
   */
  getDaysOfWeek(): { name: string; type: string }[] {
    return [
      { name: 'S', type: 'sunday' },
      { name: 'M', type: 'normal' },
      { name: 'T', type: 'normal' },
      { name: 'W', type: 'normal' },
      { name: 'T', type: 'normal' },
      { name: 'F', type: 'normal' },
      { name: 'S', type: 'saturday' }
    ];
  }

  /**
   * Gets the name of the month.
   * @param month Month.
   */
  getMonthName(month: Month): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return monthNames[month.monthNumber];
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
}
