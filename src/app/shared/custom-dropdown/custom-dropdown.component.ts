
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, ElementRef, forwardRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true
    }
  ]
})
export class CustomDropdownComponent implements ControlValueAccessor, OnInit {
  isOpen = false;
  @Input() selectedOption = '';
  @Input() placeholder: string = 'Select';
  @Input() options: string[] = [];
  @Input() displayFn: (option: any) => string = (option) => option; // Function for dropdown display
  @Input() valueFn: (option: any) => any = (option) => option; // Function for emitted value

  @Output() change = new EventEmitter<any>(); // Emit change event

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Ensure that if no value is provided, a default one is set
    if (!this.selectedOption && this.options.length > 0) {
      // this.selectedOption = this.displayFn(this.options[0]);
      this.selectedOption = this.placeholder;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any, event: Event) {
    this.selectedOption = this.displayFn ? this.displayFn(option) : option;
    const returnValue = this.valueFn ? this.valueFn(option) : option;
    this.isOpen = false;
    this.isOpen = false;
    this.onChange(returnValue);
    this.onTouched();
    this.change.emit(returnValue); // Emit event to parent component
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      this.selectedOption = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // If needed, handle disabling logic
  }
}
