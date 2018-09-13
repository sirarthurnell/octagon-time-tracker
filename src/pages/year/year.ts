import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Year } from '../../models/time/year';
import { Subscription } from 'rxjs';

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

  private yearSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {}

  ionViewWillLoad() {
    this.yearSubscription = this.state.year$.subscribe(year => (this.year = year));
  }

  ionViewWillUnload() {
    this.yearSubscription.unsubscribe();
  }

}
