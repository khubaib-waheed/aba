import { Component, OnInit } from '@angular/core';
import { CustomDropdownComponent } from '../../../shared/custom-dropdown/custom-dropdown.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerificationService } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-address',
  imports: [RouterModule, CustomDropdownComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup = {} as FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      Country: ['', Validators.required],
      Street: ['', Validators.required],
      HouseNumber: ['', Validators.required],
      Address: ['', Validators.required],
      PostalCode: ['', Validators.required],
      City: ['', Validators.required]
    });
  }

  onSubmit() {
    // if (this.addressForm.valid) {
    //   console.log('Form Submitted!', this.addressForm.value);
    // }

    this.verificationService.setFormData(this.addressForm.value);
    this.router.navigate(['/auth/verification/documents']);
  }
}
