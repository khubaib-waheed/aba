import { Component, OnInit } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { Router, RouterModule } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-sign-up',
  imports: [RouterModule, CustomDropdownComponent, NgOtpInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = {} as FormGroup;
  tokenUuid: string = '';
  otp: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Source: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]}, { validators: this.matchPasswords });
      
  }

  // Custom Validator to check if Password & Confirm Password match
  matchPasswords(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  goToSecretQuestion() {
    this.router.navigate(['/auth/secret-question'])
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  openModal(modalName: string): void {
    $(modalName).modal('show'); // Open modal
  }

  closeModal(modalName: string): void {
    $(modalName).modal('hide'); // Close modal
  }

  onSubmit() {
    // if (this.signUpForm.valid) {
    //   console.log('Form Submitted!', this.signUpForm.value);
    // }
    console.log('Form Submitted!', this.signUpForm.value);

    this.authService.signUp(this.signUpForm.value).subscribe({
      next: res => {
        this.tokenUuid = res.TokenUuid;
        this.openModal('#otp-modal');
      },
      error: err => {
        console.log(err)
      }
    })
  }

  sendOTP() {
    console.log(this.otp)
    console.log(this.tokenUuid)
    this.authService.verifyCode({Code: this.otp, TokenUuid: this.tokenUuid}).subscribe({
      next: res => {
        this.closeModal('#otp-modal');
        this.tokenUuid = res.TokenUuid;
        this.authService.setToken(res.TokenUuid)
        this.openModal('#email-verified-modal');
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
