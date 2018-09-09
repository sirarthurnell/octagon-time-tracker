import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ONE_MONTH_EMPTY, TWO_MONTHS_TWO_CHECKINGS, ONE_MONTH_ONE_CHECKING } from '../../mock/mock-data';
import { Month } from '../../models/time/month';
import { TimeStorageService } from '../../services/time-storage.service';
import { Week } from '../../models/time/week';
import { Year } from '../../models/time/year';
import { StorableMonth } from '../../models/storage/storable-month';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.page.html',
  styleUrls: ['./mock.page.scss']
})
export class MockPage implements OnInit {
  private readonly MONTHS_IN_YEAR = 12;

  year: Year;
  storableMonths: StorableMonth[] = [];
  weeks: Week[] = [];

  constructor(private timeStorageService: TimeStorageService) {}

  ngOnInit() {
    this.showOneMonth();
    this.showOneYear();
  }

  /**
   * Shows data about one year.
   */
  private showOneYear(): void {
    Year.getYear(this.timeStorageService, 2018).subscribe(year => {
      this.year = year;
      this.storableMonths = this.year.months.map(month => StorableMonth.toStorable(month));
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
      savedMonths.push(this.timeStorageService.saveMonth(month));
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
      months.push(this.timeStorageService.getMonth(2018, i));
    }

    const months$ = forkJoin(months);
    return months$;
  }
}
