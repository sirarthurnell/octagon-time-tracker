import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MockPage } from './mock.page';
import { TimeGaugeComponent } from '../../components/time-gauge/time-gauge.component';

const routes: Routes = [
  {
    path: '',
    component: MockPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MockPage,
    TimeGaugeComponent
  ]
})
export class MockPageModule {}
