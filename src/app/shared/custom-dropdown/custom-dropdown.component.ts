
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-custom-dropdown',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss'
})
export class CustomDropdownComponent {
    isOpen = false;
    @Input() selectedOption = 'En';
    @Input() options: any = [];
  
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    }
  
    selectOption(option: string, event: Event) {
      this.selectedOption = option;
      this.isOpen = false;
      event.stopPropagation(); // Prevents dropdown from closing immediately
    }
  
    // Close dropdown when clicking outside
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isOpen = false;
      }
    }
  
    constructor(private elementRef: ElementRef) {}

}
