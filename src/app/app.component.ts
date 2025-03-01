import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-dropdown',
  imports: [RouterOutlet, CommonModule],
  template:  `<div class="custom-bid-dropdown" (click)="toggleDropdown()" #dropdownContainer>
    <div class="dropdown-header">
        <span>{{ selectedOption }}</span>
        <img src="../../../assets/images/down-arrow.png" alt="Arrow" class="arrow" [ngClass]="{'rotate': isOpen}">
    </div>
    <ul class="dropdown-list" *ngIf="isOpen">
        <li class="dropdown-item" *ngFor="let option of options" (click)="selectOption(option, $event)">
            {{ option }}
        </li>
    </ul>
</div>`
})
export class CustomDropdownComponent {
  isOpen = false;
  selectedOption = 'En';
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














@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, CustomDropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  landingPage: boolean = true;
  page = 'landing'
  headerColor = 'default-header';

  activeMenu: string = 'profile'; // Default active menu

  title = 'aba-without-ssr';

  isPasswordVisible = false;

  imagePreviews: string[] = Array(7).fill(''); // Holds image previews for 7 slots

  @ViewChildren('fileInputs') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  openFileSelector(index: number) {
    this.fileInputs.get(index)?.nativeElement.click();
  }

  

  

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}
  date: any;
  now: any;
  targetDate: any = new Date(2025, 5, 20);
  targetTime: any = this.targetDate.getTime();
  difference: any;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = `${
    this.months[this.targetDate.getMonth()]
  } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  @ViewChild('days', { static: true }) days!: ElementRef;
  @ViewChild('hours', { static: true }) hours!: ElementRef;
  @ViewChild('minutes', { static: true }) minutes!: ElementRef;
  @ViewChild('seconds', { static: true }) seconds!: ElementRef;


  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }


  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => setInterval(() => {
    //   this.tickTock();
    //   this.difference = this.targetTime - this.now;
    //   this.difference = this.difference / (1000 * 60 * 60 * 24);
    //   this.days.nativeElement.innerText = `${Math.floor(this.difference)}d`
    // }, 1000));
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.onScrollToTop()
  }

  changePage(activePage: any) {
    this.page = activePage;
    this.headerColor = (this.page === 'landing') ? 'default-header' : 'landing-header';
    if(this.page === 'landing') {
      window.location.reload()
    }
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews[index] = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = `${Math.floor(this.difference)}d`;
    this.hours.nativeElement.innerText = `${23 - this.date.getHours()}h`;
    this.minutes.nativeElement.innerText = `${60 - this.date.getMinutes()}m`;
    this.seconds.nativeElement.innerText = `${60 - this.date.getSeconds()}s`;
  }
}
