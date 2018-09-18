import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { StateProvider } from '../../providers/state/state';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { DAYS_OF_WEEK, DayOfWeek } from '../../text-items/days-of-week';

/**
 * Shows info about the specified month.
 */
@IonicPage()
@Component({
  selector: 'page-month',
  templateUrl: 'month.html'
})
export class MonthPage {
  @ViewChild('previousNext')
  previousNext: PreviousNextComponent;

  /**
   * Month to show.
   */
  month: Month;

  private changeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(
      change => (this.month = change.month)
    );
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Go to the day page.
   * @param day Day to show.
   */
  showDay(day: Day): void {
    this.state.setDay(day).subscribe(_ => this.navCtrl.push('DayPage'));
  }

  /**
   * Sets the previous month.
   */
  setPrevious(): void {
    this.state.setPreviousMonth().subscribe(change => {
      this.month = change.month;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next year.
   */
  setNext(): void {
    this.state.setNextMonth().subscribe(change => {
      this.month = change.month;
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
   */
  getMonthName(): string {
    return `${this.month.name} ${this.month.yearNumber}`;
  }

  /**
   * Checks if the actual month is the current month.
   */
  isThisMonth(): boolean {
    return this.state.isThisMonth(this.month);
  }

  /**
   * Checks if the day specified is the current day.
   * @param day Day to check.
   */
  isToday(day: Day): boolean {
    return this.state.isToday(day);
  }

  /**
   * Checks if the day specified is the day
   * selected by the user.
   * @param day Day to check.
   */
  isSelectedDay(day: Day): boolean {
    return this.state.isSelectedDay(day);
  }
}
