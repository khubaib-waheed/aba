import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
declare var $: any; // Declare jQuery globally

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  async ngAfterViewInit() {
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
}
