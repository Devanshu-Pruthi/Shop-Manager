import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { authGuard } from './guards/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App { }

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
      { path: 'add-customer', component: AddCustomerComponent, canActivate: [authGuard] },
      { path: 'customer/:id', component: CustomerDetailsComponent, canActivate: [authGuard] },
      { path: '**', redirectTo: '/login' }
    ])
  ]
});
