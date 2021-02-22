import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmacyListPageRoutingModule } from './pharmacy-list-routing.module';

import { PharmacyListPage } from './pharmacy-list.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PharmacyListPageRoutingModule,
    ShareModule,
  ],
  declarations: [PharmacyListPage]
})
export class PharmacyListPageModule {}
