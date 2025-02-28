import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { interval, timeInterval } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  landingPage: boolean = true;
  page = 'landing'
  headerColor = 'default-header';

  activeMenu: string = 'profile'; // Default active menu

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.onScrollToTop()
  }

  

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}
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

  @ViewChild('days', { static: true }) days!: ElementRef;
  @ViewChild('hours', { static: true }) hours!: ElementRef;
  @ViewChild('minutes', { static: true }) minutes!: ElementRef;
  @ViewChild('seconds', { static: true }) seconds!: ElementRef;


  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }


  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => setInterval(() => {
    //   this.tickTock();
    //   this.difference = this.targetTime - this.now;
    //   this.difference = this.difference / (1000 * 60 * 60 * 24);
    //   this.days.nativeElement.innerText = `${Math.floor(this.difference)}d`
    // }, 1000));
  }

  changePage(activePage: any) {
    this.page = activePage;
    this.headerColor = (this.page === 'landing') ? 'default-header' : 'landing-header';
    if(this.page === 'landing') {
      window.location.reload()
    }
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = `${Math.floor(this.difference)}d`;
    this.hours.nativeElement.innerText = `${23 - this.date.getHours()}h`;
    this.minutes.nativeElement.innerText = `${60 - this.date.getMinutes()}m`;
    this.seconds.nativeElement.innerText = `${60 - this.date.getSeconds()}s`;
  }
}
