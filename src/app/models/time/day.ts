import { Checking } from './checking';
import * as moment from 'moment';
import { CheckingOperations } from './checking-operations';
import { TimeStorageService } from '../../services/time-storage.service';

/**
 * Represents a day.
 */
export class Day {
    constructor(
        public yearNumber: number,
        public monthNumber: number,
        public dayNumber: number,
        readonly checkings: Checking[],
        private saveCb: (timeStorageService: TimeStorageService) => void
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
     * @param timeStorageService Storage.
     */
    save(timeStorageService: TimeStorageService): void {
        this.saveCb(timeStorageService);
    }
}
