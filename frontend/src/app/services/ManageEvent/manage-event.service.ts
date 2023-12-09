import { Injectable } from '@angular/core';

import firebase from "firebase/compat";
import {Firestore, doc, setDoc, collection, collectionData, deleteDoc, updateDoc} from '@angular/fire/firestore';
import {IEvents} from "../../interfaces/IEvents";

import {randomId} from "../../utils";
import {CollectionReference, DocumentData} from 'firebase/firestore'
import {Observable} from "rxjs";
import {MainCategoryInterface} from "../../interfaces";
import {ProductService} from "../Product/product.service";
import { GlobalService } from '../global/global.service';
import {HttpClient} from "@angular/common/http";
import {SubscriberService} from "../Subscribers/subscriber.service";
import {UserService} from "../Customer/user.service";
import {take} from "rxjs/operators";
import {NotificationService} from "../Notification/notification.service";
import {INotification} from "../../interfaces/i-notification";

@Injectable({
  providedIn: 'root'
})
export class ManageEventService {
  collectionReference: CollectionReference<IEvents>;
  data: Observable<IEvents[]>;
  constructor(
    private firestore: Firestore,
    private productService: ProductService,
    private globalService: GlobalService,
    private http: HttpClient,
    private subsribersService: SubscriberService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.collectionReference = collection(this.firestore, 'Events').withConverter(new EventsInterfaceConverter());
    this.getAll();
  }

  async add(item: IEvents): Promise<void>{
    let itemDoc = doc(this.collectionReference, item.id);
    await setDoc(itemDoc, item);
    this.sendEventMailToSubscribers(item);
    let subscription = this.userService.getAllUsers().subscribe(users => {
      console.log(users);
      users.forEach(user => {
        if(user.type != 'admin') {
          let notification = <INotification>{
            title: item.name,
            message: `A new event has been started with ${item.discount}% discount`,
            type: 'event',
          };
          this.notificationService.add(notification, user.id);
        }
      })
    })
    this.productService.addProductsToEvent(item);
  }
  getAll(): Observable<IEvents[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }
  async delete(item: IEvents): Promise<any>{
    await deleteDoc(doc(this.collectionReference, item.id));
    this.productService.removeFromEvents(item.products);
  }
  async update(item: IEvents, removeProducts: string[]): Promise<any> {
    await updateDoc(doc(this.collectionReference, item.id), item);
    this.productService.removeFromEvents(removeProducts)
  }

  async sendEventMailToSubscribers(item: IEvents){
    this.userService.getAllUsers().subscribe(
      async (users) => {
        console.log(users.length);
        let emails = (await this.subsribersService.getSubscribedUsers()) || [];
        let usersEmail: string[] = [];
        users.forEach(user => {
          if(user.type != 'admin') usersEmail.push(user.email);
        });

        emails = emails.concat(usersEmail);
        // filter the duplicates
        emails = emails.filter((item, index) => emails.indexOf(item) === index);
        if(emails.length == 0) return;
        let url = this.globalService.backendUrl + '/send-event-mail';
        this.http.post(url, {
          "emails": emails,
          "eventName": item.name,
          "discount": item.discount,
        }).subscribe(value => {
          console.log(value);
        })
      }
    )
    // send the item.name and discount on endpoint localhost:3000/api/sendMail

  }

}


class EventsInterfaceConverter implements firebase.firestore.FirestoreDataConverter<IEvents> {
  toFirestore(data: IEvents): DocumentData {
    return {
      name: data.name,
      validUpTo: data.validUpTo,
      products: data.products.join(','),
      discount: data.discount
    }
  }

  fromFirestore(data: DocumentData): IEvents {
    return {
      id: data['id'],
      name: data['get']('name'),
      validUpTo: data['get']('validUpTo'),
      products: data['get']('products').toString().split(','),
      discount: data['get']('discount')
    }
  }
}

