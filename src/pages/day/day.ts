import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Day } from '../../models/time/day';
import { StateProvider } from '../../providers/state/state';
import { Subscription } from 'rxjs';

/**
 * Shows info about the specified day.
 */
@IonicPage()
@Component({
  selector: 'page-day',
  templateUrl: 'day.html'
})
export class DayPage {
  /**
   * Day to show.
   */
  day: Day;

  private daySubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private state: StateProvider
  ) {}

  ionViewWillLoad() {
    this.daySubscription = this.state.day$.subscribe(day => (this.day = day));
  }

  ionViewWillUnload() {
    this.daySubscription.unsubscribe();
  }
}
