import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { Checking, CheckingDirection } from '../../models/time/checking';
import * as moment from 'moment';

/**
 * Create and edit checking page.
 */
@IonicPage()
@Component({
  selector: 'page-checking',
  templateUrl: 'checking.html'
})
export class CheckingPage {
  title = 'Checking';

  checking: Checking;

  /**
   * For model transformation.
   */
  get selectedDate(): string {
    return moment(this.checking.dateTime).format();
  }

  set selectedDate(isoDate: string) {
    this.checking.dateTime = new Date(Date.parse(isoDate));
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
    const fromParams: Checking = this.navParams.get('edit-checking');

    if (fromParams) {

      this.checking = fromParams.clone();
      this.title = 'Editing: ' + this.checking.toString();

    } else {

      this.checking = new Checking(new Date(), CheckingDirection.In);
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
