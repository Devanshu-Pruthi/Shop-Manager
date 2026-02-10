import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, Phone } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = this.getMockCustomers();
  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  searchCustomers(query: string): Customer[] {
    const lowerQuery = query.toLowerCase();
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phoneNumber.includes(query) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.phones.some(phone => phone.imeiNumber.includes(query))
    );
  }

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
    this.customersSubject.next(this.customers);
  }

  updateCustomer(customer: Customer): void {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      this.customers[index] = customer;
      this.customersSubject.next(this.customers);
    }
  }

  deleteCustomer(id: string): void {
    this.customers = this.customers.filter(c => c.id !== id);
    this.customersSubject.next(this.customers);
  }

  getStatistics() {
    return {
      totalCustomers: this.customers.length,
      totalPhonesSold: this.customers.reduce((sum, c) => sum + c.phones.length, 0),
      totalRevenue: this.customers.reduce((sum, c) => sum + c.totalPurchaseAmount, 0),
      recentCustomers: this.customers.slice(-5).reverse()
    };
  }

  private getMockCustomers(): Customer[] {
    return [
      {
        id: '1',
        name: 'Rajesh Kumar',
        phoneNumber: '+91 98765 43210',
        email: 'rajesh.kumar@email.com',
        address: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        referredBy: 'Walk-in',
        phones: [
          {
            id: 'p1',
            brand: 'Samsung',
            model: 'Galaxy S23',
            imeiNumber: '352094101234567',
            price: 74999,
            purchaseDate: new Date('2024-01-15')
          }
        ],
        totalPurchaseAmount: 74999,
        paymentMethod: 'UPI',
        registrationDate: new Date('2024-01-15'),
        lastVisit: new Date('2024-01-15'),
        notes: 'Interested in accessories'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        phoneNumber: '+91 87654 32109',
        email: 'priya.sharma@email.com',
        address: '45 Park Street',
        city: 'Delhi',
        state: 'Delhi',
        referredBy: 'Facebook Ad',
        phones: [
          {
            id: 'p2',
            brand: 'Apple',
            model: 'iPhone 15 Pro',
            imeiNumber: '359204101234568',
            price: 134900,
            purchaseDate: new Date('2024-02-01')
          },
          {
            id: 'p3',
            brand: 'Apple',
            model: 'iPhone 14',
            imeiNumber: '359204101234569',
            price: 69900,
            purchaseDate: new Date('2024-02-01')
          }
        ],
        totalPurchaseAmount: 204800,
        paymentMethod: 'Card',
        registrationDate: new Date('2024-02-01'),
        lastVisit: new Date('2024-02-01'),
        notes: 'Bought for family members'
      },
      {
        id: '3',
        name: 'Amit Patel',
        phoneNumber: '+91 76543 21098',
        email: 'amit.patel@email.com',
        address: '78 Station Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        referredBy: 'Friend',
        phones: [
          {
            id: 'p4',
            brand: 'OnePlus',
            model: '11R',
            imeiNumber: '352094101234570',
            price: 39999,
            purchaseDate: new Date('2024-01-20')
          }
        ],
        totalPurchaseAmount: 39999,
        paymentMethod: 'EMI',
        registrationDate: new Date('2024-01-20'),
        lastVisit: new Date('2024-01-20')
      }
    ];
  }
}
