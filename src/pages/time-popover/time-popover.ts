import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ViewController,
  AlertController
} from 'ionic-angular';
import * as moment from 'moment';
import { ExportProvider } from '../../providers/export/export';
import { StateProvider } from '../../providers/state/state';
import { FormatterFactory } from '../../models/formatters/formatter-factory';
import { Day } from '../../models/time/day';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';

/**
 * Popover to export and navigate to date.
 */
@IonicPage()
@Component({
  selector: 'page-time-popover',
  templateUrl: 'time-popover.html'
})
export class TimePopoverPage {
  private entity: any;

  /**
   * Checks if the entity passed is a day.
   */
  isDay: boolean;

  /**
   * Selected date to show.
   */
  private _dateToGo: Date;
  get dateToGo(): string {
    return moment(this._dateToGo).format();
  }

  set dateToGo(isoDate: string) {
    this._dateToGo = new Date(Date.parse(isoDate));
    this.state
      .setByDate(this._dateToGo)
      .take(1)
      .subscribe(_ => this.close());
  }

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private exportProvider: ExportProvider,
    private storage: TimeStorageProvider,
    private state: StateProvider
  ) {
    this._dateToGo = this.state.daySnapshot.asDate;
    this.entity = this.navParams.data;
    this.isDay = this.entity instanceof Day;
  }

  /**
   * Exports the data to excel.
   */
  exportToExcel(): void {
    const json = this.getJson();

    this.exportProvider.sendExcelThroughEmail('mock-data', json);

    this.close();
  }

  /**
   * Deletes all the checkings of the day
   * if the user accepts.
   */
  deleteAllCheckings(): void {
    const confirm = this.alertCtrl.create({
      title: 'Delete all checkings?',
      message: 'All checkings of this day will be removed. Are you sure?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Delete',
          handler: () => this.deleteAll()
        }
      ]
    });

    confirm.present();
  }

  /**
   * Deletes all the checkings.
   */
  private deleteAll(): void {
    const day = this.entity as Day;
    const checkings = day.checkings;
    checkings.splice(0, checkings.length);
    day
      .save(this.storage)
      .take(1)
      .subscribe(_ => this.close());
  }

  /**
   * Gets the json that will be used to generate
   * the Excel file.
   */
  private getJson(): any[] {
    const factory = new FormatterFactory();
    const formatter = factory.createFormatter(this.entity);
    const json = formatter.format();

    return json;
  }

  /**
   * Closes the popover.
   */
  private close(): void {
    this.viewCtrl.dismiss();
  }
}
