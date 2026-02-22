import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Customer, Phone } from '../../models/customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  isEditMode = false;
  customerId: string | null = null;

  customer = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    referredBy: '',
    paymentMethod: 'Cash' as 'Cash' | 'Card' | 'UPI' | 'EMI',
    notes: '',
    adharNumber: '',
    adharPhotoFront: '',
    adharPhotoBack: ''
  };

  phones: Array<{
    id?: string;
    brand: string;
    model: string;
    imeiNumber: string;
    price: number;
    purchaseDate?: Date;
  }> = [{
    brand: '',
    model: '',
    imeiNumber: '',
    price: 0
  }];

  errorMessage = '';
  selectedFrontFileName = '';
  selectedBackFileName = '';
  showCamera = false;
  currentSide: 'front' | 'back' = 'front';
  videoStream: MediaStream | null = null;

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      const existingInCache = this.customerService.getCustomerById(this.customerId);
      if (existingInCache) {
        this.populateForm(existingInCache);
      } else {
        this.customerService.fetchCustomerById(this.customerId).subscribe({
          next: (found) => {
            this.populateForm(found);
          },
          error: () => {
            this.router.navigate(['/customers']);
          }
        });
      }
    }
  }

  populateForm(customer: Customer): void {
    this.customer = {
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      referredBy: customer.referredBy || '',
      paymentMethod: customer.paymentMethod,
      notes: customer.notes || '',
      adharNumber: customer.adharNumber || '',
      adharPhotoFront: customer.adharPhotoFront || '',
      adharPhotoBack: customer.adharPhotoBack || ''
    };

    if (customer.phones && customer.phones.length > 0) {
      this.phones = customer.phones.map(p => ({
        id: p.id,
        brand: p.brand,
        model: p.model,
        imeiNumber: p.imeiNumber,
        price: p.price,
        purchaseDate: p.purchaseDate
      }));
    }

    if (this.customer.adharPhotoFront) this.selectedFrontFileName = 'Existing Photo';
    if (this.customer.adharPhotoBack) this.selectedBackFileName = 'Existing Photo';
  }

  onFileSelected(event: any, side: 'front' | 'back'): void {
    const file = event.target.files[0];
    if (file) {
      if (side === 'front') {
        this.selectedFrontFileName = file.name;
      } else {
        this.selectedBackFileName = file.name;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (side === 'front') {
          this.customer.adharPhotoFront = e.target.result;
        } else {
          this.customer.adharPhotoBack = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  startCamera(side: 'front' | 'back'): void {
    this.currentSide = side;
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoStream = stream;
        setTimeout(() => {
          const videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        }, 100);
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
        this.errorMessage = "Could not access camera. Please check permissions.";
        this.showCamera = false;
      });
  }

  captureImage(): void {
    const videoElement = document.querySelector('video');
    const canvas = document.createElement('canvas');
    if (videoElement) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');

        if (this.currentSide === 'front') {
          this.customer.adharPhotoFront = imageData;
          this.selectedFrontFileName = 'Captured from Camera';
        } else {
          this.customer.adharPhotoBack = imageData;
          this.selectedBackFileName = 'Captured from Camera';
        }

        this.stopCamera();
      }
    }
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCamera = false;
  }

  addPhone(): void {
    this.phones.push({
      brand: '',
      model: '',
      imeiNumber: '',
      price: 0
    });
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const totalAmount = this.phones.reduce((sum, phone) => sum + Number(phone.price), 0);

    const phonesData: Phone[] = this.phones.map((phone, index) => ({
      id: phone.id || `P-${Date.now()}-${index}`,
      brand: phone.brand,
      model: phone.model,
      imeiNumber: phone.imeiNumber,
      price: Number(phone.price),
      purchaseDate: phone.purchaseDate || new Date()
    }));

    const customerData: Customer = {
      id: this.customerId || Date.now().toString(),
      name: this.customer.name,
      phoneNumber: this.customer.phoneNumber,
      email: this.customer.email,
      address: this.customer.address,
      city: this.customer.city,
      state: this.customer.state,
      referredBy: this.customer.referredBy || 'Direct',
      phones: phonesData,
      totalPurchaseAmount: totalAmount,
      paymentMethod: this.customer.paymentMethod,
      registrationDate: this.isEditMode ? new Date() : new Date(), // Should ideally persist original
      lastVisit: new Date(),
      notes: this.customer.notes,
      adharNumber: this.customer.adharNumber,
      adharPhotoFront: this.customer.adharPhotoFront,
      adharPhotoBack: this.customer.adharPhotoBack
    };

    if (this.isEditMode) {
      this.customerService.updateCustomer(customerData).subscribe({
        next: () => {
          this.toastService.success('Customer updated successfully');
          this.router.navigate(['/customer', this.customerId]);
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          this.toastService.error('Failed to update customer');
        }
      });
    } else {
      this.customerService.addCustomer(customerData).subscribe({
        next: () => {
          this.toastService.success('Customer added successfully');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          console.error('Error adding customer:', err);
          this.toastService.error('Failed to add customer');
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.customer.name.trim()) {
      this.errorMessage = 'Please enter customer name';
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!this.customer.phoneNumber.trim()) {
      this.errorMessage = 'Please enter phone number';
      return false;
    } else if (!phoneRegex.test(this.customer.phoneNumber.trim())) {
      this.errorMessage = 'Please enter a valid 10-digit phone number starting with 6-9';
      return false;
    }

    if (!this.customer.adharNumber.trim()) {
      this.errorMessage = 'Please enter Adhar Number';
      return false;
    }

    if (!this.customer.city.trim()) {
      this.errorMessage = 'Please enter city';
      return false;
    }

    for (let i = 0; i < this.phones.length; i++) {
      const phone = this.phones[i];
      if (!phone.brand.trim() || !phone.model.trim() || !phone.imeiNumber.trim() || phone.price <= 0) {
        this.errorMessage = `Please complete all fields for phone ${i + 1}`;
        return false;
      }
    }

    this.errorMessage = '';
    return true;
  }

  goBack(): void {
    if (this.isEditMode) {
      this.router.navigate(['/customer', this.customerId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
