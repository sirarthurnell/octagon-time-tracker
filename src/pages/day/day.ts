import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, ItemSliding, ModalController, PopoverController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { TimeGaugeComponent } from '../../components/time-gauge/time-gauge.component';
import { Checking, CheckingDirection } from '../../models/time/checking';
import { Day } from '../../models/time/day';
import { StateProvider } from '../../providers/state/state';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { getLocale } from '../../text-items/date-time-formats';

/**
 * Shows info about the specified day.
 */
@IonicPage()
@Component({
  selector: 'page-day',
  templateUrl: 'day.html'
})
export class DayPage {
  @ViewChild('previousNext')
  previousNext: PreviousNextComponent;
  @ViewChild('gauge')
  gauge: TimeGaugeComponent;

  /**
   * Day to show.
   */
  day: Day;

  private changeSubscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private translate: TranslateService,
    private state: StateProvider,
    private storage: TimeStorageProvider
  ) {}

  ionViewWillEnter() {
    this.changeSubscription = this.state.change$.subscribe(change => {
      this.day = change.day;
    });
  }

  ionViewWillLeave() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Sets the previous day.
   */
  setPrevious(): void {
    this.state.setPreviousDay().subscribe(change => {
      this.day = change.day;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next day.
   */
  setNext(): void {
    this.state.setNextDay().subscribe(change => {
      this.day = change.day;
      this.previousNext.animateNext();
    });
  }

  /**
   * Sets and shows today.
   */
  showToday(): void {
    this.state.setToday();
  }

  /**
   * Gets the text to display on previous next.
   */
  getDayText(): string {
    return moment(this.day.asDate)
      .locale(getLocale())
      .format('ddd[,] LL');
  }

  /**
   * Checks if the current day is today.
   */
  isToday(): boolean {
    return this.state.isToday(this.day);
  }

  /**
   * Checks if the specified checking is IN.
   * @param checking Checking.
   */
  isCheckingIn(checking: Checking): boolean {
    return checking.direction === CheckingDirection.In;
  }

  /**
   * Deletes the specified checking.
   * @param checkingToDelete Checking to delete.
   */
  deleteChecking(slidingItem: ItemSliding, checkingToDelete: Checking): void {
    const index = this.day.checkings.indexOf(checkingToDelete);
    this.day.checkings.splice(index, 1);

    this.persist();

    this.refreshGauge();
    this.showUndoToast(checkingToDelete, index);
  }

  /**
   * Shows a undo message to the user.
   * @param deletedChecking Deleted checking.
   * @param deletedCheckingIndex Deleted checking index.
   */
  private showUndoToast(
    deletedChecking: Checking,
    deletedCheckingIndex: number
  ): void {
    this.translate
      .get(['DAY.CHECKIN_DELETED', 'DAY.UNDO'])
      .take(1)
      .subscribe(translations => {
        let toast = this.toastCtrl.create({
          message: translations['DAY.CHECKIN_DELETED'],
          duration: 5000,
          showCloseButton: true,
          closeButtonText: translations['DAY.UNDO']
        });

        toast.onDidDismiss((data, role) => {
          if (role === 'close') {
            this.day.checkings.splice(deletedCheckingIndex, 0, deletedChecking);
            this.refreshGauge();
          }

          this.persist();
        });

        toast.present();
      });
  }

  /**
   * Adds a new checking.
   */
  addChecking(): void {
    const checkingPage = this.modalCtrl.create('CheckingModalPage', {
      day: this.day
    });
    checkingPage.onDidDismiss(newChecking => {
      if (newChecking) {
        this.day.checkings.push(newChecking as Checking);

        this.persist();
        this.refreshGauge();
      }
    });

    checkingPage.present();
  }

  /**
   * Edits the specified checking.
   * @param checkingToEdit Checking to edit.
   */
  editChecking(slidingItem: ItemSliding, checkingToEdit: Checking): void {
    const checkingPage = this.modalCtrl.create('CheckingModalPage', {
      'edit-checking': checkingToEdit,
      day: this.day
    });
    checkingPage.onDidDismiss(checking => {
      if (checking) {
        checkingToEdit.dateTime = (checking as Checking).dateTime;
        checkingToEdit.direction = (checking as Checking).direction;

        this.persist();
        this.refreshGauge();
      }

      slidingItem.close();
    });

    checkingPage.present();
  }

  /**
   * Refreshes the gauge if it's present already.
   */
  private refreshGauge(): void {
    if (this.gauge) {
      this.gauge.refresh();
    }
  }

  /**
   * Persists data.
   */
  private persist(): void {
    this.day.save(this.storage);
  }

  /**
   * Shows the navigation popover.
   * @param event Event originated by the clicked
   * control.
   */
  showPopover(event): void {
    const popover = this.popoverCtrl.create('TimePopoverPage', this.day);
    popover.present({
      ev: event
    });
    popover.onDidDismiss(() => this.refreshGauge());
  }
}
