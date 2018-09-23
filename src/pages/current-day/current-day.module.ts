import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentDayPage } from './current-day';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CurrentDayPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentDayPage),
    ComponentsModule,
    TranslateModule.forChild()
  ],
})
export class CurrentDayPageModule {}
