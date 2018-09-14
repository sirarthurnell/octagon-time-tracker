import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Day } from '../../models/time/day';
import { Month } from '../../models/time/month';
import { StateProvider } from '../../providers/state/state';

/**
 * Shows info about the specified month.
 */
@IonicPage()
@Component({
  selector: 'page-month',
  templateUrl: 'month.html',
})
export class MonthPage {

  /**
   * Month to show.
   */
  month: Month;

  private changeSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(change => (this.month = change.month));
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Go to the week page.
   * @param day Day of the week to show.
   */
  showWeek(day: Day): void {
    this.state
      .setWeek(day)
      .subscribe(_ => this.navCtrl.setRoot('WeekPage'));
  }
}
