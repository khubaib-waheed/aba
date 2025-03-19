import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '../auth/auth.service';
import { DropdownService } from '../../shared/services/dropdown.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-auction-list',
  imports: [RouterModule, CustomDropdownComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './auction-list.component.html',
  styleUrl: './auction-list.component.scss'
})
export class AuctionListComponent implements OnInit, AfterViewInit {

  auctions: any = [];
  userId: any = '';
  auctionFilterForm: FormGroup = {} as FormGroup;
  showEmptyCard: boolean = true;
  
  page = 1;
  limit = 1;
  hasMoreAuctions = true
  filters: any = {};

  manufacturers: any = [];
  displayManufacturer = (option: any) => option.Name;
  valueManufacturer = (option: any) => option.Id;
  carModels: any = [];
  displayCarModel = (option: any) => option.Name;
  valueCarModel = (option: any) => option.Id;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService, 
    private toast: HotToastService,
    private dropdownService: DropdownService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.auctionFilterForm = this.fb.group({
      ManufacturerId: [''],
      ModelId: [''],
      Year: [''],
      Transmission: [''],
      EngineType: [''],
      StartingPrice: [null],
    });
  }

  ngAfterViewInit() {
    if(this.authService.getToken()) {
      this.userId = this.authService.getUserId();
    }

    this.getAuctions();
  }

  getAuctions(): void {
    this.homeService.getAuctions({CurrentUserId: this.userId, Page: this.page, Limit: this.limit, ...this.filters}).subscribe({
      next: res => {
         this.showEmptyCard = false;
         if (res.Data.length > 0) {
            this.auctions = [...this.auctions, ...res.Data];
            this.page++;
            console.log(this.page)
          } 

          if(this.auctions.length === res.Count) {
            this.hasMoreAuctions = false; // No more data to load
          }
            
         this.manufacturers = this.dropdownService.getManufacturerData();
         this.carModels = this.dropdownService.getCarModelData();
         if (isPlatformBrowser(this.platformId)) {
            setInterval(() => {
              this.updateAuctionTimers();
            }, 1000);
         }
      },
      error: err => {
        this.showEmptyCard = false;
       this.toast.error(err.error.Message);
      }
    })
  }

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onDropdownChange() {
    let startingPrice = this.auctionFilterForm.value.StartingPrice;
    if(startingPrice) {
      this.auctionFilterForm.value.StartingPrice = parseInt(startingPrice.split('$')[1]);
    }
    this.page = 1;
    this.auctions = [];
    this.showEmptyCard = true;
    this.filters = this.auctionFilterForm.value;
    this.getAuctions()
  }

  updateAuctionTimers() {
    const now = new Date().getTime(); // Current time in milliseconds

    this.auctions.forEach((auction: any) => {
      const startTime = new Date(auction.StartAt).getTime(); // Convert startTime string to timestamp
      const endTime = new Date(auction.EndAt).getTime(); // Convert endTime string to timestamp
      const difference = endTime - now; // Remaining time until end

      if (now < startTime) {
        // Auction hasn't started yet
        auction.status = 'Not started yet';
        auction.remainingTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else if (difference > 0) {
        // Auction is running
        auction.status = 'running';
        auction.remainingTime = this.calculateTimeRemaining(difference);
      } else {
        // Auction has ended
        auction.status = 'Auction ended';
        auction.remainingTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    });
  }

  calculateTimeRemaining(difference: number) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  toggleFavorite(auction: any) {
    auction.IsFavorite = !auction.IsFavorite;
    this.homeService.toggleFavourite(auction.Id).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
       this.toast.error(err.error.Message)
      }
    })
  }

  onSubmit() {}
}
