import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {
    this.month = state.month;
  }

}
