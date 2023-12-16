import {Injectable} from '@angular/core';

import {IOrder, IOrderProduct, IOrderWithProducts, OrderStatus} from 'src/app/interfaces/i-order';
import {BehaviorSubject, combineLatestWith, forkJoin, Observable, zip} from "rxjs";
import {StockService} from "../Stock/stock.service";
import {ProductService} from "../Product/product.service";
import {AuthService} from "../Authentication";
import {ICartItemWithDetails} from "../../interfaces/i-cart-item";
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
  private allOrders: Observable<IOrder[]>;
  private allOrderProducts: Observable<IOrderProduct[]>;


  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private auth: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    this.observableData = new BehaviorSubject<IOrderWithProducts[]>([]);
    // authState(getAuth()).subscribe(user => {
    //   if (user) {
    //     this.getAllCurrentUserOrders();
    //     if (this.auth.user?.type == 'admin') {
    //       this.getAll().subscribe(orders => {
    //         this.observableOrders.next(orders);
    //       })
    //     }
    //   } else {
    //     this.observableData.next([]);
    //   }
    // });
  }


  async add(item: Partial<IOrder>, products: ICartItemWithDetails[]): Promise<void> {
    console.log('add order');
    item.id = this.generateRandomOrderId();
    // item.userId = this.auth.userId;
    item.status = 'pending';
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
        userId: '',
        name: product.productName,
        consumerPrice: product.price,
      };

      this.stockService.updateStockQuantity(product.stockId, product.quantity);
    });
    this.cartService.clearCart();
  }


  getAllCurrentUserOrders(): Observable<IOrder[]> {
    // const userId = this.auth.user!.id;
    // if (this.auth.user?.type == 'admin') {
    //   this.allOrders = collectionData(query(this.collectionReference, orderBy("date", "desc",)))
    //   this.allOrderProducts = collectionData(this.orderProductCollection);
    // } else {
    //   this.allOrders = collectionData(query(this.collectionReference, where('userId', '==', userId), orderBy("date", "desc",)))
    //   this.allOrderProducts = collectionData(query(this.orderProductCollection, where('userId', '==', userId)))
    // }
    // // this.allOrderProducts.subscribe(o => {console.log("sdkj sdkjfds dfjkdsmf")})
    // // this.allOrders.pipe(combineLatestWith(this.allOrderProducts)).subscribe()
    // this.allOrders.pipe(combineLatestWith(this.allOrderProducts)).subscribe(([orders, orderProducts]) => {
    //   this.data = [];
    //   orders.forEach((order) => {
    //     let orderWithProducts = <IOrderWithProducts>{
    //       ...order,
    //       products: []
    //     };
    //     orderProducts.forEach((orderProduct) => {
    //       if (orderProduct.orderId === order.id) {
    //         orderWithProducts.products.push(orderProduct);
    //       }
    //     });
    //     this.data.push(orderWithProducts);
    //   });
    //   this.observableData.next(this.data);
    // });
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
    // await updateDoc(doc(this.collectionReference, item.id), {
    //   status: status,
    //   deliveryDate: serverTimestamp(),
    // });
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
    // this.allOrders = collectionData(query(this.collectionReference, orderBy("date", "desc")));
    return this.allOrders;
  }

  async getOrderDetail(orderId: string): Promise<any> {
    // const order = await getDoc(doc(this.collectionReference, orderId));
    // return collectionData(query(this.orderProductCollection, where('orderId', '==', orderId))).pipe(map((orderProducts) => {
    //   return <IOrderWithProducts><unknown>{
    //     ...order.data(),
    //     products: orderProducts
    //   };
    // }));
    return Promise.resolve();
  }

  setProductAsReviewed(orderProductId: string, rating: number): Promise<any> {
    // return updateDoc(doc(this.orderProductCollection, orderProductId), {
    //   rating: rating,
    // });
    return Promise.resolve();
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
