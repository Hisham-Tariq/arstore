import { Injectable } from '@angular/core';

import {ProductInterface, SubCategoryInterface} from "src/app/interfaces";
import {Observable, of, zip} from "rxjs";
import {IRating, IRatingWithProduct} from "../../interfaces/i-rating";
import {ProductService} from "../Product/product.service";
import {OrderService} from "../order/order.service";
import {map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  observableData: Observable<IRating[]>;
  data: IRating[];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
  ) {
  }

  async add(item: IRating):Promise<void>{
    await this.orderService.setProductAsReviewed(item.orderProductId, item.rating);
    return this.productService.updateProductRating(item.productId, item.rating);
  }

  getAll(): Observable<IRating[]> {
    return this.observableData;
  }

  getProductRating(productId: string): Observable<IRating[]> {
    return of([])
  }

  getReviewsByOrderId(orderId: string):Observable<IRatingWithProduct[]> {
    return of([])
    // let data = collectionData(query
    // (this.collectionReference, where('orderId', '==', orderId)
    //   ,orderBy("createdAt", "desc",))).pipe(take(1))
    // return zip(data, this.productService.data).pipe(map(([ratings, products]) => {
    //   let reviewsData : IRatingWithProduct[] = []
    //   ratings.forEach((rating) => {
    //     let product = products.find((product) => product.id == rating.productId)!;
    //     reviewsData.push({
    //       ...rating,
    //       productName: product.name,
    //     })
    //   })
    //   return reviewsData;
    // }));
  }
}
