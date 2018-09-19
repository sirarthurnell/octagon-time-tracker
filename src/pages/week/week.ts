import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Week } from '../../models/time/week';
import { Subscription } from 'rxjs';
import { Day } from '../../models/time/day';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { DayOfWeek, DAYS_OF_WEEK } from '../../text-items/days-of-week';

/**
 * Shows info about the specified week.
 */
@IonicPage()
@Component({
  selector: 'page-week',
  templateUrl: 'week.html'
})
export class WeekPage {
  @ViewChild('previousNext')
  previousNext: PreviousNextComponent;

  /**
   * Week to show.
   */
  week: Week;

  private changeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(
      change => (this.week = change.week)
    );
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Sets the previous week.
   */
  setPrevious(): void {
    this.state.setPreviousWeek().subscribe(change => {
      this.week = change.week;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next week.
   */
  setNext(): void {
    this.state.setNextWeek().subscribe(change => {
      this.week = change.week;
      this.previousNext.animateNext();
    });
  }

  /**
   * Go to the day page.
   * @param day Day to show.
   */
  showDay(day: Day): void {
    this.state.setDay(day).subscribe(_ => this.navCtrl.push('DayPage'));
  }

  /**
   * Sets and shows today.
   */
  showToday(): void {
    this.state.setToday();
  }

  /**
   * Gets the days of the week.
   */
  getDaysOfWeek(): DayOfWeek[] {
    return DAYS_OF_WEEK;
  }

  /**
   * Checks if the actual week is the current week.
   */
  isThisWeek(): boolean {
    return this.state.isThisWeek(this.week);
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
