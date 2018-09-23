import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeekPage } from './week';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WeekPage],
  imports: [
    IonicPageModule.forChild(WeekPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class WeekPageModule {}
