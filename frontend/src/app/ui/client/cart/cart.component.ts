import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Cart, CartItem, CartService} from "../../../services/Cart/cart.service";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    totalCartPrice: number  = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private cartService: CartService,
    ) {
      this.cartService.totalCartPrice().subscribe(
        (totalPrice: number) => {
          this.totalCartPrice = totalPrice;
        }
      );
      this.cartService.data.subscribe(
        (data) => {
          this.cartItems = data!.items;
          console.log(this.cartItems);
        }
      );
    }

    ngOnInit(): void {}

    onCheckOutButtonClicked(): void {
        this._router.navigateByUrl('/check-out');
    }
}
