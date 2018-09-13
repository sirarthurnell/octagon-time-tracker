import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentDayPage } from './current-day';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CurrentDayPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentDayPage),
    ComponentsModule
  ],
})
export class CurrentDayPageModule {}
