import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren, viewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from './pages/auth/auth.service';



@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, NgOtpInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit, AfterViewInit  {

  title = 'aba-without-ssr';

  isPasswordVisible = false;
  isConfirmPasswordVisible = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    
  }

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    const AOS = (await import('aos')).default; // Import AOS dynamically
    AOS.init({ duration: 1200, once: true });

      // Refresh AOS on route change
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          AOS.refresh();
        }
      });
    }
  }
 
  togglePassword(type: any): void {
    if(type === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
    else {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }
}
