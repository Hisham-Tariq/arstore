import { Injectable } from '@angular/core';
import {ContactusInterface} from "../../interfaces/contactusInterface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  data: Observable<ContactusInterface[]>;


  constructor(
  ) {
    this.getAll();
  }

  add(item: ContactusInterface):Promise<void>{
    return Promise.resolve();
  }

  getAll(): Observable<ContactusInterface[]> {
    return this.data;
  }

  delete(item: ContactusInterface): Promise<any> {
    return Promise.resolve();
  }

  update(item: ContactusInterface): Promise<any> {
    return Promise.resolve();
  }

}


// class ContactUsInterfaceConverter implements firebase.firestore.FirestoreDataConverter<ContactusInterface> {
//   toFirestore(data: ContactusInterface): DocumentData {
//     return {
//       name: data.name,
//       email: data.email,
//       phone:data.phone,
//       message: data.message,
//     }
//   }
//
//   fromFirestore(data: DocumentData): ContactusInterface {
//     // conver the Document data to a SubCategoryInterfae exculding name
//     return {
//       id: data['id'],
//       name: data['get']('name'),
//       email: data['get']('email'),
//       phone:data['get']('phone'),
//       message: data['get']('message'),
//     }
//   }
// }
