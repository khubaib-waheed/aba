import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren, viewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';

declare var $: any; // Declare jQuery globally

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














@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, CustomDropdownComponent, NgOtpInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit, AfterViewInit, OnDestroy  {
  landingPage: boolean = true;
  page = 'sign-in';
  verificationPage = 'address';
  createAdPage = 'create-ad-first-page';
  headerColor = 'default-header';

  activeMenu: string = 'profile'; // Default active menu

  title = 'aba-without-ssr';
  loggedIn: boolean = false;

  isPasswordVisible = false;
  isConfirmPasswordVisible = false;

  imagePreviews: string[] = Array(7).fill(''); // Holds image previews for 7 slots

  @ViewChildren('fileInputs') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  openFileSelector(index: number) {
    this.fileInputs.get(index)?.nativeElement.click();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.isDropdownOpen = false;
    }
  }


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
  

  days: any;
  hours: any;
  minutes: any;
  seconds: any;

  paramValue: any = '';

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

  isBrowser: boolean = false;

  constructor(
    private ngZone: NgZone, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paramValue = params['key']; // Get query param value
      if(this.paramValue === 'home') {
        this.loggedIn = true;
        this.page = 'landing';
      }

      if(this.paramValue === 'signup') {
        this.page = 'signup';
      }
    });
  }

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  login() {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      params.set('key', 'home');  // Add or update a query parameter

      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      window.location.reload();
    }
  }

  goToSignInPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.history.replaceState({}, '', window.location.pathname);
      window.location.reload();
    }
  }

  goToSecretQuestion() {
    this.page = 'secret-question';
  }

  goToVerificationProcess(pageType: any = 'address') {
    this.page = 'verification';
    this.verificationPage = pageType;
  }

  goToNextCreateAdPage() {
    this.createAdPage = 'create-ad-second-page'
  }

  signup() {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      params.set('key', 'signup');  // Add or update a query parameter

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      window.location.reload();
    }
  }

  enterEmail() {

  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }


  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      this.difference = this.difference / (1000 * 60 * 60 * 24);
      this.days = Math.floor(this.difference)
    }, 1000)

    const AOS = (await import('aos')).default; // Import AOS dynamically
      AOS.init({ duration: 1200, once: true });

      // Refresh AOS on route change
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          AOS.refresh();
        }
      });

   // Initialize Owl Carousel after a short delay
   setTimeout(() => {
    this.initOwlCarousel();
  }, 500);

  // Refresh Owl Carousel on route change
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.initOwlCarousel();
      }, 500); // Small delay ensures elements are ready
    }
  });
    }
  }

  initOwlCarousel() {
    const owl = $('.browse-slider');

    if (owl.hasClass('owl-loaded')) {
      owl.trigger('destroy.owl.carousel'); // Destroy previous instance
      owl.html(owl.find('.owl-stage-outer').html()); // Reset HTML
    }
  
    owl.owlCarousel({
      loop: true,
      margin: 10,
      nav: false, // Disable default nav
      dots: false,
      autoplay: true,
      autoplayTimeout: 1500,
      mouseDrag: false,  // Disable mouse drag
      touchDrag: false,  // Disable touch drag
      responsive: {
        0: { items: 1 },
        480: { items: 2 },
        768: { items: 3 },
        1024: { items: 4 },
        1280: { items: 5 }
      }
    });

    $('.owl-prev').click(() => {
      owl.trigger('prev.owl.carousel');
    });

    $('.owl-next').click(() => {
      owl.trigger('next.owl.carousel');
    });

    $(".browse-slider").on("click", ".browse-item", (event: any) => {
      $(".browse-item").removeClass("active"); // Remove active from all

      const target = event.currentTarget as HTMLElement; // Type assertion
      target.classList.add("active"); // Add active class
    });

     // Sync active class when carousel changes
     // owl.on("changed.owl.carousel", () => {
     //     $(".browse-item").removeClass("active");
     //     $(".owl-item.active .browse-item").first().addClass("active");
     // });
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

  identityFile: string | null = null;
  addressFile: string | null = null;
  businessFile: string | null = null;
  vehicleFile: string | null = null;

  onFileSelect(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileName = input.files[0].name;
      if (type === 'identity') {
        this.identityFile = fileName;
      } 
      else if((type === 'address')) {
        this.addressFile = fileName;
      }
      else if((type === 'business')) {
        this.businessFile = fileName;
      }
      else if((type === 'vehicle')) {
        this.vehicleFile = fileName;
      }
    }
  }
  
  removeFile(type: any): void {
    if (type === 'identity') {
      this.identityFile = null;
    } 
    else if((type === 'address')) {
      this.addressFile = null;
    }
    else if((type === 'business')) {
      this.businessFile = null;
    }
    else if((type === 'vehicle')) {
      this.vehicleFile = null;
    }
  }

  isDropdownOpen = false; // State to track dropdown visibility

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle the dropdown menu
  }

  togglePassword(type: any): void {
    if(type === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
    else {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
    
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days = Math.floor(this.difference);
    this.hours = 23 - this.date.getHours();
    this.minutes = 60 - this.date.getMinutes();
    this.seconds = 60 - this.date.getSeconds();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      $('.browse-slider').trigger('destroy.owl.carousel'); // Destroy instance to prevent memory leaks
    }
  }
}
