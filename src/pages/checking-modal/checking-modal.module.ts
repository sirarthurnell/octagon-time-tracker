import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckingModalPage } from './checking-modal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CheckingModalPage],
  imports: [
    IonicPageModule.forChild(CheckingModalPage),
    TranslateModule.forChild()
  ]
})
export class CheckingModalPageModule {}
