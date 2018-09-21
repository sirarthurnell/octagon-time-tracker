import { DayFormatter } from './day-formatter';
import { Formatter, JsonData } from './formatter';
import { Month } from '../time/month';

/**
 * Month formatter.
 */
export class MonthFormatter implements Formatter {
  constructor(private month: Month) {}

  /**
   * Provides a formatted version of the information
   * contained within the specified month.
   */
  format(): JsonData[] {
    let checkingsAsJsonData: JsonData[] = [];

    for(let day of this.month.days) {
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
      direction: 'Month Total',
      time: this.month.getFormattedWorkedTotalTime()
    };
  }
}
