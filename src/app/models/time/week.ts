import { Day } from './day';

/**
 * Represents a week.
 */
export class Week {
  constructor(yearNumber: number, monthNumber: number, weekNumber: number, readonly days: Day[]) { }
}
