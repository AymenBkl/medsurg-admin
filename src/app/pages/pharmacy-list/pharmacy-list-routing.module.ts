import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PharmacyListPage } from './pharmacy-list.page';

const routes: Routes = [
  {
    path: '',
    component: PharmacyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyListPageRoutingModule {}
