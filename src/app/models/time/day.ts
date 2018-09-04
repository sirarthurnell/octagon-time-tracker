import { Checking } from './checking';

/**
 * Represents a day.
 */
export class Day {
    constructor(
        public yearNumber: number,
        public monthNumber: number,
        public dayNumber: number,
        public checkings: Checking[]
    ) {}
}
