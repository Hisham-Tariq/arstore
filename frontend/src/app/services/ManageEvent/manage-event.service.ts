import { Injectable } from '@angular/core';

import {IEvents} from "../../interfaces/IEvents";

import {randomId} from "../../utils";
import {Observable, of} from "rxjs";
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
  data: Observable<IEvents[]> = of([]);
  constructor(
    private productService: ProductService,
    private globalService: GlobalService,
    private http: HttpClient,
    private subsribersService: SubscriberService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.getAll();
  }

  async add(item: IEvents): Promise<void>{
    // this.sendEventMailToSubscribers(item);
    // let subscription = this.userService.getUsers().then(users => {
    //   console.log(users);
    //   users.forEach(user => {
    //     if(user.type != 'admin') {
    //       let notification = <INotification>{
    //         title: item.name,
    //         message: `A new event has been started with ${item.discount}% discount`,
    //         type: 'event',
    //       };
    //       this.notificationService.add(notification, user.id);
    //     }
    //   })
    // })
    // this.productService.addProductsToEvent(item);
  }
  getAll(): Observable<IEvents[]> {
    return this.data;
  }
  async delete(item: IEvents): Promise<any>{
    // this.productService.removeFromEvents(item.products);
  }
  async update(item: IEvents, removeProducts: string[]): Promise<any> {
    // this.productService.removeFromEvents(removeProducts)
  }

  async sendEventMailToSubscribers(item: IEvents){
    const users = await this.userService.getUsers();
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
    // send the item.name and discount on endpoint localhost:3000/api/sendMail

  }

}
