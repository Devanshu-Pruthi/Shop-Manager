export interface Phone {
  id: string;
  brand: string;
  model: string;
  imeiNumber: string;
  price: number;
  purchaseDate: Date;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  referredBy?: string;
  phones: Phone[];
  totalPurchaseAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'EMI';
  registrationDate: Date;
  lastVisit: Date;
  notes?: string;
}
