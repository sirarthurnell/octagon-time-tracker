import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { Checking, CheckingDirection } from '../../models/time/checking';
import * as moment from 'moment';
import { Day } from '../../models/time/day';
import { SHORT_TIME_FORMAT } from '../../text-items/date-time-formats';

/**
 * Create and edit checking page.
 */
@IonicPage()
@Component({
  selector: 'page-checking',
  templateUrl: 'checking-modal.html'
})
export class CheckingModalPage {
  readonly timeFormat = SHORT_TIME_FORMAT;

  title = 'Checking';

  checking: Checking;
  day: Day;

  /**
   * For model transformation.
   */
  get selectedDate(): string {
    return moment(this.checking.dateTime).format();
  }

  set selectedDate(isoDate: string) {
    const date = new Date(Date.parse(isoDate));
    this.checking.dateTime = date;
  }

  /**
   * For model transformation.
   */
  readonly directionIn = CheckingDirection.In;
  readonly directionOut = CheckingDirection.Out;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    const checkingFromParams: Checking = this.navParams.get('edit-checking');
    this.day = this.navParams.get('day');

    if (checkingFromParams) {
      this.checking = checkingFromParams.clone();
      this.title = 'Editing: ' + this.checking.toString();
    } else {
      const newDate = new Date();
      newDate.setFullYear(this.day.yearNumber);
      newDate.setMonth(this.day.monthNumber);
      newDate.setDate(this.day.dayNumber);
      this.checking = new Checking(newDate, CheckingDirection.In);
      this.title = 'New checking';
    }
  }

  /**
   * Closes the modal without action.
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Accept the changes.
   */
  accept() {
    this.viewCtrl.dismiss(this.checking);
  }
}
