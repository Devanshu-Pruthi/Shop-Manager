import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Customer, Phone } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/api/customers';
  private customers: Customer[] = [];
  private customersSubject = new BehaviorSubject<Customer[]>([]);

  constructor(private http: HttpClient) {
    this.refreshCustomers();
  }

  private refreshCustomers(): void {
    this.http.get<Customer[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.customers = data;
        this.customersSubject.next(this.customers);
      },
      error: (err) => console.error('Error fetching customers:', err)
    });
  }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  getStatistics() {
    return {
      totalCustomers: this.customers.length,
      totalPhonesSold: this.customers.reduce((sum, c) => sum + c.phones.length, 0),
      totalRevenue: this.customers.reduce((sum, c) => sum + c.totalPurchaseAmount, 0),
      recentCustomers: this.customers.slice(-5).reverse()
    };
  }

  searchCustomers(query: string): Customer[] {
    const lowerQuery = query.toLowerCase();
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phoneNumber.includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(lowerQuery)) ||
      customer.phones.some(phone => phone.imeiNumber.includes(query))
    );
  }

  addCustomer(customer: Customer): void {
    this.http.post<Customer>(this.apiUrl, customer).subscribe({
      next: (newCustomer) => {
        this.customers.push(newCustomer);
        this.customersSubject.next(this.customers);
      },
      error: (err) => console.error('Error adding customer:', err)
    });
  }

  updateCustomer(customer: Customer): void {
    this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer).subscribe({
      next: (updatedCustomer) => {
        const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;
          this.customersSubject.next(this.customers);
        }
      },
      error: (err) => console.error('Error updating customer:', err)
    });
  }

  deleteCustomer(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.customers = this.customers.filter(c => c.id !== id);
        this.customersSubject.next(this.customers);
      },
      error: (err) => console.error('Error deleting customer:', err)
    });
  }
}

