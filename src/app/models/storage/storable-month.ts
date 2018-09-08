import { DayOfWeek } from '../time/day-of-week';
import { Month } from '../time/month';
import { StorableChecking } from './storable-checking';
import { StorableDayInfo } from './storable-day-info';
import { Checking } from '../time/checking';

/**
 * Represents a month in a storable format.
 */
export class StorableMonth {
  checkings: StorableChecking[] = [];
  dayInfos: StorableDayInfo[] = [];

  /**
   * Creates a new month from one in storable format.
   * @param storedMonth Month in storable format.
   */
  static fromStorable(
    year: number,
    month: number,
    firstDayOfWeek: DayOfWeek,
    storedMonth: StorableMonth
  ): Month {
    const checkings = StorableChecking.fromStorableArray(storedMonth.checkings);
    const dayInfos = {};

    storedMonth.dayInfos.forEach(
      dayInfo =>
        (dayInfos[dayInfo.day] = { absence: dayInfo.absence, tag: dayInfo.tag })
    );

    const newMonth = new Month(year, month, firstDayOfWeek, checkings, dayInfos);
    return newMonth;
  }

  /**
   * Converts a month in an storable
   * representation.
   */
  static toStorable(month: Month): StorableMonth {
    const checkings = StorableChecking.toStorableArray(month.checkings);
    const dayInfos = month.days.map(day => {
      if (day.info) {
        return {
          day: day.dayNumber,
          absence: day.info.absence,
          tag: day.info.tag
        };
      } else {
        return null;
      }
    });

    const filteredDayInfos = dayInfos.filter(info => info !== null);

    return {
      checkings,
      dayInfos: filteredDayInfos
    };
  }
}
