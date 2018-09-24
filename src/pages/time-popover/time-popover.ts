import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';
import * as moment from 'moment';
import { FormatterFactory } from '../../models/formatters/formatter-factory';
import { Day } from '../../models/time/day';
import { ExportProvider } from '../../providers/export/export';
import { StateProvider } from '../../providers/state/state';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { TimeNames } from '../../text-items/time-names';
import { getLocalizedShortDateFormat } from '../../text-items/date-time-formats';
import { TranslateService } from '@ngx-translate/core';

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
  readonly monthNames: string[];
  readonly displayFormat = getLocalizedShortDateFormat();

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
    private translate: TranslateService,
    private exportProvider: ExportProvider,
    private storage: TimeStorageProvider,
    private state: StateProvider
  ) {
    this._dateToGo = this.state.daySnapshot.asDate;
    this.entity = this.navParams.data;
    this.isDay = this.entity instanceof Day;
    this.monthNames = TimeNames.getMonthNames(true);
  }

  /**
   * Exports the data to excel.
   */
  exportToExcel(): void {
    const json = this.getJson();

    this.exportProvider.export('exported-data', json);

    this.close();
  }

  /**
   * Deletes all the checkings of the day
   * if the user accepts.
   */
  deleteAllCheckings(): void {
    this.translate
      .get([
        'TIME_POPOVER.DELETE_ALL_CONFIRM.TITLE',
        'TIME_POPOVER.DELETE_ALL_CONFIRM.MESSAGE',
        'TIME_POPOVER.DELETE_ALL_CONFIRM.NO',
        'TIME_POPOVER.DELETE_ALL_CONFIRM.DELETE'
      ])
      .take(1)
      .subscribe(translations => {
        const confirm = this.alertCtrl.create({
          title: translations['TIME_POPOVER.DELETE_ALL_CONFIRM.TITLE'],
          message: translations['TIME_POPOVER.DELETE_ALL_CONFIRM.MESSAGE'],
          buttons: [
            {
              text: translations['TIME_POPOVER.DELETE_ALL_CONFIRM.NO'],
              handler: () => this.close()
            },
            {
              text: translations['TIME_POPOVER.DELETE_ALL_CONFIRM.DELETE'],
              handler: () => this.deleteAll()
            }
          ]
        });

        confirm.present();
      });
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
