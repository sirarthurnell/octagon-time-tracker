import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PAGES_LIST, PageData } from './pages-list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('navigation') nav: NavController;
  rootPage: any = 'MockPage';

  pages = PAGES_LIST;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {

      // Ionic bug with the status
      // bar on Android.
      if(platform.is('android')) {
        statusBar.styleBlackOpaque();
      } else {
        statusBar.styleDefault();
      }

      splashScreen.hide();
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

