import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ArcCommands } from '../../models/svg/arc-commands';
import { Day } from '../../models/time/day';
import { TimeCalculation } from '../../models/time/time-calculation';
import { CheckingDirection } from '../../models/time/checking';

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
interface PathData {
  d: string;
  className: string;
}

/**
 * Gauge that represents checkings over time.
 */
@Component({
  selector: 'time-gauge',
  templateUrl: 'time-gauge.component.html'
})
export class TimeGaugeComponent implements OnInit {
  @Input()
  resolution = 1;
  @Input()
  strokeWidth = 10;
  @Input()
  workingTimeClass = 'time-gauge__working-time';
  @Input()
  restingTimeClass = 'time-gauge__resting-time';

  /**
   * Gets or sets the day to plot.
   */
  private _day: Day;

  get day(): Day {
    return this._day;
  }

  @Input()
  set day(day: Day) {
    this._day = day;
    this.clear();

    if (day) {
      this.plotDay();
      this.totalWorkedTime = this.day.getFormattedTotalTime();
    }
  }

  radius = 50;
  boxDimesion = 100;
  innerGradientStart = (100 * (this.radius - this.strokeWidth)) / this.radius;
  totalWorkedTime = '';

  private centerXY = 50;

  /**
   * Data of all the paths to draw.
   */
  pathData: PathData[] = [];

  ngOnInit() {
    if (this.day) {
      this.plotDay();
    } else {
      this.clear();
    }

    //this.plotOneHour();
  }

  /**
   * Plots only one hour (in order to show
   * something when there's no day set).
   */
  // private plotOneHour(): void {
  //   const today = new Date();
  //   const midnight = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     0,
  //     0,
  //     0,
  //     0
  //   );
  //   const midnightPlusOneHour = new Date(midnight.valueOf());
  //   midnightPlusOneHour.setHours(1);

  //   this.plotTime(midnight, midnightPlusOneHour, this.workingTimeClass);
  // }

  /**
   * Perform a refresh.
   */
  refresh(): void {
    this.day = this.day;
  }

  /**
   * Clears the graph.
   */
  private clear(): void {
    this.pathData = [];
    this.totalWorkedTime = '';
  }

  /**
   * Plots the stablished day.
   */
  private plotDay(): void {
    const checkings = TimeCalculation.adjustCheckings(this.day);

    for (let i = 0; i < checkings.length; i += 2) {
      const startChecking = checkings[i];
      const startTime = startChecking.dateTime;
      const isStartDirectionIn =
        startChecking.direction === CheckingDirection.In;
      let classToApply: string = '';
      let endTime: Date;

      if (i + 1 < checkings.length) {
        endTime = checkings[i + 1].dateTime;
        classToApply = isStartDirectionIn
          ? this.workingTimeClass
          : this.restingTimeClass;
      } else if (isStartDirectionIn && this.day.isToday()) {
        endTime = new Date();
        classToApply = this.workingTimeClass;
      } else {
        return;
      }

      this.plotTime(startTime, endTime, classToApply);
    }
  }

  /**
   * Plots the specified time.
   * @param startTime Start time.
   * @param endTime End time.
   * @param className Class to apply to the time.
   */
  private plotTime(startTime: Date, endTime: Date, className: string): void {
    const interval = this.calculateStartEndAngles(startTime, endTime);
    const pathData = this.createPathData(interval, className);
    this.pathData.push(pathData);
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
