import { NgModule } from '@angular/core';

import { TimeGaugeComponent } from './time-gauge/time-gauge.component';
import { CommonModule } from '@angular/common';
import { PageMenuComponent } from './page-menu/page-menu.component';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [TimeGaugeComponent, PageMenuComponent],
  imports: [CommonModule, IonicModule],
  exports: [TimeGaugeComponent, PageMenuComponent]
})
export class ComponentsModule {}
