import * as moment from 'moment';
import { Checking, CheckingDirection } from './checking';
import { Day } from './day';

/**
 * Contains operations with checkings.
 */
export class TimeCalculation {
  /**
   * Sums up the duration calculated from all
   * the checkings of one day.
   * @param day Day.
   */
  static sumDayDuration(day: Day): moment.Duration {
    const correctedCheckings = TimeCalculation.adjustBeginningAndEndOfDay(day);
    return TimeCalculation.sumCheckings(correctedCheckings);
  }

  /**
   * Adjusts the checkings that should be taken into
   * account at the beginning and the end of the day.
   * @param day Day to adjust.
   */
  private static adjustBeginningAndEndOfDay(day: Day): Checking[] {
    let correctedCheckings = day.checkings;

    if (correctedCheckings.length === 0) {
      return correctedCheckings;
    } else {
      correctedCheckings = TimeCalculation.adjustBeginningOfDay(day, correctedCheckings);
      correctedCheckings = TimeCalculation.adjustEndOfDay(day, correctedCheckings);
      return correctedCheckings;
    }
  }

  /**
   * Adjust the checkings at the end of the day.
   * @param day Day.
   * @param correctedCheckings Corrected checkings so far.
   */
  private static adjustEndOfDay(
    day: Day,
    correctedCheckings: Checking[]
  ): Checking[] {
    const lastChecking = correctedCheckings[correctedCheckings.length - 1];
    const isLastCheckingDirectionIn =
      lastChecking.direction === CheckingDirection.In;
    const thereIsNextDayFirstChecking =
      day.next && day.next.checkings.length > 0;
    const nextDayFirstChecking = thereIsNextDayFirstChecking
      ? day.next.checkings[0]
      : null;
    const isNextDayFirstCheckingDirectionOut =
      thereIsNextDayFirstChecking &&
      nextDayFirstChecking.direction === CheckingDirection.Out;
    if (isLastCheckingDirectionIn && isNextDayFirstCheckingDirectionOut) {
      correctedCheckings.push(
        new Checking(
          new Date(
            day.yearNumber,
            day.monthNumber,
            day.dayNumber,
            23,
            59,
            59,
            999
          ),
          CheckingDirection.Out
        )
      );
    }

    return correctedCheckings;
  }

    /**
   * Adjust the checkings at the beginning of the day.
   * @param day Day.
   * @param correctedCheckings Corrected checkings so far.
   */
  private static adjustBeginningOfDay(
    day: Day,
    correctedCheckings: Checking[]
  ): Checking[] {
    const firstChecking = correctedCheckings[0];
    const isFirstCheckingDirectionOut =
    firstChecking.direction === CheckingDirection.Out;
    const thereIsPreviousDayLastChecking =
      day.previous && day.previous.checkings.length > 0;
    const previousDayLastChecking = thereIsPreviousDayLastChecking
      ? day.previous.checkings[day.previous.checkings.length - 1]
      : null;
    const isPreviousDayLastCheckingDirectionIn =
      thereIsPreviousDayLastChecking &&
      previousDayLastChecking.direction === CheckingDirection.In;
    if (isFirstCheckingDirectionOut && isPreviousDayLastCheckingDirectionIn) {
      correctedCheckings.unshift(
        new Checking(
          new Date(
            day.yearNumber,
            day.monthNumber,
            day.dayNumber,
            0,
            0,
            0,
            0
          ),
          CheckingDirection.In
        )
      );
    }

    return correctedCheckings;
  }

  /**
   * Sums up the duration of an array of days.
   * @param days Days.
   */
  static sumDaysDuration(days: Day[]): moment.Duration {
    const totalDuration = moment.duration();
    days.forEach(day => totalDuration.add(TimeCalculation.sumDayDuration(day)));
    return totalDuration;
  }

  /**
   * Sums up all the duration between the
   * specified checkings.
   * @param checkings Checkings to sum.
   */
  private static sumCheckings(checkings: Checking[]): moment.Duration {
    let lastDirection: CheckingDirection;
    let lastIn: Checking;
    let lastOut: Checking;
    const totalDuration = moment.duration();
    const orderedCheckings = TimeCalculation.orderAscending(checkings);

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

            const currentDuration = moment(lastOut.dateTime).diff(
              lastIn.dateTime
            );
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
