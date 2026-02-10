import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statistics = {
    totalCustomers: 0,
    totalPhonesSold: 0,
    totalRevenue: 0,
    recentCustomers: [] as Customer[]
  };
  username = '';

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.statistics = this.customerService.getStatistics();
  }

  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  navigateToAddCustomer(): void {
    this.router.navigate(['/add-customer']);
  }

  viewCustomerDetails(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
