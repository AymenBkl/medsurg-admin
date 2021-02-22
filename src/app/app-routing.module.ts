import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate : [AuthGuard]
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'addproduct',
    loadChildren: () => import('./pages/addproduct/addproduct.module').then( m => m.AddproductPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'prescriptions',
    loadChildren: () => import('./pages/prescriptions/prescriptions.module').then( m => m.PrescriptionsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then( m => m.MessagesPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'referal',
    loadChildren: () => import('./pages/referalpage/referalpage.module').then( m => m.ReferalpagePageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'mainproducts',
    loadChildren: () => import('./pages/main-products/main-products.module').then( m => m.MainProductsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'addcategory',
    loadChildren: () => import('./pages/addcategory/addcategory.module').then( m => m.AddcategoryPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'refund',
    loadChildren: () => import('./pages/refund/refund.module').then( m => m.RefundPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'commissions',
    loadChildren: () => import('./pages/commissions/commissions.module').then( m => m.CommissionsPageModule),
    canActivate : [AuthGuard]

  },
  {
    path: 'patient-list',
    loadChildren: () => import('./pages/patient-list/patient-list.module').then( m => m.PatientListPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'user-orders',
    loadChildren: () => import('./pages/user-orders/user-orders.module').then( m => m.UserOrdersPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
