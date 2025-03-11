import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      password: ['', Validators.required],  // Required field
      email: ['', [Validators.required, Validators.email]] // Required & must be valid email
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.questionForm = this.fb.group({
      question1: ['', Validators.required],
      answer1: ['', Validators.required],
      questoin2: ['', Validators.required],
      answer2: ['', Validators.required]
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
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onSubmitQuestion() {
    if (this.questionForm.valid) {
      console.log(this.questionForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onSubmitResetPassword() {
    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
}
