/**
 * Direction of the time mark.
 */
export enum CheckingDirection {
  In,
  Out
}

/**
 * Represents a checking in a storable
 * format.
 */
export interface StorableChecking {
  datetime: string;
  direction: number;
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
   * Creates a new checking from one in storable format.
   * @param storedChecking Checking in storable format.
   */
  static fromStorable(storedChecking: StorableChecking): Checking {
    return new Checking(
      new Date(storedChecking.datetime),
      storedChecking.direction as CheckingDirection
    );
  }

  /**
   * Converts the current checking in an storable
   * representation.
   */
  toStorable(): StorableChecking {
    return {
      datetime: this.dateTime.toISOString(),
      direction: this.direction.valueOf()
    };
  }
}
