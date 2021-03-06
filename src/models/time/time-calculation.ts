import * as moment from 'moment';
import { Checking, CheckingDirection } from './checking';
import { Day } from './day';
import { getFirst, getLast, hasAny } from '../array/array-extensions';
import { compareDates } from './date-extensions';

/**
 * Types of checking adjustments.
 */
export enum CheckingAdjustementType {
  none,
  start,
  end,
  both
}

/**
 * Contains operations with checkings.
 */
export class TimeCalculation {
  /**
   * Checks the type of adjustment that was
   * performed on the checkings of the
   * specified day.
   * @param day Day to check.
   * @param adjusted Adjusted checkings.
   */
  static checkIfTimeAdjusted(
    day: Day,
    adjusted: Checking[]
  ): CheckingAdjustementType {
    if (day.checkings.length === 0) {
      return CheckingAdjustementType.none;
    }

    const rawOrdered = TimeCalculation.orderAscending(day.checkings);
    const startAdjusted =
      compareDates(getFirst(rawOrdered).dateTime, getFirst(adjusted).dateTime) >
      0;
    const endAdjusted =
      compareDates(getLast(rawOrdered).dateTime, getLast(adjusted).dateTime) <
      0;

    if (startAdjusted && endAdjusted) {
      return CheckingAdjustementType.both;
    } else if (startAdjusted) {
      return CheckingAdjustementType.start;
    } else if (endAdjusted) {
      return CheckingAdjustementType.end;
    } else {
      return CheckingAdjustementType.none;
    }
  }

  /**
   * Sums up the duration of an array of days.
   * @param days Days.
   */
  static sumDaysDuration(days: Day[]): moment.Duration {
    const totalDuration = moment.duration();
    days.forEach(day => totalDuration.add(TimeCalculation.sumWorkingTime(day)));
    return totalDuration;
  }

  /**
   * Sums up the duration calculated from all
   * the checkings of one day.
   * @param day Day.
   */
  static sumWorkingTime(day: Day): moment.Duration {
    const adjusted = TimeCalculation.adjustCheckings(day);
    const workingTime = TimeCalculation.sumCheckings(adjusted);
    return workingTime;
  }

  /**
   * Calculates the rest time.
   * @param day Day.
   */
  static sumRestTime(day: Day): moment.Duration {
    const adjusted = TimeCalculation.adjustCheckings(day);
    const inverted = TimeCalculation.invertCheckings(adjusted);
    const restTime = TimeCalculation.sumCheckings(inverted);
    return restTime;
  }

  /**
   * Makes checkings with direction IN become
   * checkings with direction OUT and viceversa.
   * @param checkings Checkings to invert.
   */
  private static invertCheckings(checkings: Checking[]): Checking[] {
    const inverted = JSON.parse(JSON.stringify(checkings));
    inverted.forEach(checking => {
      if (checking.direction === CheckingDirection.In) {
        checking.direction = CheckingDirection.Out;
      } else if (checking.direction === CheckingDirection.Out) {
        checking.direction = CheckingDirection.In;
      }
    });

    return inverted;
  }

  /**
   * Adjusts the checkings that should be taken into
   * account at the beginning and the end of the day.
   * @param day Day to adjust.
   */
  static adjustCheckings(day: Day): Checking[] {
    let orderedCheckings = TimeCalculation.orderAscending(day.checkings);
    let noDuplicates = TimeCalculation.removeDuplicates(orderedCheckings);
    let correctedCheckings: Checking[];

    correctedCheckings = TimeCalculation.adjustBeginningOfDay(
      day,
      noDuplicates
    );

    if (noDuplicates.length > 0) {
      correctedCheckings = TimeCalculation.adjustBeginningOfDay(
        day,
        noDuplicates
      );

      let adjustedCheckings = TimeCalculation.adjustEndOfDay(day, noDuplicates);
      let noOrphans = this.removeOrphans(adjustedCheckings);
      correctedCheckings = noOrphans;
    }

    return correctedCheckings;
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
      ? TimeCalculation.orderAscending(day.next.checkings)[0]
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
    if (hasAny(correctedCheckings)) {
      const firstChecking = correctedCheckings[0];
      const isFirstCheckingDirectionOut =
        firstChecking.direction === CheckingDirection.Out;
      const thereIsPreviousDayLastChecking =
        day.previous && day.previous.checkings.length > 0;
      const isPreviousDayLastCheckingDirectionIn = thereIsPreviousDayLastChecking
        ? TimeCalculation.getFromEndWithDirection(
            TimeCalculation.orderAscending(day.previous.checkings),
            CheckingDirection.In
          )
        : null;
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
    } else if (
      day.isToday() &&
      TimeCalculation.isLastDayLastCheckingDirectionIn(day)
    ) {
      correctedCheckings.unshift(
        new Checking(
          new Date(day.yearNumber, day.monthNumber, day.dayNumber, 0, 0, 0, 0),
          CheckingDirection.In
        )
      );
    }

    return correctedCheckings;
  }

