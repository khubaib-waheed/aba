import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

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
  imagePreviews: string[] = []; // Holds uploaded image previews
  maxImages = 5; // Limit to 5 images
  createAdPage = 'create-ad-first-page';
  isActive: boolean = false;
  createAuctionForm: FormGroup = {} as FormGroup;

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


  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.router.events.subscribe(() => {
      this.updateHeaderClass();
    });
  }

  ngOnInit(): void {
    this.createAuctionForm = this.fb.group({
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      ManufacturerId: ['', Validators.required],
      ModelId: ['', Validators.required],
      Year: ['', Validators.required],
      Transmission: ['', Validators.required],
      EngineType: ['', Validators.required],
      StartingPrice: ['', Validators.required],
      ReservePrice: ['', Validators.required],
      BuyNowPrice: ['', Validators.required],
      StartDateTime: ['', Validators.required],
      EndDateTime: ['', Validators.required],
      promoteAd: [{value: '', disabled: true}, Validators.required]
    });

    this.authService.users().subscribe({
      next: res => {
        console.log('========= USERS ===========')
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })

   
    this.authService.myInfo().subscribe({
      next: res => {
        console.log('========= MY INFO ===========')
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  openFileSelector(fileInput: HTMLInputElement) {
    fileInput.click();
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.imagePreviews.length < this.maxImages) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target)
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
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

  onSubmit() {
    // if (this.createAuctionForm.valid) {
    //   console.log('Form Submitted!', this.createAuctionForm.value);
    // }
    console.log(this.createAuctionForm.value)
    console.log(this.imagePreviews)
  }
}
