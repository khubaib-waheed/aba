import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bid-detail',
  imports: [],
  templateUrl: './bid-detail.component.html',
  styleUrl: './bid-detail.component.scss'
})
export class BidDetailComponent implements AfterViewInit {
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  date: any;
  now: any;
  difference: any;
  targetDate: any = new Date(2025, 5, 20);
  targetTime: any = this.targetDate.getTime();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.setTime();
        this.difference = this.targetTime - this.now;
        this.difference = this.difference / (1000 * 60 * 60 * 24);
        this.days = Math.floor(this.difference)
      }, 1000)
    }
  }

  setTime() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days = Math.floor(this.difference);
    this.hours = 23 - this.date.getHours();
    this.minutes = 60 - this.date.getMinutes();
    this.seconds = 60 - this.date.getSeconds();
  }
}
