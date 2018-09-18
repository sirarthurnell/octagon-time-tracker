import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Day } from '../../models/time/day';
import { StateProvider } from '../../providers/state/state';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';

/**
 * Shows info about the specified day.
 */
@IonicPage()
@Component({
  selector: 'page-day',
  templateUrl: 'day.html'
})
export class DayPage {
  @ViewChild('previousNext')
  previousNext: PreviousNextComponent;

  /**
   * Day to show.
   */
  day: Day;

  private changeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(
      change => (this.day = change.day)
    );
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

    /**
   * Sets the previous day.
   */
  setPrevious(): void {
    this.state.setPreviousDay().subscribe(change => {
      this.day = change.day;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next day.
   */
  setNext(): void {
    this.state.setNextDay().subscribe(change => {
      this.day = change.day;
      this.previousNext.animateNext();
    });
  }

  /**
   * Gets the text to display on previous next.
   */
  getDayText(): string {
    return `${this.day.name} - ${this.day.asDate.toLocaleDateString()}`;
  }

  /**
   * Checks if the current day is today.
   */
  isToday(): boolean {
    return this.state.isToday(this.day);
  }
}
