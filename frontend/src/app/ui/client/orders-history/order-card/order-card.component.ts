import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../services/Product/product.service";
import {Router} from "@angular/router";
import {CartService} from "../../../../services/Cart/cart.service";
import {StockService} from "../../../../services/Stock/stock.service";
import {GlobalService} from "../../../../services/global/global.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Order, OrderProduct, OrderService} from "../../../../services/order/order.service";
import * as util from "util";
import {AddRatingData, RatingService} from "../../../../services/rating/rating.service";
import {IRating} from "../../../../interfaces/i-rating";
import {AuthService} from "../../../../services/Authentication";
import {Product} from "../../../../interfaces";

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit {
  @Input() order: Order;
  @Input() isOdd: boolean;
  @ViewChild('reviewModal') modal: ElementRef;
  @ViewChild('rProductImage') rProductImage: ElementRef;
  @ViewChild('rProductName') rProductName: ElementRef;


  currentProductForReview: OrderProduct | null = null;
  currentRating: number = 3;
  currentReview: string = '';
  isUserReviewing: boolean = false;
  isAddingReview: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private stockService: StockService,
    private globalService: GlobalService,
    private orderService: OrderService,
    private ratingService: RatingService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  onViewProduct(productId: string) {
    this.productService.data.subscribe(data => {
      for (let product of data) {
        if (product.id === productId) {
          this.router.navigateByUrl(`/product-detail/${productId}`);
        }
      }
    });
  }


  showInvoice() {
    this.router.navigateByUrl(`/invoice/${this.order.id}`);
  }

  openReviewModal(product: OrderProduct) {
    this.currentProductForReview = product;
    this.setReviewModalContent();
    this.modal.nativeElement.classList.toggle('hidden');
    this.isUserReviewing = true;
  }

  closeReviewModal() {
    if (this.isAddingReview) return;
    this.currentProductForReview = null;
    this.isUserReviewing = false;
    setTimeout(() => {
      this.modal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  findVariant(product: Product, variantName: string){
    return product.variants.find(v => v.name == variantName)!
  }

  setReviewModalContent() {
    if (this.currentProductForReview == null) return;
    this.rProductImage.nativeElement.src = this.findVariant(this.currentProductForReview.product, this.currentProductForReview.variantName);
    this.rProductName.nativeElement.innerText = this.currentProductForReview.product.name;
  }

  sendReview() {
    if (this.currentRating === 0) {
      alert('Please rate the product');
      return;
    }
    if (this.currentReview.length < 20) {
      alert('Please write at least 20 characters');
      return;
    }
    this.isAddingReview = true;
    let ratingItem = <AddRatingData>{
      userId: this.authService.getUser()!.id,
      userName: this.authService.getUser()!.firstName + ' ' + this.authService.getUser()!.lastName,
      stars: this.currentRating,
      orderId: this.order.id,
      productId: this.currentProductForReview!.product.id,
      comment: this.currentReview,
      variantName: this.currentProductForReview!.variantName
    };
    this.ratingService.add(ratingItem).then(() => {
      this.isAddingReview = false;
      this.closeReviewModal();
    });
  }

  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  onRateChange(r: any) {
    console.log(r);
  }
}
