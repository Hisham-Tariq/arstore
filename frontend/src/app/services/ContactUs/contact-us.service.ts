import { Injectable } from '@angular/core';
import {Firestore, doc, setDoc, collection, collectionData, deleteDoc, updateDoc} from "@angular/fire/firestore";
import {ContactusInterface} from "../../interfaces/contactusInterface";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  data: Observable<ContactusInterface[]>;
  collectionReference: CollectionReference<ContactusInterface>;


  constructor( private firestore: Firestore
  ) {
    this.collectionReference = collection(this.firestore, 'ContactUs').withConverter(new ContactUsInterfaceConverter());
    this.getAll();
  }

  add(item: ContactusInterface):Promise<void>{
    let itemDoc = doc(this.collectionReference);
    return setDoc(itemDoc, item);
  }

  getAll(): Observable<ContactusInterface[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }

  delete(item: ContactusInterface) {
    return deleteDoc(doc(this.collectionReference, item.id));
  }

  update(item: ContactusInterface): Promise<any> {
    return updateDoc(doc(this.collectionReference, item.id), item);
  }

}


class ContactUsInterfaceConverter implements firebase.firestore.FirestoreDataConverter<ContactusInterface> {
  toFirestore(data: ContactusInterface): DocumentData {
    return {
      name: data.name,
      email: data.email,
      phone:data.phone,
      message: data.message,
    }
  }

  fromFirestore(data: DocumentData): ContactusInterface {
    // conver the Document data to a SubCategoryInterfae exculding name
    return {
      id: data['id'],
      name: data['get']('name'),
      email: data['get']('email'),
      phone:data['get']('phone'),
      message: data['get']('message'),
    }
  }
}
