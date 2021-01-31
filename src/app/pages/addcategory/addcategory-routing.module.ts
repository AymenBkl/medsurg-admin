import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddcategoryPage } from './addcategory.page';

const routes: Routes = [
  {
    path: '',
    component: AddcategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddcategoryPageRoutingModule {}
