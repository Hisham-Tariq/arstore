import { Injectable } from '@angular/core';
import {collection, doc, setDoc, getDoc} from '@firebase/firestore';
import {getFirestore} from "@angular/fire/firestore";
import {updateDoc} from "@angular/fire/firestore/lite";

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor() { }

  async addUserToSubscribersList(email: string): Promise<any>{
    let document = doc(getFirestore(), 'subscribers/events');
    let data = await getDoc(document);
    if(data.exists()){
      if(!data.get('users').includes(email)){
        await setDoc(document, {
          users: data.get('users') + "," + email
        });
      }
    } else {
      // set the subscribed users list
      await setDoc(document, {
        'users': email,
      });
    }
  }

  async getSubscribedUsers(): Promise<string[] | null>{
    let document = doc(getFirestore(), 'subscribers/events');
    let data = await getDoc(document);
    if(data.exists()){
      return data.get('users').split(',');
    } else {
      return null;
    }
  }


}
