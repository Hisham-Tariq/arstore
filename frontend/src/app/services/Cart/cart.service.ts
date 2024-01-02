import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, firstValueFrom} from "rxjs";
import {map} from "rxjs/operators";
import {ApiService} from "../ApiBaseService/api.service";
import {Product} from "../../interfaces";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private endpoint = 'cart';
  cartSubject = new BehaviorSubject<Cart | null>(null);
  data = this.cartSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.authService.authState$.subscribe(async (user) => {
      if (user) {
        await this.getCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  async getCart(): Promise<Cart | null> {
    try {
      const user = await firstValueFrom(this.authService.authState$);
      const cart = await this.apiService.get<Cart>(`${this.endpoint}/user/${user?._id}`);
      this.cartSubject.next(cart);
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return null;
    }
  }

  async addToCart(data: AddToCartData): Promise<Cart | null> {
    try {
      const user = await firstValueFrom(this.authService.authState$);
      const cart = await this.apiService.post<Cart>(`${this.endpoint}/user/${user?._id}/add`, data);
      this.cartSubject.next(cart);
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  // increment or decrement quantity
  async updateQuantity(productId: string, variantName: string, quantity: number): Promise<Cart | null> {

    try {
      const user = await firstValueFrom(this.authService.authState$);
      const cart = await this.apiService.post<Cart>(`${this.endpoint}/user/${user?._id}/update`, {
        productId,
        variantName,
        quantity
      });
      this.cartSubject.next(cart);
      return cart;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return null;
    }
  }

  async removeFromCart(productId: string, variantName: string): Promise<Cart | null> {
    try {
      const user = await firstValueFrom(this.authService.authState$);
      const cart = await this.apiService.post<Cart>(`${this.endpoint}/user/${user?._id}/remove`, {
        productId,
        variantName
      });
      this.cartSubject.next(cart);
      return cart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  }

  async clearCart(): Promise<Cart | null> {
    try {
      const user = await firstValueFrom(this.authService.authState$);
      const cart = await this.apiService.post<Cart>(`${this.endpoint}/user/${user?.id}/clear`, {});
      this.cartSubject.next(cart);
      return cart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return null;
    }
  }


  // observable totalItems
  totalItems(): Observable<number> {
    return this.data.pipe(map((state) => {
      if (state == null) return 0;
      return state!.items.reduce((acc, curr) => acc + curr.quantity, 0)
    }))
  }

  // find total cart price with discount
  totalCartPrice(): Observable<number> {
    return this.data.pipe(map((state) => {
        if (state == null) return 0;
        return state!.items.reduce((acc, curr) => {
          const price = curr.product.variants.find((v) => v.name == curr.variantName)!.price;
          return acc + price * curr.quantity
        }, 0)
      }
    ))
  }

}


// class ICartItemConverter implements firebase.firestore.FirestoreDataConverter<ICartItem> {
//   toFirestore(data: ICartItem): DocumentData {
//     return {
//       productId: data.productId,
//       stockId: data.stockId,
//       color: data.color,
//       quantity: data.quantity,
//     }
//   }
//
//   fromFirestore(data: DocumentData): ICartItem {
//     return {
//       id: data['id'],
//       productId: data['get']('productId'),
//       stockId: data['get']('stockId'),
//       color: data['get']('color'),
//       quantity: data['get']('quantity'),
//     }
//   }
// }


export interface CartItem {
  product: Product;
  variantName: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
}

export interface AddToCartData {
  productId: string;
  variantName: string;
  quantity?: number;
}
