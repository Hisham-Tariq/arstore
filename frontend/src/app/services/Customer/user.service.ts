import { Injectable } from '@angular/core';
import { ReflectionUser } from '../../interfaces';
import { OrderService } from '../order/order.service';
import { BehaviorSubject, combineLatestWith, Observable } from 'rxjs';
import { ICustomers } from '../../interfaces/i-customers';
import { AuthService } from '../Authentication';
import { ApiService } from '../ApiBaseService/api.service';
import { map } from 'rxjs/operators';
import {CartService} from "../Cart/cart.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  customersSubject = new BehaviorSubject<ICustomers[]>([]);
  customers$ = this.customersSubject.asObservable();
  private endpoint = 'users'; // Adjust the endpoint based on your API routes

  constructor(
    private apiService: ApiService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  getUsers(): Promise<ReflectionUser[]> {
    return this.apiService.get<ReflectionUser[]>(this.endpoint);
  }

  async fetchAllCustomers() {
    //   get all users and map them to ICustomers
    const users = await this.apiService.get<ReflectionUser[]>(this.endpoint);
    const customers = users.map((user) => {
      return <ICustomers>{
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        totalOrders: 0,
      };
    });
    // get all orders and map them to ICustomers
    this.customersSubject.next(customers);
  }

  getCurrentUser(): Promise<ReflectionUser> {
    return this.apiService.get<ReflectionUser>(`${this.endpoint}/me`);
  }

  getUserById(userId: string): Promise<ReflectionUser> {
    return this.apiService.get<ReflectionUser>(`${this.endpoint}/${userId}`);
  }

  updateUser(userId: string, user: ReflectionUser): Promise<ReflectionUser> {
    return this.apiService.put<ReflectionUser>(`${this.endpoint}/${userId}`, user);
  }

  deleteUser(userId: string): Promise<{ message: string }> {
    return this.apiService.delete<{ message: string }>(`${this.endpoint}/${userId}`);
  }

  setUserBillingInformation(ReflectionUser: Partial<ReflectionUser>): Promise<any> {
    // delete id and all the undefined fields
    delete ReflectionUser.id;
    delete ReflectionUser.createdAt;
    return Promise.resolve();
  }
}
