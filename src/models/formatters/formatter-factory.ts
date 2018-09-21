import { Day } from '../time/day';
import { DayFormatter } from './day-formatter';
import { Formatter } from './formatter';

/**
 * Factory for the different formatters.
 */
export class FormatterFactory {

  /**
   * Provides a formatter to format the
   * specified entity.
   * @param entity Entity to format.
   */
  createFormatter(entity: any): Formatter {
    if (entity instanceof Day) {
      return new DayFormatter(entity as Day);
    } else {
      return null;
    }
  }
}
