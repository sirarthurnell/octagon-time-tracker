import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StateProvider } from '../../providers/state/state';
import { Day } from '../../models/time/day';
import { Subscription } from 'rxjs';
import { TimeGaugeComponent } from '../../components/time-gauge/time-gauge.component';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { Checking, CheckingDirection } from '../../models/time/checking';
import { getLast } from '../../models/array/array-extensions';

/**
 * Current day page.
 */
@IonicPage()
@Component({
  selector: 'page-current-day',
  templateUrl: 'current-day.html'
})
export class CurrentDayPage {
  @ViewChild('gauge')
  gauge: TimeGaugeComponent;

  /**
   * Day to show.
   */
  day: Day;

  checkInButtonEnabled = true;
  checkOutButtonEnabled = false;

  private changeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private state: StateProvider,
    private storage: TimeStorageProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(change => {
      this.day = change.day;
      if (this.day) {

        if(!change.day.isToday()) {
          this.state.setToday().take(1).subscribe();
        } else {
          this.manageButtonsState();
        }

      }
    });
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Manages the enabled/disabled state
   * of the buttons.
   */
  manageButtonsState(): void {
    const mostRecentChecking = getLast(this.day.getAdjustedCheckings());

    if (mostRecentChecking) {
      this.checkInButtonEnabled =
        mostRecentChecking.direction === CheckingDirection.Out;
      this.checkOutButtonEnabled = !!!this.checkInButtonEnabled;
    }
  }

  /**
   * Performs a check IN.
   */
  checkIn(): void {
    this.gauge.allowCountingMode = true;
    this.persistNewChecking(CheckingDirection.In);
  }

  /**
   * Performs a check OUT.
   */
  checkOut(): void {
    this.persistNewChecking(CheckingDirection.Out);
  }

  /**
   * Creates and saves a new checking.
   * @param direction Direction of the new checking.
   */
  private persistNewChecking(direction: CheckingDirection): void {
    const newChecking = new Checking(new Date(), direction);
    this.day.checkings.push(newChecking);
    this.day.save(this.storage);

    this.manageButtonsState();
    this.refreshGauge();
  }

  /**
   * Refreshes the gauge.
   */
  private refreshGauge(): void {
    this.gauge.refresh();
  }
}
