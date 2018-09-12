import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthPage } from './month';

@NgModule({
  declarations: [
    MonthPage,
  ],
  imports: [
    IonicPageModule.forChild(MonthPage),
  ],
})
export class MonthPageModule {}
