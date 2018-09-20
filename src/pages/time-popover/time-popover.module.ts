import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimePopoverPage } from './time-popover';

@NgModule({
  declarations: [
    TimePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(TimePopoverPage),
  ],
})
export class TimePopoverPageModule {}
