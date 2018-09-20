import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { Day } from '../../models/time/day';
import { Week } from '../../models/time/week';
import { StateProvider } from '../../providers/state/state';
import { DayOfWeek, DAYS_OF_WEEK } from '../../text-items/days-of-week';

/**
 * Shows info about the specified week.
 */
@IonicPage()
@Component({
  selector: 'page-week',
  templateUrl: 'week.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    public popoverCtrl: PopoverController,
    private cd: ChangeDetectorRef,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(change => {
      this.week = change.week;
      this.cd.detectChanges();
    });
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

  /**
   * Shows the navigation popover.
   * @param event Event originated by the clicked
   * control.
   */
  showPopover(event): void {
    const popover = this.popoverCtrl.create('TimePopoverPage', this.week);
    popover.present({
      ev: event
    });
  }
}
