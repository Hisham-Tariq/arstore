import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ICartItemWithDetails} from "../../../interfaces/i-cart-item";
import {CartService} from "../../../services/Cart/cart.service";

@Component({
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.scss']
})
export class CartItemCardComponent implements OnInit, AfterViewInit {
  @Input() product: ICartItemWithDetails;
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
    this.quantity = this.product.quantity;
    this.inStock = this.product.quantity <= this.product.inStockQuantity;
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
    return this.product.status === 'active';
  }

  get isCartProductTotallyOutOfStock(): boolean {
    return this.product.inStockQuantity <= 0 && !this.inStock
  }

  get isCartProductPartiallyOutOfStock(): boolean {
    return this.product.inStockQuantity > 0 && !this.inStock
  }

  incrementQuantity() {
    if(this.quantity < this.product.inStockQuantity) {
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
    if(this.quantity > this.product.inStockQuantity) {
      setTimeout(() => {
        this.quantity = this.product.inStockQuantity;
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
