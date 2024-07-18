import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactiveService } from 'src/services/deactive.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { TableDetailComponent } from '../table-detail/table-detail.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: TableDetailComponent, canDeactivate: [DeactiveService] },
  { path: 'products', component: ProductManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
