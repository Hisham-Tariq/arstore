import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../../interfaces";
import {StateChange} from "ng-lazyload-image";
import {prod} from "@tensorflow/tfjs-core";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    console.log(this.product)
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

  getAverageRating(product: Product) : number {
    return product.rating.avgRating
  }

  get retailPrice():number {
    return this.product.variants.find(value => value.colorCode == this.product.colors[0])!.price
  }

  get lowestPrice(): number {
    return Math.min(...this.product.variants.map(value => value.price))
  }

  get highestPrice(): number {
    return Math.max(...this.product.variants.map(value => value.price))
  }

  get discountedPrice(): number{
    return this.retailPrice;
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
