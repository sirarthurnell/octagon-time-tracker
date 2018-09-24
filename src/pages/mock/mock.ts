import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { fillOneYear, ONE_MONTH_ONE_CHECKING } from '../../mock/mock-data';
import { StorableMonth } from '../../models/storage/storable-month';
import { DateOperations } from '../../models/time/date-operations';
import { DayOfWeek } from '../../models/time/day-of-week';
import { Month } from '../../models/time/month';
import { Week } from '../../models/time/week';
import { Year } from '../../models/time/year';
import { ExportProvider } from '../../providers/export/export';
import { TimeStorageProvider } from '../../providers/time-storage/time-storage';
import { getLocalizedFirstDayOfWeek, getLocalizedShortDateFormat, getLocalizedTimeFormat } from '../../text-items/date-time-formats';

@IonicPage()
@Component({
  selector: 'page-mock',
  templateUrl: 'mock.html'
})
export class MockPage {
  private readonly MONTHS_IN_YEAR = 12;

  year: Year;
  storableMonths: StorableMonth[] = [];
  weeks: Week[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private timeStorageProvider: TimeStorageProvider,
    private exportProvider: ExportProvider
  ) {}

  ionViewDidLoad() {
    this.showOneMonth();
    this.showOneYear();
  }

  /**
   * Shows data about one year.
   */
  private showOneYear(): void {
    Year.getYear(this.timeStorageProvider, 2018).subscribe(year => {
      this.year = year;
      this.storableMonths = this.year.months.map(month =>
        StorableMonth.toStorable(month)
      );
      this.weeks = this.year.months[0].weeks;
    });
  }

  /**
   * Shows data about one month.
   */
  private showOneMonth(): void {
    this.saveData(ONE_MONTH_ONE_CHECKING).subscribe(_ =>
      this.recoverData(2018).subscribe(months => {
        this.weeks = months.length > 0 ? months[0].weeks : [];
      })
    );
  }

  /**
   * Saves mock data.
   */
  private saveData(months: Month[]): Observable<any> {
    const savedMonths: Observable<any>[] = [];

    for (const month of months) {
      savedMonths.push(this.timeStorageProvider.saveMonth(month));
    }

    return forkJoin(savedMonths);
  }

  /**
   * Recovers the data corresponding to a year
   * as an array of months.
   * @param year Year to recover.
   */
  private recoverData(year: number): Observable<Month[]> {
    const months: Observable<Month>[] = [];

    for (let i = 0; i < this.MONTHS_IN_YEAR; i++) {
      months.push(this.timeStorageProvider.getMonth(2018, i));
    }

    const months$ = forkJoin(months);
    return months$;
  }

  /**
   * Export data to an Excel file.
   */
  exportToExcel(): void {
    this.exportProvider.exportToExcelFile('mock-data', this.getExportData());
  }

  /**
   * Sends the exported data by email.
   */
  sendEmail(): void {
    this.exportProvider.sendExcelThroughEmail(
      'mock-data',
      this.getExportData()
    );
  }

  /**
   * Gets some data to export.
   */
  private getExportData(): any[] {
    const json: any = [
      {
        eid: 'e101',
        ename: 'ravi',
        esal: 1000
      },
      {
        eid: 'e102',
        ename: 'ram',
        esal: 2000
      },
      {
        eid: 'e103',
        ename: 'rajesh',
        esal: 3000
      }
    ];

    return json;
  }

  /**
   * Gets the time format to apply.
   */
  getTimeFormat(): string {
    return getLocalizedTimeFormat();
  }

  /**
   * Gets the short date format to apply.
   */
  getDateFormat(): string {
    return getLocalizedShortDateFormat();
  }

  /**
   * Gets the localized first day of the week.
   */
  getFirstOfWeek(): number {
    return getLocalizedFirstDayOfWeek();
  }

  /**
   * Tests date operations.
   */
  checkDateOperation(): void {
    const count = DateOperations.weeksInMonth(2010, 1, DayOfWeek.Monday);
    console.log(count);
  }

  /**
   * Fills and saves one year with data.
   */
  fillYear(): void {
    const year = 2017;
    const loader = this.loadingCtrl.create({
      content: 'Please wait...',
      showBackdrop: false
    });

    loader.present().then(() => {
      fillOneYear(this.timeStorageProvider, year)
        .take(1)
        .subscribe(_ => loader.dismiss());
    });
  }
}
