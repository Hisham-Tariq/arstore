import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import {CollectionReference, DocumentData} from "firebase/firestore";
import {collection, collectionData, doc, Firestore, setDoc} from "@angular/fire/firestore";
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
  collectionReference: CollectionReference<ReflectionUser>;

  constructor(
    private firestore: Firestore,
    private orderService: OrderService,
    private authService: AuthService,
  ) {
    this.observableData = new BehaviorSubject<ICustomers[]>([]);
    this.collectionReference = collection(this.firestore, 'users').withConverter(new ReflectionUserConverter());
  }

  getAllUsers(): Observable<ReflectionUser[]> {
    return collectionData(this.collectionReference);
  }

  fetchAllCustomers() {
    this.orderService.observableOrders.pipe(combineLatestWith(this.getAllUsers())).subscribe(([orders, users]) => {
      // find unique users from orders and count how many times they have ordered
      let customers: ICustomers[] = [];
      orders.forEach(order => {
        let customer = customers.find(customer => customer.id === order.userId && customer.phone === order.phone);
        if(customer) {
          customer.totalOrders++;
        } else {
          let user = users.find(user => user.id === order.userId)!;
          if(user)
          {
            customer = {
              id: order.userId,
              phone: order.phone,
              totalOrders: 1,
              name: user.firstName + ' ' + user.lastName,
              email: user.email,
            };
            customers.push(customer);
          }
        }
      });
      // filter users from all users
      this.observableData.next(customers);
    });
  }


  setUserBillingInformation(ReflectionUser: Partial<ReflectionUser>): Promise<any> {
    let userId = this.authService.user?.id;
    let docRef = doc(this.firestore, 'users/' + userId);
    // delete id and all the undefined fields
    delete ReflectionUser.id;
    delete ReflectionUser.createdAt;
    return setDoc(docRef, ReflectionUser);
  }

}


class ReflectionUserConverter implements firebase.firestore.FirestoreDataConverter<ReflectionUser> {
  toFirestore(data: ReflectionUser): DocumentData {
    return {
    }
  }

  fromFirestore(data: DocumentData): ReflectionUser {
    return {
      id: data['id'],
      email: data['get']('email'),
      type: data['get']('type'),
      firstName: data['get']('firstName'),
      lastName: data['get']('lastName'),
      createdAt: data['get']('createdAt'),
      city: data['get']('city') || '',
      state: data['get']('state') || '',
      address: data['get']('address') || '',
      phone: data['get']('phone') || '',
      zip: data['get']('zip') || '',
    }
  }
}
