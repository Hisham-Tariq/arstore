import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "@angular/fire/firestore";
import {IStock, IStockHistory} from "src/app/interfaces/i-stock";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  observableData: Observable<IStock[]>;
  data: IStock[];
  collectionReference: CollectionReference<IStock>;


  constructor(private firestore: Firestore
  ) {
    this.collectionReference = collection(this.firestore, 'Stock').withConverter(new IStockConverter());
    this.getAll().subscribe(data => {
      this.data = data;
    });
  }

  async add(item: IStock): Promise<void> {
    // const collectionRef = this._getCollection(productId, color);
    let itemDoc = doc(this.collectionReference);
    await setDoc(itemDoc, item);
    return this.updateStockHistory(item);
  }

  private _getHistoryCollection(productId: string, color: string): CollectionReference<IStockHistory> {
    return collection(this.firestore, `Products/${productId}/Stock_${color}`).withConverter(new IStockHistoryConverter());
  }

  getAll(): Observable<IStock[]> {
    this.observableData = collectionData(this.collectionReference);
    return this.observableData;
  }

  delete(id: string) {
    return deleteDoc(doc(this.collectionReference, id));
  }

  async update(item: any, updateHistory = true): Promise<any> {
    const id = item.id;
    if(updateHistory) await this.updateStockHistory(item);
    // remove id, previousQuantity, remainingQuantity, newQuantity, product from item
    delete item.id;
    delete item.previousQuantity;
    delete item.remainingQuantity;
    delete item.newQuantity;
    delete item.product;
    return updateDoc(doc(this.collectionReference, id), item);
  }

  private updateStockHistory(item: IStock) {
    const collectionRef = this._getHistoryCollection(item.product, item.color);
    let itemDoc = doc(collectionRef);
    return setDoc(itemDoc, item);
  }

  getStockHistory(productId: string, color: string) {
    const collectionRef = this._getHistoryCollection(productId, color);
    return collectionData(collectionRef);
  }

  getProductStock(productId: string) {
    return collectionData(query(this.collectionReference, where("productId", "==", productId)))
  }

  updateStockQuantity(stockId: string, soldQuantity: number) {
    this.data.forEach(stock => {
      if (stock.id == stockId) {
        stock.soldQuantity += soldQuantity;
        stock.totalQuantity = stock.totalQuantity - soldQuantity;
        this.update(stock, false);
      }
    })
  }

}


class IStockConverter implements firebase.firestore.FirestoreDataConverter<IStock> {
  toFirestore(data: IStock): DocumentData {
    return {
      consumerPrice: data.consumerPrice,
      retailerPrice: data.retailerPrice,
      totalQuantity: data.totalQuantity,
      date: data.date,
      color: data.color,
      productId: data.product,
      soldQuantity: 0,
    }
  }

  fromFirestore(data: DocumentData): IStock {
    return {
      id: data['id'],
      consumerPrice: data['get']('consumerPrice'),
      retailerPrice: data['get']('retailerPrice'),
      totalQuantity: data['get']('totalQuantity'),
      date: data['get']('date'),
      color: data['get']('color'),
      product: data['get']('productId'),
      previousQuantity: 0,
      soldQuantity: data['get']('soldQuantity'),
      discountPrice: data['get']('retailerPrice'),
    }
  }
}


class IStockHistoryConverter implements firebase.firestore.FirestoreDataConverter<IStockHistory> {
  toFirestore(data: IStock): DocumentData {
    return {
      consumerPrice: data.consumerPrice,
      retailerPrice: data.retailerPrice,
      previousQuantity: data.previousQuantity,
      totalQuantity: data.totalQuantity,
      date: data.date,
    }
  }

  fromFirestore(data: DocumentData): IStockHistory {
    return {
      id: data['id'],
      consumerPrice: data['get']('consumerPrice'),
      retailerPrice: data['get']('retailerPrice'),
      previousQuantity: data['get']('previousQuantity'),
      totalQuantity: data['get']('totalQuantity'),
      date: data['get']('date'),
    }
  }
}
