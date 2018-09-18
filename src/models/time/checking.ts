/**
 * Direction of the time mark.
 */
export enum CheckingDirection {
  NotSet = 0,
  In,
  Out
}

/**
 * Represents a time mark.
 */
export class Checking {
  /**
   * Sets the date and time the checking was made.
   */
  set dateTime(date: Date) {
    if (date) {
      this.checkingDateTime = date;
    }
  }

  /**
   * Gets the date and time the checking was made.
   */
  get dateTime(): Date {
    return this.checkingDateTime;
  }

  constructor(private checkingDateTime: Date, public direction: CheckingDirection) {}

  /**
   * Clonates the current checking.
   */
  clone(): Checking {
    return new Checking(this.dateTime, this.direction);
  }

  /**
   * String representation of the checking.
   */
  toString(): string {
    return this.dateTime.toLocaleString();
  }
}
