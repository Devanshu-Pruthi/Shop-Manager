import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer | undefined;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerService.fetchCustomerById(id).subscribe({
        next: (customer) => {
          this.customer = customer;
        },
        error: () => {
          this.toastService.error('Customer not found');
          this.router.navigate(['/customers']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  navigateToEdit(): void {
    if (this.customer) {
      this.router.navigate(['/edit-customer', this.customer.id]);
    }
  }

  deleteCustomer(): void {
    if (!this.isAdmin) {
      this.toastService.error('You do not have permission to delete customers.');
      return;
    }

    if (this.customer && confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(this.customer.id).subscribe({
        next: () => {
          this.toastService.success('Customer deleted successfully');
          this.router.navigate(['/customers']);
        },
        error: (err: any) => {
          console.error('Delete failed', err);
          this.toastService.error('Delete failed: ' + err.message);
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
