import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer, Phone } from '../../models/customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent {
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
    brand: string;
    model: string;
    imeiNumber: string;
    price: number;
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

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  startCamera(side: 'front' | 'back'): void {
    this.currentSide = side;
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoStream = stream;
        // Use a timeout to ensure the video element exists after the View updates
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
      id: `${Date.now()}-${index}`,
      brand: phone.brand,
      model: phone.model,
      imeiNumber: phone.imeiNumber,
      price: Number(phone.price),
      purchaseDate: new Date()
    }));

    const newCustomer: Customer = {
      id: Date.now().toString(),
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
      registrationDate: new Date(),
      lastVisit: new Date(),
      notes: this.customer.notes,
      adharNumber: this.customer.adharNumber,
      adharPhotoFront: this.customer.adharPhotoFront,
      adharPhotoBack: this.customer.adharPhotoBack
    };

    this.customerService.addCustomer(newCustomer);
    this.router.navigate(['/customers']);
  }

  validateForm(): boolean {
    if (!this.customer.name.trim()) {
      this.errorMessage = 'Please enter customer name';
      return false;
    }

    if (!this.customer.phoneNumber.trim()) {
      this.errorMessage = 'Please enter phone number';
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
    this.router.navigate(['/dashboard']);
  }
}
