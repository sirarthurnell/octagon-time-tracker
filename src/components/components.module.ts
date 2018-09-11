import { NgModule } from '@angular/core';

import { TimeGaugeComponent } from './time-gauge/time-gauge.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TimeGaugeComponent],
  imports: [CommonModule],
  exports: [TimeGaugeComponent]
})
export class ComponentsModule {}
