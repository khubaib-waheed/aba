import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  private verificationData = new BehaviorSubject<any>({}); // Store all form data
  formData$ = this.verificationData.asObservable(); // Observable to subscribe to

  // Set form data
  setFormData(data: any) {
    const currentData = this.verificationData.getValue();
    this.verificationData.next({ ...currentData, ...data });
  }

  // Get form data
  getFormData() {
    return this.verificationData.getValue();
  }
}
