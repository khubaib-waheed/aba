import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';

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
    private homeService: HomeService
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
    this.homeService.contact(this.contactForm.value).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
