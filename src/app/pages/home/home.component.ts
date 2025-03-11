import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, CustomDropdownComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  headerClass: string = '';
  isDropdownOpen = false; // State to track dropdown visibility
  businessFile: string | null = null;
  vehicleFile: string | null = null;
  imagePreviews: string[] = Array(7).fill(''); // Holds image previews for 7 slots
  createAdPage = 'create-ad-first-page';
  isActive: boolean = false;
  createAdFirstForm: FormGroup = {} as FormGroup;
  createAdSecondForm: FormGroup = {} as FormGroup;

  @ViewChildren('fileInputs') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isActive = window.scrollY > 0; // If scrolled, set active
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.isDropdownOpen = false;
    }
  }


  constructor(private router: Router, private fb: FormBuilder) {
    this.router.events.subscribe(() => {
      this.updateHeaderClass();
    });
  }

  ngOnInit(): void {
    this.createAdFirstForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.createAdSecondForm = this.fb.group({
      maker: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      transmission: ['', Validators.required],
      engineType: ['', Validators.required],
      startingPrice: ['', Validators.required],
      reservePrice: ['', Validators.required],
      buyNowPrice: ['', Validators.required],
      auctionStartDate: ['', Validators.required],
      auctionEndDate: ['', Validators.required],
      promoteAd: ['', Validators.required]
    });
  }

  openFileSelector(index: number) {
    this.fileInputs.get(index)?.nativeElement.click();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle the dropdown menu
  }

  updateHeaderClass() {
    const currentRoute = this.router.url;
    if (currentRoute === '/app/home') {
      this.headerClass = 'default-header'; // Default background
    } else {
      this.headerClass = 'landing-header'; // Change background for Other Pages
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

  onFileSelect(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileName = input.files[0].name;
      if((type === 'business')) {
        this.businessFile = fileName;
      }
      else if((type === 'vehicle')) {
        this.vehicleFile = fileName;
      }
    }
  }

  removeFile(type: any): void {
    if((type === 'business')) {
      this.businessFile = null;
    }
    else if((type === 'vehicle')) {
      this.vehicleFile = null;
    }
  }

  goToWallet() {
    this.router.navigate(['/app/user-information/wallet'])
  }

  goToNextCreateAdPage() {
    this.createAdPage = 'create-ad-second-page'
  }

  onSubmitFirst() {
    if (this.createAdFirstForm.valid) {
      console.log('Form Submitted!', this.createAdFirstForm.value);
    }
  }

  onSubmitSecond() {
    if (this.createAdFirstForm.valid) {
      console.log('Form Submitted!', this.createAdFirstForm.value);
    }
  }
}
