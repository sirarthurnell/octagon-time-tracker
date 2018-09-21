/**
 * Json data.
 */
export interface JsonData {
  direction: string;
  time: string;
}

/**
 * Interface to be implemented by all the formatters.
 */
export interface Formatter {
  format(): any[];
}
