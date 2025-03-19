import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {
  @Input() rating: number = 3.5; // Default rating
  @Input() readOnly: boolean = false; // Determines if rating is clickable
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>(); // Emits the rating to the parent

  stars: any[] = [
    { value: 1, checked: false, half: false, display: 'Awful' },
    { value: 2, checked: false, half: false, display: 'Poor' },
    { value: 3, checked: false, half: false, display: 'Average' },
    { value: 4, checked: false, half: false, display: 'Good' },
    { value: 5, checked: false, half: false, display: 'Excellent' },
  ];

  ngOnInit() {
    this.setRating(this.rating);
  }

  setRating(value: number) {
    this.stars.forEach((star, index) => {
      star.checked = index + 1 <= Math.floor(value); // Fully filled stars
      star.half = index + 1 === Math.ceil(value) && value % 1 !== 0; // Half star logic
    });
  }

  rate(s: any) {
    if (this.readOnly) return; // Prevent clicking if in read-only mode

    // Toggle first star when clicked
    if (s.value === 1 && this.rating === 1) {
      this.rating = 0; // Unselect the first star
    } else {
      this.rating = s.value; // Normal behavior for other stars
    }

    this.setRating(this.rating);
    this.ratingChange.emit(this.rating); // Emit rating change to parent
  }
}
