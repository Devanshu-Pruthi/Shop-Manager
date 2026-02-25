export interface Phone {
  id: string;
  brand: string;
  model: string;
  imeiNumber: string;
  price: number;
  condition: 'New' | 'Old';
  purchaseDate: Date;
}

export interface ExchangePhone {
  brand: string;
  model: string;
  imeiNumber: string;
  estimatedValue: number;
}

export interface Customer {
  id: string;
  _id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  referredBy?: string;
  phones: Phone[];
  exchangePhones?: ExchangePhone[];
  totalPurchaseAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'EMI' | 'Replacement';
  registrationDate: Date;
  lastVisit: Date;
  notes?: string;
  adharNumber?: string;
  adharPhotoFront?: string; // Base64 encoded image
  adharPhotoBack?: string; // Base64 encoded image
  createdBy?: { id: string; name: string; role: string };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
