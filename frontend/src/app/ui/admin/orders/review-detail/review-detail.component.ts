import { Component, OnInit } from '@angular/core';
import {IRating, IRatingWithProduct} from "../../../../interfaces/i-rating";
import {RatingService} from "../../../../services/rating/rating.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.scss']
})
export class ReviewDetailComponent implements OnInit {

  productReviews: IRatingWithProduct[] = [];
  constructor(
    ratingService : RatingService,
    activatedRoute : ActivatedRoute,

  ) {
    activatedRoute.paramMap.subscribe(value => {
      ratingService.getReviewsByOrderId(value.get("id")!).subscribe(value1 => {
        this.productReviews = value1;
      })
    })
  }


  get reviews(): IRatingWithProduct[] {

    return this.productReviews;
  }

  ngOnInit(): void {
  }
  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }


}
