import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../home/home.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '../../auth/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favourites',
  imports: [RouterModule, CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit, AfterViewInit {

  auctions: any = [];
  userId: any = '';
  constructor(
    private homeService: HomeService, 
    private toast: HotToastService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    if(this.authService.getToken()) {
      this.userId = this.authService.getUserId();
    }

    this.getAuctions();
  }

  getAuctions(): void {
    this.homeService.getAuctions({CurrentUserId: this.userId}).subscribe({
      next: res => {
         this.auctions = res.Data.filter((auction: any) => auction.IsFavorite === true);
         if (isPlatformBrowser(this.platformId)) {
          setInterval(() => {
            this.updateAuctionTimers();
          }, 1000);
        }
      },
      error: err => {
       this.toast.error(err.error.Message);
      }
    })
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
        this.getAuctions();
      },
      error: err => {
       this.toast.error(err.error.Message)
      }
    })
  } 
}
