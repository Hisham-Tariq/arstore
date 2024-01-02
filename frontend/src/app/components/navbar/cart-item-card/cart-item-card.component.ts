import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AddToCartData, CartItem, CartService} from "../../../services/Cart/cart.service";

@Component({
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.scss']
})
export class CartItemCardComponent implements OnInit, AfterViewInit {
  @Input() cartItem: CartItem;
  @Output() reCheckCartState = new EventEmitter();
  @ViewChild('outStockMessage') outStockMessage: any;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  inStock: boolean = false;
  quantity: number;
  isAskingForConfirmation: boolean = false;

  constructor(
    private cartService: CartService
  ) {}


  ngOnInit(): void {
    this.quantity = this.cartItem.quantity;
    this.inStock = this.cartItem.quantity <= this.currentVariant.stock;
  }

  get currentVariant(){
    return this.cartItem.product.variants.find(value => value.name === this.cartItem.variantName)!
  }

  ngAfterViewInit(): void {
    // if(this.product.inStockQuantity == 0){
    //   this.outStockMessage.nativeElement.innerText = 'Out of stock';
    // }
    // if(this.product.quantity > this.product.inStockQuantity) {
    //   this.outStockMessage.nativeElement.innerText = 'Only ' + this.product.inStockQuantity + ' in stock';
    // }
  }

  get isCartProductActive(): boolean {
    return this.cartItem.product.status === 'active';
  }

  get isCartProductTotallyOutOfStock(): boolean {
    return this.currentVariant.stock <= 0 && !this.inStock
  }

  get isCartProductPartiallyOutOfStock(): boolean {
    return this.currentVariant.stock > 0 && !this.inStock
  }

  incrementQuantity() {
    if(this.quantity < this.currentVariant.stock) {
      this.quantity++;
      this.updateQuantity();
    } else {
      alert("We don't have enough stock for this product");
    }
    this.reCheckCartState.emit();
  }

  decrementQuantity() {
    if(this.quantity > 1) {
      this.quantity--;
      this.updateQuantity();
    } else {
      alert("You can't have less than 1 item");
    }
    this.reCheckCartState.emit();
  }

  onQuantityChange() {
    if(this.quantity > this.currentVariant.stock) {
      setTimeout(() => {
        this.quantity = this.currentVariant.stock;
      }, 50);
      alert("We don't have enough stock for this product");
    } else if (this.quantity < 1) {
      setTimeout(() => {
        this.quantity = 1;
      }, 50);
      alert("You can't have less than 1 item");
    } else {
      this.updateQuantity();
    }
    this.reCheckCartState.emit();
  }

  updateQuantity() {
    const data = <AddToCartData>{
      variantName: this.currentVariant.name,
      productId: this.cartItem.product.id,
      quantity: this.quantity,
    }
    this.cartService.updateQuantity(this.cartItem.product.id, this.currentVariant.name, this.quantity);
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
