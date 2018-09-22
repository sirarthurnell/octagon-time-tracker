import { DayOfWeek } from '../time/day-of-week';
import { getLocalizedFirstDayOfWeek } from '../../text-items/date-time-formats';

/**
 * Configurable settings.
 */
export class Settings {

    /**
     * Day of the week considered the first day.
     */
    firstDayOfWeek: DayOfWeek;

    /**
     * Gets the default settings.
     */
    static getDefault(): Settings {
        return {
            firstDayOfWeek: getLocalizedFirstDayOfWeek() as DayOfWeek
        };
    }
}
