/**
 * Contains data about a page.
 */
export interface PageData {
  name: string;
  caption: string;
  icon: string;
}

/**
 * Pages of the application.
 */
export const PAGES_LIST: PageData[] = [
  { name: 'CurrentDayPage', caption: 'Current day', icon: 'timer' },
  { name: 'DayPage', caption: 'Day', icon: 'clock' },
  { name: 'WeekPage', caption: 'Week', icon: 'calendar' },
  { name: 'MonthPage', caption: 'Month', icon: 'calendar' },
  { name: 'YearPage', caption: 'Year', icon: 'calendar' },
]
