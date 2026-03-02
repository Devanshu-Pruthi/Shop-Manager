export interface Phone {
  id: string;
  brand: string;
  model: string;
  imeiNumber: string;
  price: number;
<<<<<<< HEAD
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  purchaseDate: Date | string;
  receivedAt?: Date | string; // System timestamp
=======
  condition: 'New' | 'Old';
  purchaseDate: Date;
}

export interface ExchangePhone {
  brand: string;
  model: string;
  imeiNumber: string;
  estimatedValue: number;
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
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
<<<<<<< HEAD
  phones: Phone[]; // These are the phones received FROM the customer
  totalValuation: number;
=======
  phones: Phone[];
  exchangePhones?: ExchangePhone[];
  totalPurchaseAmount: number;
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
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
