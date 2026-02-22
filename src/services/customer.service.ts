import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Customer } from '../models/customer.model';

export interface PaginatedCustomers {
  customers: Customer[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:5000/api/customers';
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private paginationSubject = new BehaviorSubject<any>(null);
  private statsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  // Fetch paginated customers
  public fetchCustomers(page: number = 1, limit: number = 10, keyword: string = ''): Observable<PaginatedCustomers> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => ({
        ...res,
        customers: res.customers.map((c: any) => ({
          ...c,
          id: (c.id || c._id) as string
        }))
      })),
      tap(res => {
        this.customersSubject.next(res.customers);
        this.paginationSubject.next({
          page: res.page,
          pages: res.pages,
          total: res.total,
          limit: res.limit
        });
      })
    );
  }

  // Fetch true statistics from backend
  public fetchStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      tap(stats => this.statsSubject.next(stats))
    );
  }

  // Fetch single customer by ID
  public fetchCustomerById(id: string): Observable<Customer> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(c => ({
        ...c,
        id: (c.id || c._id) as string
      }))
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getPagination() {
    return this.paginationSubject.asObservable();
  }

  getStatsStream() {
    return this.statsSubject.asObservable();
  }

  // Temporary sync getter for existing components
  getStatistics() {
    return this.statsSubject.value || {
      totalCustomers: 0,
      totalPhonesSold: 0,
      totalRevenue: 0,
      recentCustomers: []
    };
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customersSubject.value.find(c => c.id === id);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<any>(this.apiUrl, customer).pipe(
      map(newCustomer => ({
        ...newCustomer,
        id: (newCustomer.id || newCustomer._id) as string
      })),
      tap(() => this.refreshData())
    );
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<any>(`${this.apiUrl}/${customer.id}`, customer).pipe(
      map(updated => ({
        ...updated,
        id: (updated.id || updated._id) as string
      })),
      tap(() => this.refreshData())
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshData())
    );
  }

  private refreshData(): void {
    this.refreshCustomers();
    this.fetchStatistics().subscribe();
  }

  public refreshCustomers(): void {
    const current = this.paginationSubject.value;
    const page = current ? current.page : 1;
    const limit = current ? current.limit : 10;
    this.fetchCustomers(page, limit).subscribe();
  }
}
