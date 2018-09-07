import { Month } from '../models/time/month';
import { DayOfWeek } from '../models/time/day-of-week';
import { Checking, CheckingDirection } from '../models/time/checking';

/**
 * Mock data.
 */
export const TWO_MONTHS_TWO_CHECKINGS: Month[] = [
  new Month(2018, 0, DayOfWeek.Sunday, [
    new Checking(new Date(2018, 0, 1, 10), CheckingDirection.In),
    new Checking(new Date(2018, 0, 1, 11), CheckingDirection.Out)
  ]),
  new Month(2018, 1, DayOfWeek.Sunday, [
    new Checking(new Date(2018, 1, 28, 11), CheckingDirection.In),
    new Checking(new Date(2018, 1, 28, 12), CheckingDirection.Out)
  ])
];

/**
 * Empty data.
 */
export const EMPTY: Month[] = [];

/**
 * One month empty.
 */
export const ONE_MONTH_EMPTY: Month[] = [
  new Month(2018, 0, DayOfWeek.Sunday, [])
];

/**
 * One month with one checking.
 */
export const ONE_MONTH_ONE_CHECKING: Month[] = [
  new Month(2018, 0, DayOfWeek.Sunday, [
    new Checking(new Date(2018, 0, 1, 10), CheckingDirection.In)
  ])
];
