import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableDetailComponent } from './table-detail/table-detail.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './core/confirmation-dialog/confirmation-dialog.component';
import { MoneyCommaPipe } from 'src/pipes/money-comma.pipe';
import { AutoFocus } from './core/directives/focus-input.directive';
import { LoginFormComponent } from './login-form/login-form.component';
import { CategoryPipe } from 'src/pipes/category.pipe';
import { CheckOutComponent } from './check-out/check-out.component';
import { DatePipe } from '@angular/common';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ShiftControlComponent } from './shift-control/shift-control.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth-interceptor';
import { ReceiptComponent } from './check-out/receipt.component';
import { BarPaperComponent } from './check-out/bar-paper.component';
import { NgxPrintModule } from 'ngx-print';
import { CouponComponent } from './table-detail/coupon.component';
import { ReprintReceiptComponent } from './check-out/reprint-receipt.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableDetailComponent,
    ProductManagementComponent,
    ConfirmationDialogComponent,
    MoneyCommaPipe,
    AutoFocus,
    LoginFormComponent,
    CategoryPipe,
    CheckOutComponent,
    OrderSummaryComponent,
    ShiftControlComponent,
    ReceiptComponent,
    BarPaperComponent,
    CouponComponent,
    ReprintReceiptComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
  ],
  providers: [ { provide: DatePipe}, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
