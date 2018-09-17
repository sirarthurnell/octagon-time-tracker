import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeekPage } from './week';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WeekPage,
  ],
  imports: [
    IonicPageModule.forChild(WeekPage), ComponentsModule
  ],
})
export class WeekPageModule {}
