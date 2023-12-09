import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {RatingService} from "../../../../services/rating/rating.service";
import {IRating} from "../../../../interfaces/i-rating";

@Component({
  selector: 'app-review-section',
  templateUrl: './review-section.component.html',
  styleUrls: ['./review-section.component.scss'],
})
export class ReviewSectionComponent implements OnInit {
  @Input() productId: string;
  productReviews: IRating[] = [];
  totalRating: number = 0;
  ratedBy: number = 0;

  isShowingLess: boolean = true;

  constructor(
    private ratingService: RatingService,
  ) {
    setTimeout(() => {
      this.fetchReviews();
    }, 0);
  }

  public fetchReviews(productId: string = this.productId) {
    this.ratingService.getProductRating(productId).subscribe(res => {
      this.productReviews = res;
    })
  }

  get reviews(): IRating[] {
    if(this.isShowingLess && this.productReviews.length > 2) return this.productReviews.slice(0, 3);
    return this.productReviews;
  }

  ngOnInit(): void {
  }

  showAll() {
    this.isShowingLess = false;
  }
  showLess(){
    this.isShowingLess = true;
  }
  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  get overAllRating(): number {
    if(this.productReviews.length === 0) return 0;
    let rating = this.productReviews.reduce((acc, curr) => acc + curr.rating, 0) / this.productReviews.length;
    return rating;
  }

  get total5StarsPercentage() {
    if(this.productReviews.length === 0) return 0;
    let total5Stars = this.productReviews.filter(review => review.rating === 5).length;
    return total5Stars / this.productReviews.length * 100;
  }

  get total4StarsPercentage() {
    if(this.productReviews.length === 0) return 0;
    let total4Stars = this.productReviews.filter(review => review.rating === 4).length;
    return total4Stars / this.productReviews.length * 100;
  }

  get total3StarsPercentage() {
    if(this.productReviews.length === 0) return 0;
    let total3Stars = this.productReviews.filter(review => review.rating === 3).length;
    return total3Stars / this.productReviews.length * 100;
  }

  get total2StarsPercentage() {
    if(this.productReviews.length === 0) return 0;
    let total2Stars = this.productReviews.filter(review => review.rating === 2).length;
    return total2Stars / this.productReviews.length * 100;
  }

  get total1StarsPercentage() {
    if(this.productReviews.length === 0) return 0;
    let total1Stars = this.productReviews.filter(review => review.rating === 1).length;
    return total1Stars / this.productReviews.length * 100;
  }


}
