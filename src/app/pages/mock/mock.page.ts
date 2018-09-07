import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { TWO_MONTHS_TWO_CHECKINGS } from '../../mock/mock-data';
import { Month } from '../../models/time/month';
import { TimeStorageService } from '../../services/time-storage.service';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.page.html',
  styleUrls: ['./mock.page.scss']
})
export class MockPage implements OnInit {
  private readonly MONTHS_IN_YEAR = 12;

  months: Month[] = [];

  constructor(private timeStorageService: TimeStorageService) {}

  ngOnInit() {
    this.saveData(TWO_MONTHS_TWO_CHECKINGS).subscribe(_ =>
      this.recoverData(2018).subscribe(months => (this.months = months))
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
