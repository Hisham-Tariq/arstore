import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {OrderService} from "../order/order.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isCartOpen: boolean = false;
  cartState: BehaviorSubject<boolean>;
  backendUrl: string = 'http://localhost:3000';
  constructor() {
    this.cartState = new BehaviorSubject<boolean>(this.isCartOpen);
  }

  currentCartDrawerState() {
    return this.cartState.asObservable();
  }

  openCartDrawer() {
    this.isCartOpen = true;
    this.cartState.next(this.isCartOpen);
    document.getElementById('cartDrawer')!.classList.remove('hidden');
  }

  closeCartDrawer() {
    this.isCartOpen = false;
    this.cartState.next(this.isCartOpen);
    setTimeout(() => {
      document.getElementById('cartDrawer')!.classList.add('hidden')
    }, 500);
  }
}
