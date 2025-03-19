import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';
import { AuthService } from '../auth/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-contact',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = {} as FormGroup;

  constructor (
    private fb: FormBuilder,
    private homeService: HomeService,
    private authService: AuthService,
    private toast: HotToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Message: ['', Validators.required]
    });
  }

  onSubmit() {
    // if (this.contactForm.valid) {
    //   console.log('Form Submitted!', this.contactForm.value);
    // }
    if (isPlatformBrowser(this.platformId)) {
      if(this.authService.getToken()) {
        this.homeService.contact(this.contactForm.value).subscribe({
          next: res => {
            console.log(res)
            this.contactForm.reset();
            this.toast.info(res.Message)
          },
          error: err => {
            this.toast.info(err.error.Message)
          }
        })
      }
      else {
        this.homeService.publicContact(this.contactForm.value).subscribe({
          next: res => {
            this.contactForm.reset();
            this.toast.info(res.Message)
          },
          error: err => {
            this.toast.info(err.error.Message)
          }
        })
      }
    }
  }
}
