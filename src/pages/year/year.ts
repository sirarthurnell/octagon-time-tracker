import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Year } from '../../models/time/year';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private state: StateProvider) {
    this.year = this.state.year;
  }

}
