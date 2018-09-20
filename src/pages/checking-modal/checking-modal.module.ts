import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckingModalPage } from './checking-modal';

@NgModule({
  declarations: [
    CheckingModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckingModalPage),
  ],
})
export class CheckingModalPageModule {}
