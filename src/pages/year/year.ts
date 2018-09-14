import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Year } from '../../models/time/year';
import { Subscription } from 'rxjs';
import { Month } from '../../models/time/month';

/**
 * Shows info about the specified year.
 */
@IonicPage()
@Component({
  selector: 'page-year',
  templateUrl: 'year.html',
})
export class YearPage {

  /**
   * Year to show.
   */
  year: Year;

  private changeSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(change => (this.year = change.year));
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Go to the month page.
   * @param month Month to show.
   */
  showMonth(month: Month): void {

  }

}
