import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { ExportProvider } from '../../providers/export/export';
import { StateProvider } from '../../providers/state/state';
import { FormatterFactory } from '../../models/formatters/formatter-factory';

/**
 * Popover to export and navigate to date.
 */
@IonicPage()
@Component({
  selector: 'page-time-popover',
  templateUrl: 'time-popover.html'
})
export class TimePopoverPage {
  /**
   * Selected date to show.
   */
  private _dateToGo: Date;
  get dateToGo(): string {
    return moment(this._dateToGo).format();
  }

  set dateToGo(isoDate: string) {
    this._dateToGo = new Date(Date.parse(isoDate));
    this.state.setByDate(this._dateToGo);
  }

  constructor(
    private navParams: NavParams,
    private exportProvider: ExportProvider,
    private state: StateProvider
  ) {
    this._dateToGo = this.state.daySnapshot.asDate;
  }

  /**
   * Exports the data to excel.
   */
  exportToExcel(): void {
    const json = this.getJson();

    this.exportProvider
      .sendExcelThroughEmail('mock-data', json);
  }

  /**
   * Gets the json that will be used to generate
   * the Excel file.
   */
  private getJson(): any[] {
    const factory = new FormatterFactory();
    const entity = this.navParams.data;
    const formatter = factory.createFormatter(entity);
    const json = formatter.format();

    return json;
  }
}
