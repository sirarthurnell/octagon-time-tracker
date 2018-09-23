import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayPage } from './day';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DayPage,
  ],
  imports: [
    IonicPageModule.forChild(DayPage),
    ComponentsModule,
    TranslateModule.forChild()
  ],
})
export class DayPageModule {}
