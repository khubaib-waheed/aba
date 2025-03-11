import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-sign-in',
  imports: [RouterModule, CommonModule, CustomDropdownComponent, NgOtpInputModule, ReactiveFormsModule ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup = {} as FormGroup;
  emailForm: FormGroup = {} as FormGroup;
  questionForm: FormGroup = {} as FormGroup;
  resetPasswordForm: FormGroup = {} as FormGroup;

  isPasswordVisible = false;
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
    this.signInForm = this.fb.group({
      password: ['', Validators.required],  // Required field
      email: ['', [Validators.required, Validators.email]] // Required & must be valid email
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.questionForm = this.fb.group({
      secretQuestion1: ['', Validators.required],
      SecretQuestion1Answer: ['', Validators.required],
      secretQuestion2: ['', Validators.required],
      SecretQuestion2Answer: ['', Validators.required]
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]}, 
      { validators: this.matchPasswords }
    )
  }

  // Custom Validator to check if Password & Confirm Password match
  matchPasswords(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    // if (this.signInForm.valid) {
    //   console.log(this.signInForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }

    console.log(this.signInForm.value)

    this.authService.signIn({userNameOrEmail: '', password: ''}).subscribe({
      next: res => {
        this.router.navigate(['/app/home']);
      },
      error: err => {
  
      }
    })
  }

  onSubmitEmail() {
    // if (this.emailForm.valid) {
    //   console.log(this.emailForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }

    console.log(this.emailForm.value);

    this.closeModal('#email-modal');
    this.openModal('#otp-modal');


    this.authService.forgotPassword({UserNameOrEmail: ''}).subscribe({
      next: res => {
        
      },
      error: err => {
  
      }
    })

  }

  sendOTP() {
    this.closeModal('#otp-modal');
    this.openModal('#question-modal');
    this.authService.verifyForgotPasswordCode({code: '', tokenUuid: ''}).subscribe({
      next: res => {

      },
      error: err => {

      }
    })
  }

  onSubmitQuestion() {
    // if (this.questionForm.valid) {
    //   console.log(this.questionForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }
    console.log(this.questionForm.value)
    this.closeModal('#question-modal');
    this.openModal('#reset-modal');
    this.authService.verifySecretQuestion({password: '', tokenUuid: ''}).subscribe({
      next: res => {

      },
      error: err => {

      }
    })
  }

  onSubmitResetPassword() {
    // if (this.resetPasswordForm.valid) {
    //   console.log(this.resetPasswordForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }

    console.log(this.resetPasswordForm.value)
    this.closeModal('#reset-modal');
    this.authService.resetPassword({value: {...this.resetPasswordForm.value}, tokenUuid: ''}).subscribe({
      next: res => {

      },
      error: err => {

      }
    })
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
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
}
