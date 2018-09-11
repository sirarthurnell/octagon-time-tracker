import { Checking, CheckingDirection } from '../time/checking';

/**
 * Represents a checking in a storable format.
 */
export class StorableChecking {
  datetime: string;
  direction: number;

  /**
   * Converts an array of checkings in storable format to
   * authentic checkings.
   * @param storedCheckings Checkings in storable format.
   */
  static fromStorableArray(storedCheckings: StorableChecking[]): Checking[] {
    return storedCheckings.map(stored => this.fromStorable(stored));
  }

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
   * Converts an array of checkings to an array
   * of storable representation.
   * @param checkings Checkings.
   */
  static toStorableArray(checkings: Checking[]): StorableChecking[] {
    return checkings.map(checking => this.toStorable(checking));
  }

  /**
   * Converts a checking in an storable
   * representation.
   */
  static toStorable(checking: Checking): StorableChecking {
    return {
      datetime: checking.dateTime.toISOString(),
      direction: checking.direction.valueOf()
    };
  }
}
