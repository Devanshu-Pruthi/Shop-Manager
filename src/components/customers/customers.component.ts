import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchQuery = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomers = customers;
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = this.customers;
      return;
    }

    this.filteredCustomers = this.customerService.searchCustomers(this.searchQuery);
  }

  viewCustomerDetails(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  addCustomer(): void {
    this.router.navigate(['/add-customer']);
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
