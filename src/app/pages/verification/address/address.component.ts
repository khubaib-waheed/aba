import { Component, OnInit } from '@angular/core';
import { CustomDropdownComponent } from '../../../shared/custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  imports: [RouterModule, CustomDropdownComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup = {} as FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      country: ['', Validators.required],
      street: ['', Validators.required],
      houseNo: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      console.log('Form Submitted!', this.addressForm.value);
    }
  }
}
