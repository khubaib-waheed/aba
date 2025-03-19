import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HomeService } from './home.service';
import { DropdownService } from '../../shared/services/dropdown.service';
import { switchMap, tap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
declare var $: any; // Declare jQuery globally

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, CustomDropdownComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  headerClass: string = '';
  isDropdownOpen = false; // State to track dropdown visibility
  vehicleFileName: string | null = null;
  vehicleFile: any;
  imagePreviews: any = []; // Holds uploaded image previews
  maxImages = 5; // Limit to 5 images
  createAdPage = 'create-ad-first-page';
  isActive: boolean = false;
  createAuctionForm: FormGroup = {} as FormGroup;
  loggedIn: boolean = false;
  showActions: boolean = false;

  manufacturers: any = [];
  displayManufacturer = (option: any) => option.Name;
  valueManufacturer = (option: any) => option.Id;
  carModels: any = [];
  displayCarModel = (option: any) => option.Name;
  valueCarModel = (option: any) => option.Id;

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
    private dropdownService: DropdownService,
    private homeService: HomeService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toast: HotToastService
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
      StartingPrice: [null, Validators.required],
      ReservePrice: [null, Validators.required],
      BuyNowPrice: [null, Validators.required],
      StartDateTime: ['', Validators.required],
      EndDateTime: ['', Validators.required],
      promoteAd: [{value: '', disabled: true}, Validators.required]
    });

    this.getManufacturers();
    this.getCarModels();

    if (isPlatformBrowser(this.platformId)) {
      if(this.authService.getToken()) {
        this.loggedIn = true;
      }
      this.showActions = true;
    }
  }

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    const input: any = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.imagePreviews.length < this.maxImages) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push({
          preview: e.target?.result,
          file: input.files[0]
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
  }
 
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.vehicleFileName = input.files[0].name;
      this.vehicleFile = input.files[0];
    }
  }

  removeFile(): void {
    this.vehicleFileName = null;
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
    // console.log(this.createAuctionForm.value)
    // console.log(this.imagePreviews)
    // this.homeService.uploadFile(this.file).subscribe(res => {
    //   console.log(res)
    // })

    this.createAuctionForm.value.StartingPrice = parseInt(this.createAuctionForm.value.StartingPrice);
    this.createAuctionForm.value.ReservePrice = parseInt(this.createAuctionForm.value.ReservePrice);
    this.createAuctionForm.value.BuyNowPrice = parseInt(this.createAuctionForm.value.BuyNowPrice);
    this.createAuctionForm.value.Type = 'Normal';
    this.createAuctionForm.value.ModelId = 11581;

    this.homeService.uploadMultipleFiles(this.imagePreviews).pipe(
      tap(imageIds => this.createAuctionForm.value.MediaIds = imageIds),
      switchMap(() => this.homeService.uploadFile(this.vehicleFile)),
      tap(imageId => this.createAuctionForm.value.VerificationDocumentId = imageId),
      switchMap(() => this.homeService.createAuction(this.createAuctionForm.value))).subscribe({
        next: res => {
          console.log(res)
          this.closeModal('#post-ad-modal');
        },
        error: err => {
          console.log(err)
          this.toast.error(err.error.Message)
        }
      }
    );
  }

  getManufacturers() {
    this.homeService.manufacturers().subscribe({
      next: res => {
        this.dropdownService.setManufacturerData(res.Data);
        this.manufacturers = res.Data;
      },
      error: err => {
       this.toast.error(err.error.Message);
      }
    })
  }

  getCarModels() {
    this.homeService.models().subscribe({
      next: res => {
        this.dropdownService.setCarModelData(res.Data);
        this.carModels = res.Data;
      },
      error: err => {
       this.toast.error(err.error.Message);
      }
    })
  }

  openModal(modalName: string): void {
    $(modalName).modal('show'); // Open modal
  }

  closeModal(modalName: string): void {
    $(modalName).modal('hide'); // Close modal
  }
}
