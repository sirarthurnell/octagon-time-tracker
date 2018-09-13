import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Day } from '../../models/time/day';
import { Subscription } from 'rxjs';

/**
 * Current day page.
 */
@IonicPage()
@Component({
  selector: 'page-current-day',
  templateUrl: 'current-day.html'
})
export class CurrentDayPage {
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
