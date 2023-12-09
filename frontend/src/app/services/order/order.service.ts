import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query, serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import {IOrder, IOrderProduct, IOrderWithProducts, OrderStatus} from 'src/app/interfaces/i-order';
import firebase from "firebase/compat";
import {BehaviorSubject, combineLatestWith, forkJoin, Observable, zip} from "rxjs";
import {StockService} from "../Stock/stock.service";
import {ProductService} from "../Product/product.service";
import {AuthService} from "../Authentication";
import {ICartItemWithDetails} from "../../interfaces/i-cart-item";
import {authState, getAuth} from "@angular/fire/auth"
import {CartService} from "../Cart/cart.service";
import {map} from "rxjs/operators";
import {NotificationService} from "../Notification/notification.service";
import {INotification} from "../../interfaces/i-notification";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  observableData: BehaviorSubject<IOrderWithProducts[]>;
  observableOrders: BehaviorSubject<IOrder[]> = new BehaviorSubject<IOrder[]>([]);
  data: IOrderWithProducts[];
  collectionReference: CollectionReference<IOrder>;
  orderProductCollection: CollectionReference<IOrderProduct>;
  private allOrders: Observable<IOrder[]>;
  private allOrderProducts: Observable<IOrderProduct[]>;


  constructor(
    private firestore: Firestore,
    private stockService: StockService,
    private productService: ProductService,
    private auth: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    this.collectionReference = collection(this.firestore, 'Orders').withConverter(new IOrderConverter());
    this.orderProductCollection = collection(this.firestore, 'OrderProducts').withConverter(new IOrderProductConverter());
    this.observableData = new BehaviorSubject<IOrderWithProducts[]>([]);
    authState(getAuth()).subscribe(user => {
      if (user) {
        this.getAllCurrentUserOrders();
        if (this.auth.user?.type == 'admin') {
          this.getAll().subscribe(orders => {
            this.observableOrders.next(orders);
          })
        }
      } else {
        this.observableData.next([]);
      }
    });
  }


  async add(item: Partial<IOrder>, products: ICartItemWithDetails[]): Promise<void> {
    console.log('add order');
    item.id = this.generateRandomOrderId();
    item.userId = this.auth.userId;
    item.status = 'pending';
    let itemDoc = doc(this.collectionReference, item.id);
    await setDoc(itemDoc, item);
    this.addProductInOrders(item.id, products);
  }

  private addProductInOrders(id: string, products: ICartItemWithDetails[]) {
    console.log('add product in order');
    products.forEach(async (product) => {
      let orderProduct = <IOrderProduct>{
        color: product.color,
        orderId: id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        thumbnail: product.thumbnail,
        userId: this.auth.userId,
        name: product.productName,
        consumerPrice: product.price,
      };
      let orderProductDoc = doc(this.orderProductCollection);
      await setDoc(orderProductDoc, orderProduct);

      this.stockService.updateStockQuantity(product.stockId, product.quantity);
    });
    this.cartService.clearCart();
  }


  getAllCurrentUserOrders(): Observable<IOrder[]> {
    const userId = this.auth.user!.id;
    if (this.auth.user?.type == 'admin') {
      this.allOrders = collectionData(query(this.collectionReference, orderBy("date", "desc",)))
      this.allOrderProducts = collectionData(this.orderProductCollection);
    } else {
      this.allOrders = collectionData(query(this.collectionReference, where('userId', '==', userId), orderBy("date", "desc",)))
      this.allOrderProducts = collectionData(query(this.orderProductCollection, where('userId', '==', userId)))
    }
    // this.allOrderProducts.subscribe(o => {console.log("sdkj sdkjfds dfjkdsmf")})
    // this.allOrders.pipe(combineLatestWith(this.allOrderProducts)).subscribe()
    this.allOrders.pipe(combineLatestWith(this.allOrderProducts)).subscribe(([orders, orderProducts]) => {
      this.data = [];
      orders.forEach((order) => {
        let orderWithProducts = <IOrderWithProducts>{
          ...order,
          products: []
        };
        orderProducts.forEach((orderProduct) => {
          if (orderProduct.orderId === order.id) {
            orderWithProducts.products.push(orderProduct);
          }
        });
        this.data.push(orderWithProducts);
      });
      this.observableData.next(this.data);
    });
    return this.observableData;
  }


  generateRandomOrderId(): string {
    //Math.random() * (max - min) + min;
    // REF-137633
    // REF-123769
    // REF-455633
    // OrderId with these pattern will be generated
    return "REF-" + Math.floor(Math.random() * 1000000);
  }

  async updateOrderStatus(item: IOrder, status: OrderStatus): Promise<void> {
    await updateDoc(doc(this.collectionReference, item.id), {
      status: status,
      deliveryDate: serverTimestamp(),
    });
    if(status == 'delivered'){
      let notification = <INotification>{
        type: 'order',
        title: 'Order Delivered',
        message: `Your order with id ${item.id} has successfully been delivered.`,
      }
      return this.notificationService.add(notification, item.userId);
    }
  }

  private getAll(): Observable<IOrder[]> {
    this.allOrders = collectionData(query(this.collectionReference, orderBy("date", "desc")));
    return this.allOrders;
  }

  async getOrderDetail(orderId: string): Promise<Observable<IOrderWithProducts>> {
    const order = await getDoc(doc(this.collectionReference, orderId));
    return collectionData(query(this.orderProductCollection, where('orderId', '==', orderId))).pipe(map((orderProducts) => {
      return <IOrderWithProducts><unknown>{
        ...order.data(),
        products: orderProducts
      };
    }));
  }

  setProductAsReviewed(orderProductId: string, rating: number): Promise<any> {
    return updateDoc(doc(this.orderProductCollection, orderProductId), {
      rating: rating,
    });
  }

}


