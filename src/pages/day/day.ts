import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  ItemSliding,
  ModalController,
  NavController,
  NavParams,
  ToastController,
  PopoverController
} from 'ionic-angular';
import { Subscription } from 'rxjs';
import { PreviousNextComponent } from '../../components/previous-next/previous-next';
import { TimeGaugeComponent } from '../../components/time-gauge/time-gauge.component';
import { Checking, CheckingDirection } from '../../models/time/checking';
import { Day } from '../../models/time/day';
import { StateProvider } from '../../providers/state/state';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private state: StateProvider,
    private storage: TimeStorageProvider
  ) {}

  ionViewWillLoad() {
    this.changeSubscription = this.state.change$.subscribe(
      change => (this.day = change.day)
    );
  }

  ionViewWillUnload() {
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
    return `${this.day.name} - ${this.day.asDate.toLocaleDateString()}`;
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

    this.gauge.refresh();
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
    let toast = this.toastCtrl.create({
      message: 'Checking deleted',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Undo'
    });

    toast.onDidDismiss((data, role) => {
      if (role === 'close') {
        this.day.checkings.splice(deletedCheckingIndex, 0, deletedChecking);
        this.gauge.refresh();
      }

      this.persist();
    });

    toast.present();
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
        this.gauge.refresh();
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
        this.gauge.refresh();
      }

      slidingItem.close();
    });

    checkingPage.present();
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
    popover.onDidDismiss(() => this.gauge.refresh());
  }
}
