import { Component, OnInit } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerificationService } from '../../shared/services/verification.service';

@Component({
  selector: 'app-secret-question',
  imports: [RouterModule, CustomDropdownComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './secret-question.component.html',
  styleUrl: './secret-question.component.scss'
})
export class SecretQuestionComponent implements OnInit {
  secretQuestionForm: FormGroup = {} as FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.secretQuestionForm = this.fb.group({
      SecretQuestion1: ['', Validators.required],
      SecretQuestion1Answer: ['', Validators.required],
      SecretQuestion2: ['', Validators.required],
      SecretQuestion2Answer: ['', Validators.required],
    });
  }

  onSubmit() {
    // if (this.secretQuestionForm.valid) {
    //   console.log('Form Submitted!', this.secretQuestionForm.value);
    // }
    this.verificationService.setFormData(this.secretQuestionForm.value);
    this.router.navigate(['/auth/verification/address']);
  }

}
