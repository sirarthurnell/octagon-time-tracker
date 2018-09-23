import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimePopoverPage } from './time-popover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TimePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(TimePopoverPage),
    TranslateModule.forChild()
  ],
})
export class TimePopoverPageModule {}
