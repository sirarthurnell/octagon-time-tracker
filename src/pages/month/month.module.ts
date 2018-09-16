import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthPage } from './month';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [MonthPage],
  imports: [IonicPageModule.forChild(MonthPage), ComponentsModule]
})
export class MonthPageModule {}
