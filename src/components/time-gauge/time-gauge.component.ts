import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { getLast, hasAny } from '../../models/array/array-extensions';
import { PathData, TimeToSvgConverter } from '../../models/svg/time-to-svg-converter';
import { Checking, CheckingDirection } from '../../models/time/checking';
import { isNowAfter, now } from '../../models/time/date-extensions';
import { Day } from '../../models/time/day';
import { TimeCalculation } from '../../models/time/time-calculation';
import 'moment-duration-format';
import { SHORT_TIME_FORMAT } from '../../text-items/date-time-formats';
import { StateProvider } from '../../providers/state/state';

/**
 * Different states the gauge can
 * be in.
 */
enum GaugeState {
  empty,
  showInfo,
  counting,
  error
}

/**
 * Gauge that represents checkings over time.
 */
@Component({
  selector: 'time-gauge',
  templateUrl: 'time-gauge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGaugeComponent implements OnDestroy {
  @Input() resolution = 1;
  @Input() strokeWidth = 10;

  /**
   * Gets or sets if the gauge is allowed to
   * work in counting mode.
   */
  private _allowCountingMode = false;

  get allowCountingMode(): boolean {
    return this._allowCountingMode
  }

  @Input() set allowCountingMode(allow: boolean) {
    this._allowCountingMode = allow;
    this.cd.detectChanges();
  }

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
    this.refresh();
  }

  pathData: PathData[] = [];
  adjustedCheckings: Checking[];
  radius = 50;
  boxDimesion = 100;
  innerGradientStart = (100 * (this.radius - this.strokeWidth)) / this.radius;
  totalWorkedTime = '';
  blink = false;
  errorCondition = false;

  readonly errorColor = 'rgba(255, 0, 0, 0.25)';
  readonly normalColor = 'rgba(0, 0, 0, 0.075)';
  readonly workingTimeClass = 'time-gauge__working-time';
  readonly restingTimeClass = 'time-gauge__resting-time';

  private blinkingSubscription: Subscription;
  private timeToSvgConverter: TimeToSvgConverter;

  constructor(private cd: ChangeDetectorRef, private state: StateProvider) {}

  ngOnDestroy(): void {
    this.stopBlinking();
  }

  /**
   * Plots the gauge.
   */
  private plot(): void {
    const state = this.determineState();

    switch(state) {
      case GaugeState.empty:
        this.clear();
        break;
      case GaugeState.error:
        this.indicateError();
        this.plotInfo();
        break;
      case GaugeState.showInfo:
        this.plotInfo();
        break;
      case GaugeState.counting:
        this.plotCounting();
        break;
    }
  }

  /**
   * Clears the graph.
   */
  private clear(): void {
    this.stopBlinking();

    this.pathData = [];
    this.totalWorkedTime = moment.duration(0).format(SHORT_TIME_FORMAT, { trim: false });
    this.errorCondition = false;
    this.timeToSvgConverter = new TimeToSvgConverter(
      this.radius,
      this.radius,
      this.strokeWidth,
      this.resolution
    );
  }

  /**
   * Indicates an error using the placeholder.
   */
  private indicateError(): void {
    this.stopBlinking();
    this.errorCondition = true;
  }

  /**
   * Determines the state the gauge
   * should adopt.
   */
  private determineState(): GaugeState {
    if(hasAny(this.adjustedCheckings)) {

      const lastChecking = getLast(this.adjustedCheckings);
      const isLastDirectionIn = lastChecking.direction === CheckingDirection.In;
      const isToday = this.day.isToday();
      const isNowAfterLastChecking = isNowAfter(lastChecking.dateTime);
      const inDirections = this.adjustedCheckings.filter(checking => checking.direction === CheckingDirection.In);
      const outDirections = this.adjustedCheckings.filter(checking => checking.direction === CheckingDirection.Out);
      const oneMoreInThanOutCount = inDirections.length === outDirections.length + 1;

      if(isLastDirectionIn && isToday && isNowAfterLastChecking && oneMoreInThanOutCount && this.allowCountingMode) {
        return GaugeState.counting;
      } else if (isNowAfterLastChecking) {
        return GaugeState.showInfo;
      } else {
        return GaugeState.error;
      }
    } else {
      return GaugeState.empty;
    }
  }

  /**
   * Plots information only.
   */
  private plotInfo(): void {
    this.stopBlinking();

    const unevenCheckings = this.adjustedCheckings.length % 2;
    this.plotSegmentsMinus(unevenCheckings);
    this.updateText();
  }

  /**
   * Plots the actual time.
   */
  private plotCounting(): void {
    this.plotSegmentsMinus(1);

    const lastChecking = getLast(this.adjustedCheckings);
    const lastCheckingTime = lastChecking.dateTime;
    const currentTime = now();

    this.plotTime(lastCheckingTime, currentTime, this.workingTimeClass);
    this.updateTextWithNow();
    this.cd.detectChanges();
    this.startBlinking();
  }

  /**
   * Makes the time gauge blink.
   */
  private startBlinking(): void {
    if (!this.blink) {
      this.blink = true;

      const blinking$ = interval(1000);
      this.blinkingSubscription = blinking$.subscribe(_ => {
        this.plot();
        this.updateDayIfChanged();
      });
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
   * Updates the current day if
   * changed during the counting state.
   */
  private updateDayIfChanged(): void {
    if (!this.day.isToday()) {
      this.state.setNextDay()
        .take(1)
        .subscribe(change => this.day = change.day);
    }
  }

  /**
   * Plots segments of checkings without taking into account
   * the specified last number of them.
   * @param amountToExclude Number of checkings that won't be
   * plotted.
   */
  private plotSegmentsMinus(amountToExclude: number): void {
    for (let i = 0; i < this.adjustedCheckings.length - amountToExclude; i += 2) {
      const startChecking = this.adjustedCheckings[i];
      const endChecking = this.adjustedCheckings[i + 1];

      const isStartDirectionIn = startChecking.direction === CheckingDirection.In;
      const  classToApply = isStartDirectionIn
          ? this.workingTimeClass
          : this.restingTimeClass;

      this.plotTime(startChecking.dateTime, endChecking.dateTime, classToApply);
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
    const lastCheckingTime = getLast(this.adjustedCheckings);
    const diff = moment().diff(lastCheckingTime.dateTime);
    const totalTime = this.day.calculateTotalTime().add(diff);
    this.totalWorkedTime = totalTime.format(SHORT_TIME_FORMAT, { trim: false });
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
    setTimeout(() => {
      this.adjustedCheckings = TimeCalculation.adjustCheckings(this.day);
      this.clear();
      this.plot();
      this.cd.detectChanges();
    });
  }
}
