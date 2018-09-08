import { Checking, CheckingDirection } from '../time/checking';

/**
 * Represents a checking in a storable format.
 */
export class StorableChecking {
  datetime: string;
  direction: number;

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
