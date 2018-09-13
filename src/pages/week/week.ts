import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Week } from '../../models/time/week';

/**
 * Shows info about the specified week.
 */
@IonicPage()
@Component({
  selector: 'page-week',
  templateUrl: 'week.html',
})
export class WeekPage {

  /**
   * Week to show.
   */
  week: Week;

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {
    this.week = state.week;
  }

}
