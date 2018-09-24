import { Observable } from 'rxjs';
import { Checking, CheckingDirection } from '../models/time/checking';
import { DayOfWeek } from '../models/time/day-of-week';
import { Month } from '../models/time/month';
import { Year } from '../models/time/year';
import { TimeStorageProvider } from '../providers/time-storage/time-storage';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { switchMap } from 'rxjs/operators/switchMap';

/**
 * Mock data.
 */
export const TWO_MONTHS_TWO_CHECKINGS: Month[] = [
  new Month(
    2018,
    0,
    DayOfWeek.Sunday,
    [
      new Checking(new Date(2018, 0, 1, 10), CheckingDirection.In),
      new Checking(new Date(2018, 0, 1, 11), CheckingDirection.Out)
    ],
    {}
  ),
  new Month(
    2018,
    1,
    DayOfWeek.Sunday,
    [
      new Checking(new Date(2018, 1, 28, 11), CheckingDirection.In),
      new Checking(new Date(2018, 1, 28, 12), CheckingDirection.Out)
    ],
    {}
  )
];

/**
 * Empty data.
 */
export const EMPTY: Month[] = [];

/**
 * One month empty.
 */
export const ONE_MONTH_EMPTY: Month[] = [
  new Month(2018, 0, DayOfWeek.Sunday, [], {})
];

/**
 * One month with one checking.
 */
export const ONE_MONTH_ONE_CHECKING: Month[] = [
  new Month(
    2018,
    8,
    DayOfWeek.Sunday,
    [new Checking(new Date(2018, 8, 18, 10), CheckingDirection.In)],
    { 1: { absence: 'doctor', tag: '' } }
  )
];

/**
 * Fills and saves one year with fake data.
 * @param timeStorageProvider Time storage provider.
 * @param year Year to fill.
 */
export function fillOneYear(
  timeStorageProvider: TimeStorageProvider,
  year: number
): Observable<Year> {
  const savedYear$ = Year.getYear(timeStorageProvider, year).pipe(
    switchMap(year => fillYear(timeStorageProvider, year))
  );
  return savedYear$;
}

/**
 * Fills one year with checkings.
 * @param timeStorageProvider Time storage provider.
 * @param year Year to fill.
 */
function fillYear(
  timeStorageProvider: TimeStorageProvider,
  year: Year
): Observable<any> {
  const daysSave = [] as Observable<any>[];

  for (let month of year.months) {
    for (let day of month.days) {
      if (day.isSaturday() || day.isSunday()) {
        continue;
      }

      const startHour = 8;
      const endHour = startHour + 8;
      const startMinutes = Math.floor(Math.random() * 30);
      const endMinutes = Math.floor(Math.random() * 30);
      const startChecking = new Checking(
        new Date(year.yearNumber, month.monthNumber, day.dayNumber, startHour, startMinutes),
        CheckingDirection.In
      );
      const endChecking = new Checking(
        new Date(year.yearNumber, month.monthNumber, day.dayNumber, endHour, endMinutes),
        CheckingDirection.Out
      );

      day.checkings.push(startChecking);
      day.checkings.push(endChecking);

      daysSave.push(day.save(timeStorageProvider));
    }
  }

  return forkJoin(daysSave);
}
