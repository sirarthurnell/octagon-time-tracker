import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PAGES_LIST, PageData } from './pages-list';
import { StateProvider } from '../providers/state/state';
import { TimeStorageProvider } from '../providers/time-storage/time-storage';
import { Year } from '../models/time/year';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('navigation')
  nav: NavController;
  rootPage: any = 'MockPage';

  pages = PAGES_LIST;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: TimeStorageProvider,
    state: StateProvider
  ) {
    platform.ready().then(() => {

      // Ionic bug with the status
      // bar on Android.
      if (platform.is('android')) {
        statusBar.styleBlackOpaque();
      } else {
        statusBar.styleDefault();
      }

      // Load state.
      const today = new Date();
      Year.getYear(storage, today.getFullYear()).subscribe(year => {
        const month = year.months[today.getMonth()];
        const day = month.days[today.getDate() + 1];
        const week = month.weeks.filter(currentWeek => currentWeek.days.indexOf(day) > -1)[0];
        state.setCurrent(year, month, week, day);
        splashScreen.hide();
      });
    });
  }

  /**
   * Navigates to the specified page.
   * @param pageData Page data.
   */
  navigateTo(pageData: PageData): void {
    this.nav.setRoot(pageData.name);
  }
}
