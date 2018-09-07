import { Month } from '../models/time/month';
import { DayOfWeek } from '../models/time/day-of-week';
import { Checking, CheckingDirection } from '../models/time/checking';

/**
 * Mock data.
 */
export const MOCK_DATA: Month[] = [
  new Month(2018, 1, DayOfWeek.Sunday, [
    new Checking(new Date(2018, 0, 1, 10), CheckingDirection.In),
    new Checking(new Date(2018, 0, 1, 11), CheckingDirection.Out)
  ]),
  new Month(2018, 1, DayOfWeek.Sunday, [
    new Checking(new Date(2018, 0, 31, 11), CheckingDirection.In),
    new Checking(new Date(2018, 0, 31, 12), CheckingDirection.Out)
  ])
];
