import {Injectable, Injector} from '@angular/core';

import {Observable} from "rxjs";
import {MainCategoryInterface} from "../../interfaces";
import {ProductService} from "../Product/product.service";

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService {
  data: Observable<MainCategoryInterface[]>;

  constructor(
    private injector: Injector,
    ) {
    this.getAll();
  }

  add(item: MainCategoryInterface): Promise<any> {
    return Promise.resolve();
  }

  getAll(): Observable<MainCategoryInterface[]> {
    return this.data;
  }

  delete(id: string): Promise<any> {
    return Promise.resolve();
  }

  update(item: MainCategoryInterface): Promise<any> {
    return Promise.resolve();
  }

  getById(id: string): Promise<any> {
    return Promise.resolve();
  }
}
