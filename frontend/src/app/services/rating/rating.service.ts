import {Injectable} from '@angular/core';

import {IRating} from "../../interfaces/i-rating";
import {ProductService} from "../Product/product.service";
import {OrderService} from "../order/order.service";
import {ApiService} from "../ApiBaseService/api.service";

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private endpoint = 'ratings';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private apiService: ApiService,
  ) {
  }

  async add(item: AddRatingData): Promise<IRating> {
    return this.apiService.post<IRating>(this.endpoint, item);
  }

  async getReviewsByOrderId(orderId: string): Promise<IRating[]> {
    return this.apiService.get<IRating[]>(`${this.endpoint}/order/${orderId}`);
  }
}


export interface AddRatingData {
  userId: string;
  userName: string;
  stars: number;
  comment: string;
  orderId: string;
  productId: string;
  variantName: string;
}
