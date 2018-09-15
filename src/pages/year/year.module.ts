import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearPage } from './year';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [YearPage],
  imports: [IonicPageModule.forChild(YearPage), ComponentsModule]
})
export class YearPageModule {}
