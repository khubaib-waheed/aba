import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VerificationService } from '../../../shared/services/verification.service';
import { AuthService } from '../../auth/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

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
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      BusinessName: ['', Validators.required],
      BusinessPhoneNumber: ['', Validators.required],
      BusinessEmail: ['', [Validators.required, Validators.email]],
      BusinessAddress: ['', Validators.required]
    });
  }

  onSubmit() {
    // if (this.businessForm.valid) {
    //   console.log('Form Submitted!', this.businessForm.value);
    // }

    this.verificationService.setFormData(this.businessForm.value);
    console.log(this.verificationService.getFormData())
    this.authService.userInformation(this.verificationService.getFormData()).subscribe({
      next: res => {
       console.log(res)
      },
      error: err => {
       this.toast.error(err.error.Message);
      }
    })
    this.router.navigate(['/auth/verification/subscription']);
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
