import * as moment from 'moment';
import { ArcCommands } from './arc-commands';

/**
 * Represents an interval between
 * two angles.
 */
interface AngleInterval {
  startAngle: number;
  endAngle: number;
}

/**
 * Data for svg path.
 */
export interface PathData {
  d: string;
  className: string;
}

/**
 * Converts dates to SVG paths.
 */
export class TimeToSvgConverter {
  constructor(
    private centerXY: number = 50,
    private radius: number = 50,
    private strokeWidth: number = 10,
    private resolution: number = 1
  ) {}

  /**
   * Converts the specified time to SVG path.
   * @param startTime Start time.
   * @param endTime End time.
   * @param className Class to apply to the time.
   */
  convertTime(
    startTime: Date,
    endTime: Date,
    className: string
  ): PathData {
    const interval = this.calculateStartEndAngles(startTime, endTime);
    const pathData = this.createPathData(interval, className);
    return pathData;
  }

  /**
   * Calculates the start and end angle corresponding to
   * the time interval specified.
   * @param startTime Start time.
   * @param endTime End time.
   */
  private calculateStartEndAngles(
    startTime: Date,
    endTime: Date
  ): AngleInterval {
    const today = new Date();
    const midnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const millisStart = moment.duration(
      startTime.valueOf() - midnight.valueOf()
    );
    const millisEnd = moment.duration(endTime.valueOf() - midnight.valueOf());
    const duration = millisEnd.subtract(millisStart);
    const startAngle = this.durationToAngle(millisStart);
    const endAngle = startAngle + this.durationToAngle(duration);

    return {
      startAngle,
      endAngle
    };
  }

  /**
   * Create the data to be consumed by a path.
   * @param interval Angle interval.
   * @param className CSS class to apply.
   */
  private createPathData(interval: AngleInterval, className: string): PathData {
    const d = ArcCommands.createArcCommands(
      this.centerXY * this.resolution,
      this.centerXY * this.resolution,
      this.radius * this.resolution - (this.strokeWidth * this.resolution) / 2,
      interval.startAngle,
      interval.endAngle
    );

    return {
      d,
      className
    };
  }

  /**
   * Calculates the corresponding angle of a duration
   * within a day.
   * @param duration Duration.
   */
  private durationToAngle(duration: moment.Duration): number {
    const millisInOneDay = 24 * 60 * 60 * 1000;
    const totalDegrees = 360;
    const degrees = (totalDegrees * duration.asMilliseconds()) / millisInOneDay;
    return degrees;
  }
}
