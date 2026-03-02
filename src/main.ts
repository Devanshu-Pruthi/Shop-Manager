import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, RouterOutlet, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { authGuard } from './guards/auth.guard';
import { customerResolver } from './resolvers/customer.resolver';
import { LoaderComponent } from './components/loader/loader.component';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { ManageStaffComponent } from './components/manage-staff/manage-staff.component';
import { adminGuard } from './guards/admin.guard';
import { ToastComponent } from './components/toast/toast.component';
import { App as CapApp } from '@capacitor/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, ToastComponent],
  template: `
    <app-loader></app-loader>
    <app-toast></app-toast>
    <router-outlet></router-outlet>
  `
})
export class App {
  constructor(private location: Location, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (this.router.url === '/dashboard' || this.router.url === '/login') {
        CapApp.exitApp();
      } else {
        this.location.back();
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    ),
    provideRouter([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], resolve: { customers: customerResolver } },
      { path: 'manage-staff', component: ManageStaffComponent, canActivate: [authGuard, adminGuard] },
      { path: 'customers', component: CustomersComponent, canActivate: [authGuard], resolve: { customers: customerResolver } },
      { path: 'add-customer', component: AddCustomerComponent, canActivate: [authGuard] },
      { path: 'edit-customer/:id', component: AddCustomerComponent, canActivate: [authGuard] },
      { path: 'customer/:id', component: CustomerDetailsComponent, canActivate: [authGuard] },
      { path: '**', redirectTo: '/login' }
    ])
  ]
});
