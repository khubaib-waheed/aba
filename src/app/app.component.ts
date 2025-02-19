import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { interval, timeInterval } from 'rxjs';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private ngZone: NgZone) {}
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

  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => setInterval(() => {
    //   this.tickTock();
    //   this.difference = this.targetTime - this.now;
    //   this.difference = this.difference / (1000 * 60 * 60 * 24);
    //   this.days.nativeElement.innerText = `${Math.floor(this.difference)}d`
    // }, 1000));
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
