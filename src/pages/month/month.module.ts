import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthPage } from './month';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MonthPage],
  imports: [
    IonicPageModule.forChild(MonthPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class MonthPageModule {}
