import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserOrdersPage } from './user-orders.page';

const routes: Routes = [
  {
    path: '',
    component: UserOrdersPage
  },
  {
    path:'patient/:id',
    component: UserOrdersPage
  },
  {
    path:'pharmacy/:id',
    component: UserOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOrdersPageRoutingModule {}
