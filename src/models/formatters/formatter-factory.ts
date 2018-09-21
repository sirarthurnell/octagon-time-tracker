import { Day } from '../time/day';
import { DayFormatter } from './day-formatter';
import { Formatter } from './formatter';
import { WeekFormatter } from './week-formatter';
import { Week } from '../time/week';
import { MonthFormatter } from './month-formatter';
import { Month } from '../time/month';
import { Checking } from '../time/checking';
import { DumpFormatter } from './dump-formatter';

/**
 * Factory for the different formatters.
 */
export class FormatterFactory {
  /**
   * Provides a formatter to format the
   * specified entity.
   * @param entity Entity to format.
   */
  createFormatter(entity: [] | {}): Formatter {
    if (entity instanceof Day) {
      return new DayFormatter(entity as Day);
    } else if (entity instanceof Week) {
      return new WeekFormatter(entity as Week);
    } else if (entity instanceof Month) {
      return new MonthFormatter(entity as Month);
    } else if (
      (entity instanceof Array && entity.length === 0) ||
      <any>entity[0] instanceof Checking
    ) {
      return new DumpFormatter(entity as Checking[]);
    } else {
      return null;
    }
  }
}
