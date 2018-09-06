import { Checking } from './checking';
import * as moment from 'moment';
import { CheckingOperations } from './checking-operations';

/**
 * Represents a day.
 */
export class Day {
    constructor(
        public yearNumber: number,
        public monthNumber: number,
        public dayNumber: number,
        readonly checkings: Checking[],
        private saveCb: () => void
    ) {}

    /**
     * Calculates the total time worked
     * during the current day.
     */
    calculateTotalTime(): moment.Duration {
      return CheckingOperations.sumDuration(this.checkings);
    }

    /**
     * Saves the checkings of the day.
     */
    save(): void {
        this.saveCb();
    }
}
