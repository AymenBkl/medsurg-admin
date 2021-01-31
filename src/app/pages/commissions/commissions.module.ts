import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommissionsPageRoutingModule } from './commissions-routing.module';

import { CommissionsPage } from './commissions.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommissionsPageRoutingModule,
    ShareModule,
  ],
  declarations: [CommissionsPage]
})
export class CommissionsPageModule {}
