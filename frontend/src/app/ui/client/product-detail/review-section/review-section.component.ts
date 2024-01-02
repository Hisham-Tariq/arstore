import {Component, Input, OnInit} from '@angular/core';
import {RatingService} from "../../../../services/rating/rating.service";
import {IRating, Review} from "../../../../interfaces/i-rating";
import {Product} from "../../../../interfaces";

@Component({
  selector: 'app-review-section',
  templateUrl: './review-section.component.html',
  styleUrls: ['./review-section.component.scss'],
})
export class ReviewSectionComponent implements OnInit {
  @Input() product: Product;
  @Input() message: string;
  productReviews: Review[] = [];
  totalRating: number = 0;
  ratedBy: number = 0;

  isShowingLess: boolean = true;

  constructor(
    private ratingService: RatingService,
  ) {
    console.log("Message: ", this.message);
  }

  get reviews(): Review[] {
    if (this.isShowingLess && this.productReviews.length > 2) return this.productReviews.slice(0, 3);
    return this.productReviews;
  }

  ngOnInit(): void {
    console.log(this.product);
    this.productReviews = this.product.rating.reviews;
  }

  showAll() {
    this.isShowingLess = false;
  }

  showLess() {
    this.isShowingLess = true;
  }

  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  get overAllRating(): number {
    return this.product.rating.avgRating;
  }

  get total5StarsPercentage() {
    if (this.productReviews.length === 0) return 0;
    let total5Stars = this.productReviews.filter(review => review.stars === 5).length;
    return total5Stars / this.productReviews.length * 100;
  }

  get total4StarsPercentage() {
    if (this.productReviews.length === 0) return 0;
    let total4Stars = this.productReviews.filter(review => review.stars === 4).length;
    return total4Stars / this.productReviews.length * 100;
  }

  get total3StarsPercentage() {
    if (this.productReviews.length === 0) return 0;
    let total3Stars = this.productReviews.filter(review => review.stars === 3).length;
    return total3Stars / this.productReviews.length * 100;
  }

  get total2StarsPercentage() {
    if (this.productReviews.length === 0) return 0;
    let total2Stars = this.productReviews.filter(review => review.stars === 2).length;
    return total2Stars / this.productReviews.length * 100;
  }

  get total1StarsPercentage() {
    if (this.productReviews.length === 0) return 0;
    let total1Stars = this.productReviews.filter(review => review.stars === 1).length;
    return total1Stars / this.productReviews.length * 100;
  }


}