function formatDate(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + strMinutes + ' ' + ampm;
  return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

class IOrderConverter implements firebase.firestore.FirestoreDataConverter<IOrder> {
  toFirestore(data: IOrder): DocumentData {
    return {
      userId: data.userId,
      date: serverTimestamp(),
      totalPrice: data.totalPrice,
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      status: data.status,
    }
  }

  fromFirestore(data: DocumentData): IOrder {
    return {
      id: data['id'],
      userId: data['get']('userId'),
      date: data['get']('date'),
      totalPrice: data['get']('totalPrice'),
      email: data['get']('email'),
      phone: data['get']('phone'),
      firstName: data['get']('firstName'),
      lastName: data['get']('lastName'),
      address: data['get']('address'),
      city: data['get']('city'),
      state: data['get']('state'),
      zipCode: data['get']('zipCode'),
      status: data['get']('status'),
      deliveryDate: data['get']('deliveryDate') || null,
    }
  }
}


class IOrderProductConverter implements firebase.firestore.FirestoreDataConverter<IOrderProduct> {
  toFirestore(data: IOrderProduct): DocumentData {
    return {
      orderId: data.orderId,
      productId: data.productId,
      color: data.color,
      quantity: data.quantity,
      price: data.price,
      thumbnail: data.thumbnail,
      userId: data.userId,
      name: data.name,
      consumerPrice: data.consumerPrice
    }
  }

  fromFirestore(data: DocumentData): IOrderProduct {
    return {
      id: data['id'],
      productId: data['get']('productId'),
      orderId: data['get']('orderId'),
      color: data['get']('color'),
      quantity: data['get']('quantity'),
      price: data['get']('price'),
      thumbnail: data['get']('thumbnail'),
      userId: data['get']('userId'),
      name: data['get']('name'),
      rating: data['get']('rating') || 0,
      consumerPrice: data['get']('consumerPrice') || data['get']('price') - 200,
    }
  }
}
