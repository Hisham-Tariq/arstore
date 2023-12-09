import {Injectable} from '@angular/core';
import {collection, collectionData, deleteDoc, doc, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {BehaviorSubject, combineLatestWith, Observable, zip} from "rxjs";
import {StockService} from "../Stock/stock.service";
import {ICartItem, ICartItemWithDetails} from "../../interfaces/i-cart-item";
import {ProductService} from "../Product/product.service";
import {map, take} from "rxjs/operators";
import {takeRightWhile} from "lodash-es";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  observableData: Observable<ICartItem[]>;
  data: ICartItem[];
  observableDataWithDetails: BehaviorSubject<ICartItemWithDetails[]> = new BehaviorSubject<ICartItemWithDetails[]>([]);
  dataWithDetails: ICartItemWithDetails[] = [];
  collectionReference: CollectionReference<ICartItem>;


  constructor(
    private firestore: Firestore,
    private stockService: StockService,
    private productService: ProductService,
  ) {
  }


  initializeCartDetails(userId: string) {
    this.collectionReference = collection(this.firestore, `users/${userId}/Cart`).withConverter(new ICartItemConverter());
    this.getAll();
  }

  checkItemAlreadyExistsInCart(item: ICartItem) {
    const found = this.data.find(x => x.productId === item.productId && x.stockId === item.stockId);
    return !!found;
  }

  async add(item: ICartItem): Promise<any> {
    if(this.checkItemAlreadyExistsInCart(item)){
      const oldItem = this.data.find(x => x.productId === item.productId && x.stockId === item.stockId)!;
      let itemWithDetail = this.dataWithDetails.find(x => x.productId === item.productId && x.stockId === item.stockId)!;
      if(itemWithDetail.quantity + item.quantity > itemWithDetail.inStockQuantity){
        return {
          status: 400,
          message: `You can't add more than ${itemWithDetail.inStockQuantity} items of this product already have ${itemWithDetail.quantity} items in your cart`
        };
      }
      oldItem.quantity += item.quantity;
      await this.update(oldItem);
      return {
        status: 200,
        message: `Item added to cart`
      }
    } else {
      let itemDoc = doc(this.collectionReference);
      await setDoc(itemDoc, item);
      return {
        status: 200,
        message: `Item added to cart`
      }
    }
  }

  getAll(): Observable<ICartItemWithDetails[]> {
    this.observableData = collectionData(this.collectionReference);
    this.productService.data.pipe(combineLatestWith(this.stockService.observableData)).pipe(combineLatestWith(this.observableData)).subscribe(([[products, stocks], cartItems]) => {
      this.data = cartItems;
      let itemsWithDetails: ICartItemWithDetails[] = [];
      cartItems.forEach(item => {
        let product = products.find(product => product.id === item.productId)!;
        if (typeof product === 'undefined') return;
        let stock = stocks.find(stock => stock.id === item.stockId)!;
        if (typeof stock === 'undefined') return;
        let totalPrice = item.quantity * stock.retailerPrice;
        let discountedPrice = stock.retailerPrice;
        if(product.discount != 0){
          totalPrice -= (totalPrice * (product.discount / 100));
          discountedPrice -= (discountedPrice * (product.discount / 100));
        }
        itemsWithDetails.push({
          ...item,
          // @ts-ignore
          thumbnail: product.images[item.color]['thumbnail'],
          inStockQuantity: stock.totalQuantity,
          price: stock.retailerPrice,
          productName: product.name,
          totalRetailPrice: item.quantity * stock.retailerPrice,
          totalPrice,
          discountedPrice,
          status: product.status,
        });
      });
      this.dataWithDetails = itemsWithDetails;
      this.observableDataWithDetails.next(itemsWithDetails)
    });
    return this.observableDataWithDetails;
  }


  delete(cartItem: Partial<ICartItem>): Promise<any> {
    return deleteDoc(doc(this.collectionReference, cartItem.id));
  }

   update(cartItem: Partial<ICartItem>): Promise<any> {
    const docRef = doc(this.collectionReference, cartItem.id);
    return updateDoc(docRef, {
      quantity: cartItem.quantity
    });
  }


  // observable totalItems
  totalItems(): Observable<number> {
    return this.observableDataWithDetails.pipe(map((state) =>
      state.reduce((acc, curr) => acc + curr.quantity, 0)
    ))
  }

  // find total cart price with discount
  totalCartPrice(): Observable<number> {
    return this.observableDataWithDetails.pipe(map((state) =>
      state.reduce((acc, curr) => acc + curr.totalPrice, 0)
    ))
  }

  clearCart(){
    this.dataWithDetails.forEach(item => {
      this.delete(item);
    });
  }

}


class ICartItemConverter implements firebase.firestore.FirestoreDataConverter<ICartItem> {
  toFirestore(data: ICartItem): DocumentData {
    return {
      productId: data.productId,
      stockId: data.stockId,
      color: data.color,
      quantity: data.quantity,
    }
  }

  fromFirestore(data: DocumentData): ICartItem {
    return {
      id: data['id'],
      productId: data['get']('productId'),
      stockId: data['get']('stockId'),
      color: data['get']('color'),
      quantity: data['get']('quantity'),
    }
  }
}
