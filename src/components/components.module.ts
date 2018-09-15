import { NgModule } from '@angular/core';

import { TimeGaugeComponent } from './time-gauge/time-gauge.component';
import { CommonModule } from '@angular/common';
import { PreviousNextComponent } from './previous-next/previous-next';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [TimeGaugeComponent, PreviousNextComponent],
  imports: [CommonModule, IonicModule],
  exports: [TimeGaugeComponent, PreviousNextComponent]
})
export class ComponentsModule {}
