import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MockPage } from './mock';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MockPage
  ],
  imports: [
    IonicPageModule.forChild(MockPage),
    ComponentsModule
  ],
})
export class MockPageModule {}
