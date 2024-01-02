import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Cart, CartItem, CartService} from "../../../../services/Cart/cart.service";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {
  @Input() cartItem: CartItem;

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;
  constructor(
    public cartService: CartService
  ) { }


  ngOnInit(): void {
  }

  deleteFromCart() {
    this.cartService.removeFromCart(this.cartItem.product.id, this.cartItem.variantName);
  }

  confirmForDelete() {
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;
  }

  closeDeleteModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  get currentVariant(){
    return this.cartItem.product.variants.find(value => value.name === this.cartItem.variantName)!
  }

  get itemTotalPrice(){
    return this.cartItem.quantity * this.currentVariant.price;
  }
}
