import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ICartItemWithDetails} from "../../../../interfaces/i-cart-item";
import {CartService} from "../../../../services/Cart/cart.service";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {
  @Input() product: ICartItemWithDetails;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;
  constructor(
    public cartService: CartService
  ) { }


  ngOnInit(): void {
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
