import { Injectable } from '@angular/core';

import {ProductInterface, SubCategoryInterface} from "src/app/interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  data: Observable<SubCategoryInterface[]>;

  constructor(
  ) {
    this.getAll();
  }

  add(item: SubCategoryInterface):Promise<void>{
    return Promise.resolve();
  }

  getAll(): Observable<SubCategoryInterface[]> {
    return this.data;
  }

  delete(id: string) {
  }

  update(item: SubCategoryInterface): Promise<any> {
    return Promise.resolve();
  }

  getById(id: string): Promise<any> {
    return Promise.resolve();
  }

  deleteFromMainCategory(mainCategoryId: string) {
    // collectionData(query(this.collectionReference, where('mainCategoryId', '==', mainCategoryId)))
    //   .subscribe(data => {
    //     data.forEach(item => {
    //       this.delete(item.id!);
    //     });
    //   });
  }
}
