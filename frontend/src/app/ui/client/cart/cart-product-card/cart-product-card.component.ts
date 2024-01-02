import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddToCartData, CartItem, CartService} from "../../../../services/Cart/cart.service";

@Component({
  selector: 'app-cart-product-card',
  templateUrl: './cart-product-card.component.html',
  styleUrls: ['./cart-product-card.component.scss']
})
export class CartProductCardComponent implements OnInit {
  @Input() cartItem: CartItem;
  @ViewChild('outStockMessage') outStockMessage: any;
  inStock: boolean = false;
  quantity: number;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.quantity = this.cartItem.quantity;
    this.inStock = this.cartItem.quantity <= this.currentVariant.stock;
    if(this.currentVariant.stock == 0){
      this.outStockMessage.nativeElement.innerText = 'Out of stock';
    }
    if(this.cartItem.quantity > this.currentVariant.stock) {
      this.outStockMessage.nativeElement.innerText = 'Only ' + this.currentVariant.stock + ' in stock';
    }
  }

  get currentVariant(){
    return this.cartItem.product.variants.find(value => value.name === this.cartItem.variantName)!
  }

  incrementQuantity() {
    if(this.quantity < this.currentVariant.stock) {
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
    if(this.quantity > this.currentVariant.stock) {
      this.quantity = this.currentVariant.stock;
      alert("We don't have enough stock for this product");
    } else if (this.quantity < 1) {
      this.quantity = 1;
      alert("You can't have less than 1 item");
    } else {
      this.updateQuantity();
    }
  }

  updateQuantity() {
    const data = <AddToCartData>{
      productId: this.cartItem.product.id,
      quantity: this.quantity,
      variantName: this.currentVariant.name
    }
    this.cartService.addToCart(data);
  }

  deleteFromCart() {
    this.cartService.removeFromCart(this.cartItem.product.id, this.currentVariant.name);
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
