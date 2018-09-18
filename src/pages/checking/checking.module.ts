import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckingPage } from './checking';

@NgModule({
  declarations: [
    CheckingPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckingPage),
  ],
})
export class CheckingPageModule {}
