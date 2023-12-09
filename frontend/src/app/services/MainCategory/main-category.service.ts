import {Injectable, Injector} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import {CollectionReference, DocumentData} from "firebase/firestore";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {DocumentSnapshot} from "@firebase/firestore";
import {MainCategoryInterface} from "../../interfaces";
import {ProductService} from "../Product/product.service";

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService {
  data: Observable<MainCategoryInterface[]>;
  collectionReference: CollectionReference<MainCategoryInterface>;

  constructor(
    private firestore: Firestore,
    private injector: Injector,
    ) {
    this.collectionReference = collection(this.firestore, 'MainCategories').withConverter(new MainCategoryInterfaceConverter());
    this.getAll();
  }

  add(item: MainCategoryInterface): Promise<any> {
    let categoryDoc = doc(this.collectionReference);
    return setDoc(categoryDoc, item);
  }

  getAll(): Observable<MainCategoryInterface[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }

  delete(id: string): Promise<any> {
    return deleteDoc(doc(this.collectionReference, id));
  }

  update(item: MainCategoryInterface): Promise<any> {
    return updateDoc(doc(this.collectionReference, item.id), item);
  }

  getById(id: string): Promise<DocumentSnapshot<MainCategoryInterface>> {
    const docRef = doc(this.collectionReference, id);
    return getDoc(docRef);
  }
}


class MainCategoryInterfaceConverter implements firebase.firestore.FirestoreDataConverter<MainCategoryInterface> {
  toFirestore(data: MainCategoryInterface): DocumentData {
    return {
      name: data.name,
      description: data.description,
    }
  }

  fromFirestore(data: DocumentData): MainCategoryInterface {
    return {
      id: data['id'],
      name: data['get']('name'),
      description: data['get']('description'),
    }
  }
}
