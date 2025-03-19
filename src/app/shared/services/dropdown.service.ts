import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  private manufacturers = new BehaviorSubject<any>([]); // Store all form data
  private carModels = new BehaviorSubject<any>([]); // Store all form data

  manufacturersData$ = this.manufacturers.asObservable(); // Observable to subscribe to
  carModelsData$ = this.carModels.asObservable(); // Observable to subscribe to

  // Set form data
  setManufacturerData(data: any) {
    this.manufacturers.next(data);
  }

  // Get form data
  getManufacturerData() {
    return this.manufacturers.getValue();
  }

  setCarModelData(data: any) {
    this.carModels.next(data);
  }

  // Get form data
  getCarModelData() {
    return this.carModels.getValue();
  }
}
