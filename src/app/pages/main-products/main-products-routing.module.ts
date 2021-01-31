import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainProductsPage } from './main-products.page';

const routes: Routes = [
  {
    path: '',
    component: MainProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainProductsPageRoutingModule {}
