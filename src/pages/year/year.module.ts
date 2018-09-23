import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearPage } from './year';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [YearPage],
  imports: [
    IonicPageModule.forChild(YearPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class YearPageModule {}
