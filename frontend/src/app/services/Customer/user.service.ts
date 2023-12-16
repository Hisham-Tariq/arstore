import {Injectable} from '@angular/core';
import {ReflectionUser} from "../../interfaces";
import {OrderService} from "../order/order.service";
import {BehaviorSubject, combineLatestWith, Observable} from "rxjs";
import {ICustomers} from "../../interfaces/i-customers";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  observableData: BehaviorSubject<ICustomers[]>;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) {
    this.observableData = new BehaviorSubject<ICustomers[]>([]);
  }

  getAllUsers(): Observable<ReflectionUser[]> {
    return new Observable<ReflectionUser[]>(subscriber => {
      subscriber.next([]);
    })
  }

  fetchAllCustomers() {
    // this.orderService.observableOrders.pipe(combineLatestWith(this.getAllUsers())).subscribe(([orders, users]) => {
    //   // find unique users from orders and count how many times they have ordered
    //   let customers: ICustomers[] = [];
    //   orders.forEach(order => {
    //     let customer = customers.find(customer => customer.id === order.userId && customer.phone === order.phone);
    //     if (customer) {
    //       customer.totalOrders++;
    //     } else {
    //       let user = users.find(user => user.id === order.userId)!;
    //       if (user) {
    //         customer = {
    //           id: order.userId,
    //           phone: order.phone,
    //           totalOrders: 1,
    //           name: user.firstName + ' ' + user.lastName,
    //           email: user.email,
    //         };
    //         customers.push(customer);
    //       }
    //     }
    //   });
    //   // filter users from all users
    //   this.observableData.next(customers);
    // });
  }


  setUserBillingInformation(ReflectionUser: Partial<ReflectionUser>): Promise<any> {
    // delete id and all the undefined fields
    delete ReflectionUser.id;
    delete ReflectionUser.createdAt;
    return Promise.resolve();
  }

}
