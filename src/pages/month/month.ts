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

  private monthSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {}

  ionViewWillLoad() {
    this.monthSubscription = this.state.month$.subscribe(month => (this.month = month));
  }

  ionViewWillUnload() {
    this.monthSubscription.unsubscribe();
  }

}
