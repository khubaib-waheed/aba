import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeService } from '../home/home.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { RatingComponent } from '../../shared/rating/rating.component';

@Component({
  selector: 'app-bid-detail',
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './bid-detail.component.html',
  styleUrl: './bid-detail.component.scss'
})
export class BidDetailComponent implements OnInit {
  auction: any = {}
  bidAmount: any = '';
  auctionId: any;
  shippingRates: any = [];

  userRating: number = 3.5; // Initial rating

  // onRatingChange(newRating: number) {
  //   console.log('New Rating:', newRating);
  //   this.userRating = newRating;
  // }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private toast: HotToastService
  ) {}

  ngOnInit() {
    const paramId = this.activatedRoute.snapshot.paramMap.get('id');
    if(paramId) {
      this.auctionId = parseInt(paramId);
    }

    this.homeService.getShippingRates().subscribe({
      next: res => {
        console.log(res)
        this.shippingRates = res.Data;
      },
      error: err => {
        this.toast.error(err.error.Message)
      }
    })

    this.homeService.getAuctionById(this.auctionId).pipe(
      map(res => {
        const postedDate = new Date(res.CreatedAt);

        const formattedPostedDate = postedDate.toLocaleDateString("en-US", {
          month: "short", // "Dec"
          day: "2-digit", // "25"
          year: "numeric" // "2025"
        });

        res.CreatedAt = formattedPostedDate;

        res.Bids = res.Bids.map((bid: any) => { // Return the modified array
          const bidDateTime = new Date(bid.CreatedAt);
    
          const formattedDate = bidDateTime.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
    
          const formattedTime = bidDateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
    
          return { ...bid, formattedDate, formattedTime }; // Keep existing bid data + formatted values
        });
    
        return res; // Ensure the transformed response is returned
      })
    ).subscribe({
      next: res => {
        this.auction = res;
        console.log(this.auction)
        if (isPlatformBrowser(this.platformId)) {
          setInterval(() => {
            this.updateAuctionTimer();
          }, 1000);
        }
      },
      error: err => {
        console.log(err);
      }
    });
    
    
  }

  updateAuctionTimer() {
    const now = new Date().getTime(); // Current time in milliseconds
    const startTime = new Date(this.auction.StartAt).getTime(); // Convert startTime string to timestamp
    const endTime = new Date(this.auction.EndAt).getTime(); // Convert endTime string to timestamp
    const difference = endTime - now; // Remaining time until end

    if (now < startTime) {
      // Auction hasn't started yet
      this.auction.status = 'Auction Not Started yet';
      this.auction.remainingTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else if (difference > 0) {
      // Auction is running
      this.auction.status = 'This Auction Ends In:';
      this.auction.remainingTime = this.calculateTimeRemaining(difference);
    } else {
      // Auction has ended
      this.auction.status = 'Auction Ended';
      this.auction.remainingTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  calculateTimeRemaining(difference: number) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  submitBid() {
    this.homeService.bid({AuctionId: this.auctionId, Price: this.bidAmount}).subscribe({
      next: res => {
        this.toast.success(res.Message)
      },
      error: err => {
       this.toast.error(err.error.Message, {dismissible: true, autoClose: false})
      }
    })
  }

  openCertificate() {
    if(this.auction.VerificationDocument) {
      const certificateUrl = this.auction.VerificationDocument.OriginalUrl;
      if (isPlatformBrowser(this.platformId)) {
        window.open(certificateUrl, '_blank');
      }
    }
  }

  toggleFavorite() {
    this.auction.IsFavorite = !this.auction.IsFavorite;
    this.homeService.toggleFavourite(this.auctionId).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
       this.toast.error(err.error.Message)
      }
    })
  }
}