  /**
   * Checks if the last checking of the last day
   * is IN.
   */
  private static isLastDayLastCheckingDirectionIn(day: Day): boolean {
    const lastDay = day.previous;
    const lastDayLastChecking = getLast(lastDay.checkings);
    const isLastDayLastCheckingDirectionIn =
      lastDayLastChecking &&
      lastDayLastChecking.direction === CheckingDirection.In;
    return isLastDayLastCheckingDirectionIn;
  }

  /**
   * Gets the last checking from the end
   * with the specified direction.
   * @param checkings Checkings.
   * @param direction Direction.
   * @returns Checking with the specified direction or
   * null if there's no such checking.
   */
  private static getFromEndWithDirection(
    checkings: Checking[],
    direction: CheckingDirection
  ): Checking {
    let lastDirection = direction;
    let lastChecking: Checking = null;

    for (let i = checkings.length - 1; i >= 0; i--) {
      const currentChecking = checkings[i];

      if (currentChecking.direction !== lastDirection) {
        break;
      }

      lastChecking = currentChecking;
    }

    return lastChecking;
  }

  /**
   * Sums up all the duration between the
   * specified checkings.
   * @param checkings Checkings to sum.
   */
  static sumCheckings(checkings: Checking[]): moment.Duration {
    let lastIn: Checking;
    let lastOut: Checking;
    const totalDuration = moment.duration();

    for (const checking of checkings) {
      switch (checking.direction) {
        case CheckingDirection.In:
          lastIn = checking;
          break;

        case CheckingDirection.Out:
          lastOut = checking;

          if (lastIn) {
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
   * Removes duplicated checkings.
   * @param checkings Checkings to clean.
   */
  private static removeDuplicates(checkings: Checking[]): Checking[] {
    let lastDirection: CheckingDirection = CheckingDirection.NotSet;
    const duplicatesRemoved = [] as Checking[];

    for (const checking of checkings) {
      switch (checking.direction) {
        case CheckingDirection.In:
          if (lastDirection === CheckingDirection.In) {
            continue;
          } else {
            duplicatesRemoved.push(checking);
            lastDirection = CheckingDirection.In;
          }

          break;

        case CheckingDirection.Out:
          if (lastDirection === CheckingDirection.Out) {
            continue;
          } else {
            duplicatesRemoved.push(checking);
            lastDirection = CheckingDirection.Out;
          }

          break;
      }
    }

    return duplicatesRemoved;
  }

  /**
   * Removes orphan entries.
   * @param adjustedCheckings Previously adjusted checkings.
   */
  private static removeOrphans(adjustedCheckings: Checking[]): Checking[] {
    const isFirstCheckingDirectionOut =
      hasAny(adjustedCheckings) &&
      adjustedCheckings[0].direction === CheckingDirection.Out;

    if (isFirstCheckingDirectionOut) {
      const copy = [].concat(adjustedCheckings);
      copy.shift();
      return copy;
    } else {
      return adjustedCheckings;
    }
  }

  /**
   * Order the specified checkings in ascending order.
   * @param checkings Checkings to order.
   */
  public static orderAscending(checkings: Checking[]): Checking[] {
    const ordered: Checking[] = [].concat(checkings);

    ordered.sort((checking1, checking2) => {
      return checking1.dateTime.valueOf() - checking2.dateTime.valueOf();
    });

    return ordered;
  }
}
