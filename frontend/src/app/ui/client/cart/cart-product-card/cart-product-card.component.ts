import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ICartItemWithDetails} from "../../../../interfaces/i-cart-item";
import {CartService} from "../../../../services/Cart/cart.service";

@Component({
  selector: 'app-cart-product-card',
  templateUrl: './cart-product-card.component.html',
  styleUrls: ['./cart-product-card.component.scss']
})
export class CartProductCardComponent implements OnInit {
  @Input() product: ICartItemWithDetails;
  @ViewChild('outStockMessage') outStockMessage: any;
  inStock: boolean = false;
  quantity: number;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.quantity = this.product.quantity;
    this.inStock = this.product.quantity <= this.product.inStockQuantity;
    if(this.product.inStockQuantity == 0){
      this.outStockMessage.nativeElement.innerText = 'Out of stock';
    }
    if(this.product.quantity > this.product.inStockQuantity) {
      this.outStockMessage.nativeElement.innerText = 'Only ' + this.product.inStockQuantity + ' in stock';
    }
  }

  incrementQuantity() {
    if(this.quantity < this.product.inStockQuantity) {
      this.quantity++;
      this.updateQuantity();
    } else {
      alert("We don't have enough stock for this product");
    }
  }

  decrementQuantity() {
    if(this.quantity > 1) {
      this.quantity--;
      this.updateQuantity();
    } else {
      alert("You can't have less than 1 item");
    }
  }

  onQuantityChange() {
    if(this.quantity > this.product.inStockQuantity) {
      this.quantity = this.product.inStockQuantity;
      alert("We don't have enough stock for this product");
    } else if (this.quantity < 1) {
      this.quantity = 1;
      alert("You can't have less than 1 item");
    } else {
      this.updateQuantity();
    }
  }

  updateQuantity() {
    this.cartService.update({quantity: this.quantity, id: this.product.id});
  }

  deleteFromCart() {
    this.cartService.delete({id: this.product.id});
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
}
