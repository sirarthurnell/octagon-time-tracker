import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentDayPage } from './current-day';

@NgModule({
  declarations: [
    CurrentDayPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentDayPage),
  ],
})
export class CurrentDayPageModule {}
