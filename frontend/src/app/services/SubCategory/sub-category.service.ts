import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  collectionData,
  deleteDoc,
  updateDoc,
  getDoc, query, where
} from "@angular/fire/firestore";
import {ProductInterface, SubCategoryInterface} from "src/app/interfaces";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {Observable} from "rxjs";
import {DocumentSnapshot} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  data: Observable<SubCategoryInterface[]>;
  collectionReference: CollectionReference<SubCategoryInterface>;

  constructor(
    private firestore: Firestore
  ) {
    this.collectionReference = collection(this.firestore, 'SubCategories').withConverter(new SubCategoryInterfaceConverter());
    this.getAll();
  }

  add(item: SubCategoryInterface):Promise<void>{
    let itemDoc = doc(this.collectionReference);
    return setDoc(itemDoc, item);
  }

  getAll(): Observable<SubCategoryInterface[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }

  delete(id: string) {
    return deleteDoc(doc(this.collectionReference, id));
  }

  update(item: SubCategoryInterface): Promise<any> {
    return updateDoc(doc(this.collectionReference, item.id), item);
  }

  getById(id: string): Promise<DocumentSnapshot<SubCategoryInterface>> {
    const docRef = doc(this.collectionReference, id);
    return getDoc(docRef);
  }

  deleteFromMainCategory(mainCategoryId: string) {
    collectionData(query(this.collectionReference, where('mainCategoryId', '==', mainCategoryId)))
      .subscribe(data => {
        data.forEach(item => {
          this.delete(item.id!);
        });
      });
  }
}


class SubCategoryInterfaceConverter implements firebase.firestore.FirestoreDataConverter<SubCategoryInterface> {
  toFirestore(data: SubCategoryInterface): DocumentData {
    return {
      name: data.name,
      description: data.description,
      mainCategoryId: data.mainCategoryId,
    }
  }

  fromFirestore(data: DocumentData): SubCategoryInterface {
    // conver the Document data to a SubCategoryInterfae exculding name
    return {
      id: data['id'],
      name: data['get']('name'),
      description: data['get']('description'),
      mainCategoryId: data['get']('mainCategoryId'),
    }
  }
}
