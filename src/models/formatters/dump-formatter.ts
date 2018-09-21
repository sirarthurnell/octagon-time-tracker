import { Checking, CheckingDirection } from '../time/checking';
import { Formatter, JsonData } from './formatter';

/**
 * Dump formatter.
 */
export class DumpFormatter implements Formatter {
  constructor(private checkings: Checking[]) {}

  /**
   * Provides a formatted version of the information
   * contained within the specified array of checkings.
   */
  format(): JsonData[] {
    const checkingsAsJsonData: JsonData[] = [];

    for(const checking of this.checkings) {
      checkingsAsJsonData.push(this.toJsonData(checking));
    }

    return checkingsAsJsonData;
  }

  /**
   * Converts the checking to a JsonData representation.
   * @param checking Checking to convert.
   */
  private toJsonData(checking: Checking): JsonData {
    return {
      direction: checking.direction === CheckingDirection.In ? 'IN' : 'OUT',
      time: checking.dateTime.toLocaleString()
    };
  }
}
