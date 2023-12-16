import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IOrderProduct, IOrderWithProducts} from "../../../../interfaces/i-order";
import {ProductService} from "../../../../services/Product/product.service";
import {Router} from "@angular/router";
import {CartService} from "../../../../services/Cart/cart.service";
import {StockService} from "../../../../services/Stock/stock.service";
import {GlobalService} from "../../../../services/global/global.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderService} from "../../../../services/order/order.service";
import * as util from "util";
import {RatingService} from "../../../../services/rating/rating.service";
import {IRating} from "../../../../interfaces/i-rating";
import {AuthService} from "../../../../services/Authentication";

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit {
  @Input() order: IOrderWithProducts;
  @Input() isOdd: boolean;
  @ViewChild('reviewModal') modal: ElementRef;
  @ViewChild('rProductImage') rProductImage: ElementRef;
  @ViewChild('rProductName') rProductName: ElementRef;


  currentProductForReview: IOrderProduct | null = null;
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

  onViewProduct(productId: string){
    this.productService.data.subscribe(data => {
      for(let product of data){
        if(product.id === productId){
          this.router.navigateByUrl(`/product-detail/${productId}`);
        }
      }
    });
  }

  onBugAgain(index: number){
    let product = this.order.products[index];
    this.stockService.observableData.subscribe(data => {
      for(let stock of data){
        if(stock.color == product.color && stock.product == product.productId){
          this.cartService.add(
            {
              productId: product.productId,
              color: product.color,
              quantity: 1,
              stockId: stock.id!,
            }
          ).then(() => {
            this.globalService.openCartDrawer();
          });
        }
      }
    });
  }

  showInvoice() {
    this.router.navigateByUrl(`/invoice/${this.order.id}`);
  }

  openReviewModal(product: IOrderProduct) {
    this.currentProductForReview = product;
    this.setReviewModalContent();
    this.modal.nativeElement.classList.toggle('hidden');
    this.isUserReviewing = true;
  }

  closeReviewModal() {
    if(this.isAddingReview) return;
    this.currentProductForReview = null;
    this.isUserReviewing = false;
    setTimeout(() => {
      this.modal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  setReviewModalContent(){
    this.rProductImage.nativeElement.src = this.currentProductForReview?.thumbnail;
    this.rProductName.nativeElement.innerText = this.currentProductForReview?.name;
  }

  sendReview() {
    if(this.currentRating === 0){
      alert('Please rate the product');
      return;
    }
    if (this.currentReview.length < 20) {
      alert('Please write at least 20 characters');
      return;
    }
    this.isAddingReview = true;
    let ratingItem = <IRating>{
      orderId: this.order.id,
      productId: this.currentProductForReview?.productId,
      rating: this.currentRating,
      comment: this.currentReview,
      orderProductId: this.currentProductForReview?.id,
      userName:  'FirstNameHere LastNameHere',
      userId: 'UserIdHere',
      createdAt: 'Nothing',
    };
    this.ratingService.add(ratingItem).then(() => {
      this.isAddingReview = false;
      this.closeReviewModal();
    });
    // this.orderService.addProductRating(
    //   this.currentRating,
    //   this.currentReview,
    //   this.currentProductForReview!,
    // ).then(() => {
    //   this.closeReviewModal();
    //   this.isAddingReview = false;
    // });
  }
  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  onRateChange(r: any) {
    console.log(r);
  }
}
