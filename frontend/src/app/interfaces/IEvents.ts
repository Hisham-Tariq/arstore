import {ProductItem} from "./product.interface";

export interface IEvents {
  id: string;
  name: string;
  products: string[];
  discount: number;
  validUpTo: string;
}


export interface IEventWithProducts extends IEvents {
  eventProducts: ProductItem[];
}
