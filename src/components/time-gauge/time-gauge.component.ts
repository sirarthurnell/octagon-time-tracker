import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import {
  PathData,
  TimeToSvgConverter
} from '../../models/svg/time-to-svg-converter';
import { CheckingDirection } from '../../models/time/checking';
import { Day } from '../../models/time/day';
import { TimeCalculation } from '../../models/time/time-calculation';

/**
 * Gauge that represents checkings over time.
 */
@Component({
  selector: 'time-gauge',
  templateUrl: 'time-gauge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGaugeComponent implements OnInit, OnDestroy {
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
    }

    this.cd.detectChanges();
  }

  /**
   * Data of all the paths to draw.
   */
  pathData: PathData[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.day) {
      this.plotDay();
    } else {
      this.clear();
    }
  }

  ngOnDestroy(): void {
    this.stopBlinking();
  }

  radius = 50;
  boxDimesion = 100;
  innerGradientStart = (100 * (this.radius - this.strokeWidth)) / this.radius;
  totalWorkedTime = '';
  blink = false;
  errorCondition = false;
  readonly errorColor = 'rgba(255, 0, 0, 0.25)';
  readonly normalColor = 'rgba(0, 0, 0, 0.075)';

  private centerXY = 50;
  private blinkingSubscription: Subscription;
  private timeToSvgConverter: TimeToSvgConverter;

  /**
   * Plots the stablished day.
   */
  private plotDay(): void {
    const checkings = TimeCalculation.adjustCheckings(this.day);
    const now = new Date();

    this.stopBlinking();

    for (let i = 0; i < checkings.length; i += 2) {
      const startChecking = checkings[i];
      const startTime = startChecking.dateTime;
      const isStartDirectionIn =
        startChecking.direction === CheckingDirection.In;
      const nowOlderThanStartChecking = now.valueOf() > startTime.valueOf();
      let classToApply: string = '';
      let endTime: Date;

      if (i + 1 < checkings.length) {
        endTime = checkings[i + 1].dateTime;
        classToApply = isStartDirectionIn
          ? this.workingTimeClass
          : this.restingTimeClass;
        this.updateText();
      } else if (
        isStartDirectionIn &&
        this.day.isToday() &&
        nowOlderThanStartChecking
      ) {
        endTime = now;
        this.updateTextWithNow();
        classToApply = this.workingTimeClass;
        this.startBlinking();
      } else {
        this.indicateError();
        return;
      }

      this.plotTime(startTime, endTime, classToApply);
    }
  }

  /**
   * Updates the time indicator only with the
   * total time worked.
   */
  private updateText(): void {
    this.totalWorkedTime = this.day.getFormattedTotalTime();
  }

  /**
   * Updates the time indicator taking into account
   * the time elapsed between the last checking and now.
   */
  private updateTextWithNow(): void {
    const lastCheckingTime = this.day.getMostRecentChecking().dateTime;
    const now = new Date();
    const diff = moment(now).diff(lastCheckingTime);
    const totalTime = this.day.calculateTotalTime().add(diff);
    this.totalWorkedTime = moment
      .utc(totalTime.as('milliseconds'))
      .format('HH:mm');
  }

  /**
   * Makes the time gauge blink.
   */
  private startBlinking(): void {
    if (!this.blink) {
      this.blink = true;

      const blinking$ = interval(1000);
      this.blinkingSubscription = blinking$.subscribe(_ => this.plotDay());
    }
  }

  /**
   * Makes the time gauge stop blinking.
   */
  private stopBlinking(): void {
    if (this.blink) {
      this.blinkingSubscription.unsubscribe();
      this.blink = false;
    }
  }

  /**
   * Indicates an error using the placeholder.
   */
  private indicateError(): void {
    this.errorCondition = true;
  }

  /**
   * Plots the specified time.
   * @param startTime Start time.
   * @param endTime End time.
   * @param className Class to apply to the time.
   */
  private plotTime(startTime: Date, endTime: Date, className: string): void {
    const pathData = this.timeToSvgConverter.convertTime(
      startTime,
      endTime,
      className
    );
    this.pathData.push(pathData);
  }

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
    this.errorCondition = false;
    this.timeToSvgConverter = new TimeToSvgConverter(
      this.centerXY,
      this.radius,
      this.strokeWidth,
      this.resolution
    );
  }
}
