import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NavController, Platform } from 'ionic-angular';
import { StateProvider } from '../providers/state/state';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Main component of the application.
 * It contains the side menu too.
 */
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('navigation')
  nav: NavController;
  rootPage: any = 'CurrentDayPage';

  currentMonthLabel = '';
  currentDayLabel = '';
  currentYearLabel = '';
  currentWeekLabel = '';

  private changeSubscription: Subscription;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private state: StateProvider
  ) {
    platform.ready().then(() => {
      // Ionic bug with Android's status bar.
      if (platform.is('android')) {
        statusBar.styleBlackOpaque();
      } else {
        statusBar.styleDefault();
      }

      this.prepareTranslations();
      this.listenToStateChanges();

      splashScreen.hide();
    });
  }

  ionViewWillUnload() {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Prepares the translations.
   */
  private prepareTranslations(): void {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  /**
   * Listens to state changes.
   */
  private listenToStateChanges(): void {
    this.changeSubscription = this.state.change$.subscribe(change => {
      if (change && !change.isEmpty()) {
        this.currentDayLabel = `${change.month.name} ${change.day.dayNumber}`;
        this.currentWeekLabel = change.week.name;
        this.currentMonthLabel = change.month.name;
        this.currentYearLabel = change.year.yearNumber.toString();
      }
    });
  }

  /**
   * Navigates to the specified page.
   * @param page Page data.
   */
  navigateTo(page: string): void {
    this.nav.setRoot(page);
  }
}
