import {Injectable} from '@angular/core';

import {BehaviorSubject, firstValueFrom} from "rxjs";
import {Product, ReflectionUser} from "../../interfaces";
import {ApiService} from "../ApiBaseService/api.service";
import {CartService} from "../Cart/cart.service";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private endpoint = 'orders';

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.authService.authState$.subscribe(async (user) => {
      if (user === null) {
        this.ordersSubject.next([]);
      } else {
        if (user.type == 'admin'){
         this.getOrders()
        } else {
          this.getOrdersByUserId(user.id);
        }
      }
    });

  }

  async createOrder(userAddressInfo: UserAddressInfo): Promise<Order | void> {
    const cart = await this.cartService.getCart()
    if (!cart || cart.items.length == 0){
      alert("Cart is empty")
      return
    }
    const user = await firstValueFrom(this.authService.authState$)
    if (!user){
      alert("User is not logged in")
      return
    }
    const createOrderData: CreateOrderData = {
      userId: user.id,
      products: cart.items.map<CreateOrderProduct>(item => {
        return {
          product: item.product.id,
          quantity: item.quantity,
          variantName: item.variantName,
          pricePerQty: item.product.variants.find(variant => variant.name === item.variantName)!.price,
        }
      })
    }
    const order = await this.apiService.post<Order>(this.endpoint, createOrderData);
    await this.cartService.clearCart();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    const orders = await this.apiService.get<Order[]>(this.endpoint);
    this.ordersSubject.next(orders);
    return orders;
  }

  getOrderById(orderId: string): Promise<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/${orderId}`);
  }

  updateOrder(orderId: string, orderData: any): Promise<Order> {
    return this.apiService.put<Order>(`${this.endpoint}/${orderId}`, orderData);
  }

  deleteOrder(orderId: string): Promise<{ message: string }> {
    return this.apiService.delete<{ message: string }>(`${this.endpoint}/${orderId}`);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.apiService.get<Order[]>(`${this.endpoint}/user/${userId}`);
    this.ordersSubject.next(orders)
    return orders;
  }

  async getCurrentUserOrders(): Promise<Order[]> {
    const user = await firstValueFrom(this.authService.authState$)
    if (!user) return []
    return this.getOrdersByUserId(user.id!);
  }


  generateRandomOrderId(): string {
    //Math.random() * (max - min) + min;
    // REF-137633
    // REF-123769
    // REF-455633
    // OrderId with these pattern will be generated
    return "REF-" + Math.floor(Math.random() * 1000000);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    // if(status == 'delivered'){
    //   let notification = <INotification>{
    //     type: 'order',
    //     title: 'Order Delivered',
    //     message: `Your order with id ${item.id} has successfully been delivered.`,
    //   }
    //   return this.notificationService.add(notification, item.userId);
    // }

    const response = await this.apiService.put<Order>(`${this.endpoint}/${orderId}/status`, {
      status: status,
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


// order.interface.ts
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderStatusChangedHistory {
  from: OrderStatus,
  to: OrderStatus,
  date: Date,
}

export interface Order {
  id: string;
  user: ReflectionUser;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  statusChangedHistory: OrderStatusChangedHistory[],
  deliveredDate?: Date,
}


export interface OrderProduct {
  product: Product;
  quantity: number;
  variantName: string;
  reviewed: Boolean,
  stars: number,
}

export interface CreateOrderProduct {
  product: string,
  quantity: number,
  variantName: string,
  pricePerQty: number,
}


export interface CreateOrderData{
  products: CreateOrderProduct[],
  userId: string,
}

export interface UserAddressInfo {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}
