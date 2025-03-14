import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { interval, Subscription } from 'rxjs';
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
  otpForm: FormGroup = {} as FormGroup;
  questionForm: FormGroup = {} as FormGroup;
  resetPasswordForm: FormGroup = {} as FormGroup;

  isPasswordVisible = false;
  otp: any;
  tokenUuid: string = '';


  resendDisabled = true;
  timer: number = 60; // Timer countdown (in seconds)
  private timerSubscription!: Subscription;

  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
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
      UserNameOrEmail: ['', [Validators.required, Validators.email]], // Required & must be valid email
      Password: ['', Validators.required],  // Required field
    });

    this.emailForm = this.fb.group({
      UserNameOrEmail: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({})

    this.questionForm = this.fb.group({
      SecretQuestion1: ['', Validators.required],
      SecretQuestion1Answer: ['', Validators.required],
      SecretQuestion2: ['', Validators.required],
      SecretQuestion2Answer: ['', Validators.required]
    });

    this.resetPasswordForm = this.fb.group({
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]}, 
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

    this.authService.signIn(this.signInForm.value).subscribe({
      next: res => {
        this.authService.setToken(res.TokenUuid)
        this.router.navigate(['/app/home']);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  onSubmitEmail() {
    // if (this.emailForm.valid) {
    //   console.log(this.emailForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }


    this.authService.forgotPassword(this.emailForm.value).subscribe({
      next: res => {
        this.closeModal('#email-modal');
        this.tokenUuid = res.TokenUuid;
        this.startTimer();
        this.openModal('#otp-modal');
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })

  }

  sendOTP() {
    this.authService.verifyForgotPasswordCode({Code: this.otp, TokenUuid: this.tokenUuid}).subscribe({
      next: res => {
        this.closeModal('#otp-modal');
        this.timerSubscription.unsubscribe();
        this.tokenUuid = res.TokenUuid;
        this.openModal('#question-modal');
      },
      error: err => {
        console.log(err)
      }
    })
  }

  onSubmitQuestion() {
    // if (this.questionForm.valid) {
    //   console.log(this.questionForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }
    this.questionForm.value.TokenUuid = this.tokenUuid;
    this.authService.verifySecretQuestion(this.questionForm.value).subscribe({
      next: res => {
        this.closeModal('#question-modal');
        this.tokenUuid = res.TokenUuid;
        this.openModal('#reset-modal');
      },
      error: err => {
        console.log(err)
      }
    })
  }

  onSubmitResetPassword() {
    // if (this.resetPasswordForm.valid) {
    //   console.log(this.resetPasswordForm.value);
    // } else {
    //   console.log('Form is invalid');
    // }

    this.resetPasswordForm.value.TokenUuid = this.tokenUuid;
    this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
      next: res => {
        this.closeModal('#reset-modal');
      },
      error: err => {
        console.log(err)
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

  startTimer() {
    this.resendDisabled = true;
    this.timer = 60; // Reset timer to 60 seconds

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.resendDisabled = false;
        this.timerSubscription.unsubscribe(); // Stop the timer when it reaches 0
      }
    });
  }

  resendOtp() {
    // Call your API to resend OTP here
    this.authService.resendCode({TokenUuid: this.tokenUuid}).subscribe({
      next: res => {
        this.tokenUuid = res.TokenUuid;
        this.startTimer();
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
