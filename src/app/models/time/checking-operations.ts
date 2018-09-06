import * as moment from 'moment';
import { Checking, CheckingDirection } from './checking';

/**
 * Contains operations with checkings.
 */
export class CheckingOperations {

  /**
   * Sums up all the duration between the
   * specified checkings.
   * @param checkings Checkings to sum.
   */
  static sumDuration(checkings: Checking[]): moment.Duration {
    let lastDirection: CheckingDirection;
    let lastIn: Checking;
    let lastOut: Checking;
    const totalDuration = moment.duration();
    const orderedCheckings = CheckingOperations.orderAscending(checkings);

    for (const checking of orderedCheckings) {
      switch (checking.direction) {
        case CheckingDirection.In:

          if (lastDirection === CheckingDirection.In) {
            continue;
          } else {
            lastIn = checking;
            lastDirection = CheckingDirection.In;
          }

          break;

        case CheckingDirection.Out:

          if (lastDirection === CheckingDirection.Out) {
            continue;
          } else {
            lastOut = checking;
            lastDirection = CheckingDirection.Out;

            const currentDuration = moment(lastOut.dateTime).diff(lastIn.dateTime);
            totalDuration.add(currentDuration);
          }

          break;
      }
    }

    return totalDuration;
  }

  /**
   * Order the specified checkings in ascending order.
   * @param checkings Checkings to order.
   */
  static orderAscending(checkings: Checking[]): Checking[] {
    const ordered: Checking[] = [].concat(checkings);

    ordered.sort((checking1, checking2) => {
      return checking1.dateTime.valueOf() - checking2.dateTime.valueOf();
    });

    return ordered;
  }
}
