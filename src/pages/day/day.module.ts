import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayPage } from './day';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DayPage,
  ],
  imports: [
    IonicPageModule.forChild(DayPage),
    ComponentsModule
  ],
})
export class DayPageModule {}
