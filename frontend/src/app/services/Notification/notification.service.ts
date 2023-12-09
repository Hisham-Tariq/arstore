import {Injectable} from '@angular/core';
import firebase from "firebase/compat";
import {CollectionReference, DocumentData} from "firebase/firestore";
import {INotification} from "../../interfaces/i-notification";
import {IEvents} from "../../interfaces/IEvents";
import {Observable, of} from "rxjs";
import {collection, collectionData, doc, Firestore, serverTimestamp, setDoc} from "@angular/fire/firestore";
import {documentId} from "@angular/fire/firestore/lite";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  data: Observable<INotification[]>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.getAll();
  }

  async add(item: INotification, userId: string): Promise<void>{
    try {
      let collectionRef = collection(this.firestore, `users/${userId}/notifications`).withConverter(new INotificationConverter());
      let itemDoc = doc(collectionRef);
      await setDoc(itemDoc, item);
    } catch (e) {
      console.log(e);
    }
  }

  getAll(): Observable<INotification[]> {
    if(this.authService.user == null) return of([]);
    try {
      let collectionRef = collection(this.firestore, `users/${this.authService.user?.id}/notifications`).withConverter(new INotificationConverter());
      this.data = collectionData(collectionRef);
      return this.data;
    } catch (e) {
      return of([]);
    }
  }

}


class INotificationConverter implements firebase.firestore.FirestoreDataConverter<INotification> {
  toFirestore(data: INotification): DocumentData {
    return {
      title: data.title,
      message: data.message,
      date: serverTimestamp(),
      type: data.type,
    };
  }

  fromFirestore(data: DocumentData): INotification {
    return {
      id: data['id'],
      title: data['get']('title'),
      message: data['get']('message'),
      type: data['get']('type'),
      createdAt: data['get']('createdAt'),
    }
  }
}

