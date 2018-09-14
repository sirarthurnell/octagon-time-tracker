import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Month } from '../../models/time/month';
import { StateProvider } from '../../providers/state/state';
import { Subscription } from 'rxjs';

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

}
