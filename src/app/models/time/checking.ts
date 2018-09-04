/**
 * Direction of the time mark.
 */
export enum CheckingDirection {
    In,
    Out
}

/**
 * Represents a time mark.
 */
export class Checking {
    constructor(public dateTime: Date, public direction: CheckingDirection) {}
}
