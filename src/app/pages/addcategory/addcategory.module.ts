import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddcategoryPageRoutingModule } from './addcategory-routing.module';

import { AddcategoryPage } from './addcategory.page';
import { ShareModule } from '../../components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddcategoryPageRoutingModule,
    ReactiveFormsModule,
    ShareModule
  ],
  declarations: [AddcategoryPage]
})
export class AddcategoryPageModule {}
