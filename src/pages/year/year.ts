import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { IonicPage, NavController, NavParams, PopoverController } from "ionic-angular";
import { Subscription } from "rxjs";
import { PreviousNextComponent } from "../../components/previous-next/previous-next";
import { create2dArray } from "../../models/array/array-extensions";
import { ColorBlender } from "../../models/colors/color-blender";
import { CssVariables } from "../../models/css/CssVariables";
import { Day } from "../../models/time/day";
import { Month } from "../../models/time/month";
import { Year } from "../../models/time/year";
import { StateProvider } from "../../providers/state/state";
import { DayOfWeek, TimeNames } from "../../text-items/time-names";

/**
 * Shows info about the specified year.
 */
@IonicPage()
@Component({
  selector: "page-year",
  templateUrl: "year.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearPage {
  @ViewChild("previousNext")
  previousNext: PreviousNextComponent;

  /**
   * Year to show.
   */
  year: Year;

  private changeSubscription: Subscription;
  private orientationSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public popoverCtrl: PopoverController,
    private cd: ChangeDetectorRef,
    private state: StateProvider
  ) {}

  ionViewWillEnter() {
    this.changeSubscription = this.state.change$.subscribe(change => {
      this.year = change.year;
      this.cd.detectChanges();
    });

    this.orientationSubscription = this.screenOrientation
      .onChange()
      .subscribe(_ => this.cd.detectChanges());
  }

  ionViewWillLeave() {
    this.changeSubscription.unsubscribe();
    this.orientationSubscription.unsubscribe();
  }

  /**
   * Go to the month page.
   * @param month Month to show.
   */
  showMonth(month: Month): void {
    this.state.setMonth(month).subscribe(_ => this.navCtrl.push("MonthPage"));
  }

  /**
   * Sets and shows today.
   */
  showToday(): void {
    this.state.setToday().subscribe(change => {
    this.year = change.year;
    });
  }

  /**
   * Sets the previous year.
   */
  setPrevious(): void {
    this.state.setPreviousYear().subscribe(change => {
      this.year = change.year;
      this.previousNext.animatePrevious();
    });
  }

  /**
   * Sets the next year.
   */
  setNext(): void {
    this.state.setNextYear().subscribe(change => {
      this.year = change.year;
      this.previousNext.animateNext();
    });
  }

  /**
   * Gets the name of the days.
   */
  getDaysOfWeek(): DayOfWeek[] {
    return TimeNames.getDaysOfWeek();
  }

  /**
   * Gets the name of the month.
   * @param month Month.
   */
  getMonthName(month: Month): string {
    return month.name;
  }

  /**
   * Gets the months of the year distributed
   * in rows.
   */
  getRowsOfMonths(): Month[][] {
    let monthRows: Month[][];
    let monthsPerRow: number;

    if (this.screenOrientation.type.indexOf("portrait") > -1) {
      monthsPerRow = 3;
    } else {
      monthsPerRow = 6;
    }

    monthRows = create2dArray<Month>(this.year.months.length / monthsPerRow);

    for (let i = 0; i < this.year.months.length; i++) {
      const currentMonth = this.year.months[i];
      monthRows[Math.floor(i / monthsPerRow)].push(currentMonth);
    }

    return monthRows;
  }

  /**
   * Gets the corresponding background color
   * of the specified day calculated based on
   * its worked time.
   * @param day Day.
   */
  getDayBackgroundColor(day: Day): string {
    const darken = day.getTotalTimeAsPercent();
    const darkeningFactor = 2.67;
    const moreDark = darken * darkeningFactor;
    const backgroundColor = ColorBlender.lighten(
      CssVariables.workingTimeColor,
      100 - moreDark
    );

    return backgroundColor;
  }

  /**
   * Shows the navigation popover.
   * @param event Event originated by the clicked
   * control.
   */
  showPopover(event): void {
    const popover = this.popoverCtrl.create(
      "TimePopoverPage",
      this.year.checkings
    );
    popover.present({
      ev: event
    });
  }
}
