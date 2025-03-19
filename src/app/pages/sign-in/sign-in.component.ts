import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { interval, Subscription } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-sign-in',
  imports: [RouterModule, CommonModule, CustomDropdownComponent, NgOtpInputModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup = {} as FormGroup;
  emailForm: FormGroup = {} as FormGroup;
  otpForm: FormGroup = {} as FormGroup;
  questionForm: FormGroup = {} as FormGroup;
  resetPasswordForm: FormGroup = {} as FormGroup;
  rememberMe: boolean = false;

  isPasswordVisible = false;
  otp: any;
  tokenUuid: string = '';

  loading = false; // Control spinner visibility


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
    private toast: HotToastService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedCredentials = this.authService.getSavedCredentials();
      if (savedCredentials.email && savedCredentials.password) {
        this.signInForm.patchValue({
          UserNameOrEmail: savedCredentials.email,
          Password: savedCredentials.password
        });
        this.rememberMe = true;
      }
    }
  }

  // Custom Validator to check if Password & Confirm Password match
  matchPasswords(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.loading = true; // Show spinner
    this.authService.signIn(this.signInForm.value).subscribe({
      next: res => {
        this.authService.setToken(res.TokenUuid);
        this.authService.setUserId(res.User.Id);
        if (this.rememberMe) {
          const email = this.signInForm.value.UserNameOrEmail;
          const password = this.signInForm.value.Password;
          this.authService.saveCredentials(email, password, this.rememberMe);
        } else {
          this.authService.clearCredentials();
        }
        this.loading = false; // Hide spinner
        
        this.router.navigate(['/app/home']);
      },
      error: err => {
        this.toast.error(err.error.Message);
        this.loading = false; // Hide spinner
      }
    })
  }

  onSubmitEmail() {
    this.authService.forgotPassword(this.emailForm.value).subscribe({
      next: res => {
        this.closeModal('#email-modal');
        this.tokenUuid = res.TokenUuid;
        this.startTimer();
        this.openModal('#otp-modal');
      },
      error: err => {
        this.toast.error(err.error.Message)
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
        this.toast.error(err.error.Message);
      }
    })
  }

  onSubmitQuestion() {
    this.questionForm.value.TokenUuid = this.tokenUuid;
    this.authService.verifySecretQuestion(this.questionForm.value).subscribe({
      next: res => {
        this.closeModal('#question-modal');
        this.tokenUuid = res.TokenUuid;
        this.openModal('#reset-modal');
      },
      error: err => {
        this.toast.error(err.error.Message);
      }
    })
  }

  onSubmitResetPassword() {
    this.resetPasswordForm.value.TokenUuid = this.tokenUuid;
    this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
      next: res => {
        this.closeModal('#reset-modal');
      },
      error: err => {
        this.toast.error(err.error.Message);
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
        this.toast.error(err.error.Message);
      }
    })
  }
}
