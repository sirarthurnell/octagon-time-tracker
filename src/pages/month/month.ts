import { ChangeDetectorRef, Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { CssVariables } from '../../models/css/CssVariables';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { StateProvider } from '../../providers/state/state';
import { DayOfWeek, DAYS_OF_WEEK } from '../../text-items/days-of-week';

/**
 * Shows info about the specified month.
 */
@IonicPage()
@Component({
  selector: 'page-month',
  templateUrl: 'month.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    public popoverCtrl: PopoverController,
    private cd: ChangeDetectorRef,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(change => {
      this.month = change.month;
      this.cd.detectChanges();
    });
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
   * Sets and shows today.
   */
  showToday(): void {
    this.state.setToday();
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
   * Checks if the day specified is the day
   * selected by the user.
   * @param day Day to check.
   */
  isSelectedDay(day: Day): boolean {
    return this.state.isSelectedDay(day);
  }

  /**
   * Gets the corresponding background color
   * of the specified day calculated based on
   * its worked time.
   * @param day Day.
   */
  getDayBackgroundGradient(day: Day): string {
    const timeAsPercent = day.getTotalTimeAsPercent();
    const height = Math.floor(timeAsPercent);
    const gradient = `linear-gradient(to top, ${
      CssVariables.workingTimeColor
    } ${height}%, transparent ${height}%, transparent 100%)`;

    return gradient;
  }

  /**
   * Shows the navigation popover.
   * @param event Event originated by the clicked
   * control.
   */
  showPopover(event): void {
    const popover = this.popoverCtrl.create('TimePopoverPage', this.month);
    popover.present({
      ev: event
    });
  }
}
