import { Week } from '../time/week';
import { DayFormatter } from './day-formatter';
import { Formatter, JsonData } from './formatter';

/**
 * Week formatter.
 */
export class WeekFormatter implements Formatter {
  constructor(private week: Week) {}

  /**
   * Provides a formatted version of the information
   * contained within the specified week.
   */
  format(): JsonData[] {
    let checkingsAsJsonData: JsonData[] = [];

    for(let day of this.week.days) {
      const dayFormatter = new DayFormatter(day);
      checkingsAsJsonData = checkingsAsJsonData.concat(dayFormatter.format());
    }

    checkingsAsJsonData.push(this.createTotal());

    return checkingsAsJsonData;
  }

  /**
   * Creates a total as JsonData.
   */
  private createTotal(): JsonData {
    return {
      direction: 'Week Total',
      time: this.week.getFormattedWorkedTotalTime()
    };
  }
}
