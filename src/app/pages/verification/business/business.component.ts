import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-business',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent implements OnInit {
  businessForm: FormGroup = {} as FormGroup;
  file: string | null = null;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      companyName: ['', Validators.required],
      companyPhoneNo: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyAddress: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.businessForm.valid) {
      console.log('Form Submitted!', this.businessForm.value);
    }
  }
  

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileName = input.files[0].name;
      this.file = fileName;
    }
  }

  removeFile(): void {
    this.file = null;
  }
}
