import { SHORT_TIME_FORMAT } from '../../text-items/date-time-formats';
import { Checking, CheckingDirection } from '../time/checking';
import { Day } from '../time/day';
import { CheckingAdjustementType, TimeCalculation } from '../time/time-calculation';
import { Formatter, JsonData } from './formatter';

/**
 * Day formatter.
 */
export class DayFormatter implements Formatter {
  constructor(private day: Day) {}

  /**
   * Provides a formatted version of the information
   * contained within the specified day.
   */
  format(): JsonData[] {
    const adjusted = this.day.getAdjustedCheckings();
    const adjustmentType = TimeCalculation.checkIfTimeAdjusted(
      this.day,
      adjusted
    );
    const checkingsAsJsonData: JsonData[] = [];

    for (let i = 0, next = 1; next < adjusted.length; i += 2, next += 2) {
      if (this.shouldInclude(i, adjusted.length, adjustmentType)) {
        checkingsAsJsonData.push(this.toJsonData(adjusted[i]));
      }

      if (next < adjusted.length) {

        if (this.shouldInclude(next, adjusted.length, adjustmentType)) {
          checkingsAsJsonData.push(this.toJsonData(adjusted[next]));
        }

        checkingsAsJsonData.push(this.createChunk(adjusted[i], adjusted[next]));

      }
    }

    checkingsAsJsonData.push(this.createTotal());

    return checkingsAsJsonData;
  }

  /**
   * Checks if the checking should be included.
   * @param index Index of the current chcking.
   * @param total Total number of checkings.
   * @param adjustmentType Type of adjustment.
   */
  private shouldInclude(
    index: number,
    total: number,
    adjustmentType: CheckingAdjustementType
  ): boolean {
    if (
      index === 0 &&
      (adjustmentType === CheckingAdjustementType.start ||
        adjustmentType === CheckingAdjustementType.both)
    ) {
      return false;
    }

    if (
      index === total - 1 &&
      (adjustmentType === CheckingAdjustementType.end ||
        adjustmentType === CheckingAdjustementType.both)
    ) {
      return false;
    }

    return true;
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

  /**
   * Creates a chunk as JsonData.
   * @param checkingIn Checkin IN.
   * @param checkingOut Checkin OUT.
   */
  private createChunk(checkingIn: Checking, checkingOut: Checking): JsonData {
    const diff = TimeCalculation.sumCheckings([checkingIn, checkingOut]);

    return {
      direction: 'Chunk',
      time: diff.format(SHORT_TIME_FORMAT)
    };
  }

  /**
   * Creates a total as JsonData.
   */
  private createTotal(): JsonData {
    return {
      direction: 'Day Total',
      time: this.day.getFormattedTotalTime()
    };
  }
}
