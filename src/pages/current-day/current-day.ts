import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Day } from '../../models/time/day';

/**
 * Current day page.
 */
@IonicPage()
@Component({
  selector: 'page-current-day',
  templateUrl: 'current-day.html',
})
export class CurrentDayPage {
  /**
   * Day to show.
   */
  day: Day;

  constructor(public navCtrl: NavController, public navParams: NavParams, state: StateProvider) {
    this.day = state.day;
  }

}
