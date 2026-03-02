import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  pagination = {
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  };
  searchQuery = '';
  pageNumbers: number[] = [];
  private subs = new Subscription();
  private searchSubject = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initial population from Resolved Data
    const resolved = this.route.snapshot.data['customers'];
    if (resolved) {
      this.customers = resolved.customers;
      this.pagination = {
        page: resolved.page,
        pages: resolved.pages,
        total: resolved.total,
        limit: resolved.limit
      };
      this.updatePageNumbers();
    }

    // Subscribe to customer stream for updates
    this.subs.add(
      this.customerService.getCustomers().subscribe(customers => {
        this.customers = customers;
      })
    );

    // Subscribe to pagination metadata
    this.subs.add(
      this.customerService.getPagination().subscribe(p => {
        if (p) {
          this.pagination = p;
          this.updatePageNumbers();
        }
      })
    );

    // Debounced Search Logic
    this.subs.add(
      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(query => {
        this.customerService.fetchCustomers(1, 10, query).subscribe();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.pagination.pages) {
      this.customerService.fetchCustomers(newPage, this.pagination.limit, this.searchQuery).subscribe();
    }
  }

  updatePageNumbers(): void {
    const totalPages = this.pagination.pages;
    const currentPage = this.pagination.page;
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.pageNumbers = pages;
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
