import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductItem} from "../../interfaces";
import {StateChange} from "ng-lazyload-image";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductItem;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  onProductClick(): void {
    this._router.navigateByUrl(`/product-detail/${this.product.id}`, {
      state: {
        product: this.product
      }
    });
  }

  addToCart(event: any) {
    event.stopPropagation();
    console.log('add to cart');
  }

  getAverageRating(product: ProductItem) : number {
    return product.totalRating / product.ratedBy
  }

  get retailPrice():number {
    return this.product.stock[this.product.colors[0]].retailerPrice
  }

  get discountedPrice(): number{
    return this.retailPrice - ((this.product.discount * this.retailPrice) / 100)
  }

  imageLoadingState(event: StateChange, img: HTMLImageElement, loading: HTMLDivElement) {
    switch (event.reason) {
      case 'setup':
        break;
      case 'observer-emit':
        break;
      case 'start-loading':
        break;
      case 'mount-image':
        break;
      case 'loading-succeeded':
        img.classList.toggle("invisible");
        loading.remove();
        break;
      case 'loading-failed':
        break;
      case 'finally':
        break;
    }
  }


}
