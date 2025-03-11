import { Component, OnInit } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secret-question',
  imports: [RouterModule, CustomDropdownComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './secret-question.component.html',
  styleUrl: './secret-question.component.scss'
})
export class SecretQuestionComponent implements OnInit {
  secretQuestionForm: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.secretQuestionForm = this.fb.group({
      question1: ['', Validators.required],
      answer1: ['', Validators.required],
      question2: ['', Validators.required],
      answer2: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.secretQuestionForm.valid) {
      console.log('Form Submitted!', this.secretQuestionForm.value);
    }
  }

}
