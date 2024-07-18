import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactiveService } from 'src/services/deactive.service';
import { AuthGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { TableDetailComponent } from './table-detail/table-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: TableDetailComponent, canDeactivate: [DeactiveService], canActivate: [AuthGuard] },
  { path: 'products', component: ProductManagementComponent, canActivate: [AuthGuard] },
  { path: 'order-list', component: OrderSummaryComponent, canActivate: [AuthGuard] },
  // { path: 'rootPath/', component: TableDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
