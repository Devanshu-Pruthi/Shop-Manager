import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { Observable } from 'rxjs';

import { PaginatedCustomers } from '../services/customer.service';

export const customerResolver: ResolveFn<PaginatedCustomers> = (route, state) => {
    const customerService = inject(CustomerService);
    return customerService.fetchCustomers(1, 10);
};
