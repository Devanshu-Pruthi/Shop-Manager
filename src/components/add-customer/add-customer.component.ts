import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Customer, Phone } from '../../models/customer.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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
    paymentMethod: 'Cash' as 'Cash' | 'Card' | 'UPI' | 'EMI' | 'Replacement',
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
<<<<<<< HEAD
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    purchaseDate?: Date | string;
    receivedAt?: Date | string;
=======
    condition: 'New' | 'Old';
    purchaseDate?: Date;
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
  }> = [{
    brand: '',
    model: '',
    imeiNumber: '',
    price: 0,
<<<<<<< HEAD
    condition: 'Good'
  }];

=======
    condition: 'New'
  }];

  exchangePhones: Array<{
    brand: string;
    model: string;
    imeiNumber: string;
    estimatedValue: number;
  }> = [];

>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
  errorMessage = '';
  selectedFrontFileName = '';
  selectedBackFileName = '';

  // Used for browser camera stream preview
  showCamera = false;
  currentSide: 'front' | 'back' = 'front';
  videoStream: MediaStream | null = null;

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
<<<<<<< HEAD
        condition: p.condition || 'Good' as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        purchaseDate: p.purchaseDate,
        receivedAt: p.receivedAt
=======
        condition: p.condition || 'New' as 'New' | 'Old',
        purchaseDate: p.purchaseDate
      }));
    }

    if (customer.exchangePhones && customer.exchangePhones.length > 0) {
      this.exchangePhones = customer.exchangePhones.map(ep => ({
        brand: ep.brand,
        model: ep.model,
        imeiNumber: ep.imeiNumber,
        estimatedValue: ep.estimatedValue
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
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
        this.cdr.detectChanges(); // Force UI update immediately
      };
      reader.readAsDataURL(file);
    }
  }

  clearPhoto(side: 'front' | 'back'): void {
    if (side === 'front') {
      this.customer.adharPhotoFront = '';
      this.selectedFrontFileName = '';
    } else {
      this.customer.adharPhotoBack = '';
      this.selectedBackFileName = '';
    }
  }

  async takePicture(side: 'front' | 'back'): Promise<void> {
    this.errorMessage = '';
    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android / iOS — use Capacitor Camera plugin
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera
        });
        const base64Image = `data:image/jpeg;base64,${image.base64String}`;
        if (side === 'front') {
          this.customer.adharPhotoFront = base64Image;
          this.selectedFrontFileName = 'Captured from Camera';
        } else {
          this.customer.adharPhotoBack = base64Image;
          this.selectedBackFileName = 'Captured from Camera';
        }
        this.cdr.detectChanges(); // Force UI update immediately for native capture
      } else {
        // Web browser — show live camera stream preview
        this.currentSide = side;
        this.showCamera = true;
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        this.videoStream = stream;
        setTimeout(() => {
          const videoElement = document.querySelector('video') as HTMLVideoElement;
          if (videoElement) videoElement.srcObject = stream;
        }, 100);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      this.showCamera = false;
      this.errorMessage = 'Camera access denied. Please allow camera permission in your browser settings.';
    }
  }

  captureImage(): void {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    if (videoElement) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
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
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
    this.showCamera = false;
  }

  addPhone(): void {
    this.phones.push({
      brand: '',
      model: '',
      imeiNumber: '',
      price: 0,
<<<<<<< HEAD
      condition: 'Good'
=======
      condition: 'New'
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
    });
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }

<<<<<<< HEAD
=======
  addExchangePhone(): void {
    this.exchangePhones.push({
      brand: '',
      model: '',
      imeiNumber: '',
      estimatedValue: 0
    });
  }

  removeExchangePhone(index: number): void {
    this.exchangePhones.splice(index, 1);
  }

>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

<<<<<<< HEAD
    const totalValuationValue = this.phones.reduce((sum, phone) => sum + Number(phone.price), 0);
=======
    const totalAmount = this.phones.reduce((sum, phone) => sum + Number(phone.price), 0);
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

    const phonesData: Phone[] = this.phones.map((phone, index) => ({
      id: phone.id || `P-${Date.now()}-${index}`,
      brand: phone.brand,
      model: phone.model,
      imeiNumber: phone.imeiNumber,
      price: Number(phone.price),
      condition: phone.condition,
<<<<<<< HEAD
      purchaseDate: phone.purchaseDate || new Date(),
      receivedAt: phone.receivedAt || new Date()
=======
      purchaseDate: phone.purchaseDate || new Date()
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
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
<<<<<<< HEAD
      totalValuation: totalValuationValue,
=======
      exchangePhones: this.customer.paymentMethod === 'Replacement' ? this.exchangePhones : [],
      totalPurchaseAmount: totalAmount,
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000
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

    // if (!this.customer.city.trim()) {
    //   this.errorMessage = 'Please enter city';
    //   return false;
    // }

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
