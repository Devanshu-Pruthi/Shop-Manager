import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = {
    totalCustomers: 0,
    totalPhonesSold: 0,
    totalRevenue: 0,
    recentCustomers: [] as Customer[]
  };
  username = '';
  isAdmin = false;
  private subs = new Subscription();

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isAdmin = this.authService.isAdmin();

    // Fetch accurate stats from backend
    this.customerService.fetchStatistics().subscribe(stats => {
      this.statistics = stats;
    });

    // Handle updates if needed
    this.subs.add(
      this.customerService.getStatsStream().subscribe(stats => {
        if (stats) this.statistics = stats;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  navigateToAddCustomer(): void {
    this.router.navigate(['/add-customer']);
  }

  navigateToManageStaff(): void {
    this.router.navigate(['/manage-staff']);
  }

  viewCustomerDetails(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatCurrency(amount: number): string {
    if (!amount) return '₹0';
    return '₹' + amount.toLocaleString('en-IN');
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
