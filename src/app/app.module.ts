import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { EmailComposer } from '@ionic-native/email-composer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { SettingsProvider } from '../providers/settings/settings';
import { StateProvider } from '../providers/state/state';
import { TimeStorageProvider } from '../providers/time-storage/time-storage';
import { ExportProvider } from '../providers/export/export';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    EmailComposer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SettingsProvider,
    StateProvider,
    TimeStorageProvider,
    ExportProvider
  ]
})
export class AppModule {}
