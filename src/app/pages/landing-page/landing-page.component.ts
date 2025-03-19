import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';
import { DropdownService } from '../../shared/services/dropdown.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '../auth/auth.service';
declare var $: any; // Declare jQuery globally

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {

  slidingCars: any = [];
  auctions: any = [];
  userId: any = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private homeService: HomeService,
    private toast: HotToastService,
    private authService: AuthService,
    private dropdownService: DropdownService,
    private router: Router
  ) {}

  async ngAfterViewInit() {

    this.getSlidingCars();

    if(this.authService.getToken()) {
      this.userId = this.authService.getUserId();
    }

    this.getAuctions();

    if (isPlatformBrowser(this.platformId)) {

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

  getAuctions(): void {
    this.homeService.getAuctions({CurrentUserId: this.userId, Limit: 3}).subscribe({
      next: res => {
         this.auctions = res.Data;
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

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      $('.browse-slider').trigger('destroy.owl.carousel'); // Destroy instance to prevent memory leaks
    }
  }

  getSlidingCars() {
    this.dropdownService.manufacturersData$.subscribe(res => {
      this.slidingCars = res;
    })
  }
}
