import { DayOfWeek } from "../time/day-of-week";

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
            firstDayOfWeek: DayOfWeek.Sunday
        }
    }
}