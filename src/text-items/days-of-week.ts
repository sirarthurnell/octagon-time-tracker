/**
 * Contains information about the day of
 * the week.
 */
export interface DayOfWeek {
  name: string;
  type: string;
}

/**
 * Names of the days of the week.
 */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  { name: 'S', type: 'sunday' },
  { name: 'M', type: 'normal' },
  { name: 'T', type: 'normal' },
  { name: 'W', type: 'normal' },
  { name: 'T', type: 'normal' },
  { name: 'F', type: 'normal' },
  { name: 'S', type: 'saturday' }
];
