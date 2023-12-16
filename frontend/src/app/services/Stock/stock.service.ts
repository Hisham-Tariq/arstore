import {Injectable} from '@angular/core';

import {IStock, IStockHistory} from "src/app/interfaces/i-stock";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  observableData: Observable<IStock[]> = of([]);
  data: IStock[];


  constructor(
  ) {
    this.getAll().subscribe(data => {
      this.data = data;
    });
  }

  async add(item: IStock): Promise<void> {
    // const collectionRef = this._getCollection(productId, color);
    return this.updateStockHistory(item);
  }

  // private _getHistoryCollection(productId: string, color: string): CollectionReference<IStockHistory> {
  //   return collection(this.firestore, `Products/${productId}/Stock_${color}`).withConverter(new IStockHistoryConverter());
  // }

  getAll(): Observable<IStock[]> {
    return this.observableData;
  }

  delete(id: string) {
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
    return Promise.resolve();
  }

  private updateStockHistory(item: IStock) {
  }

  getStockHistory(productId: string, color: string) {
  }

  getProductStock(productId: string) {
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

