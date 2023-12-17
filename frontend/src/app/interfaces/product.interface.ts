import {IStock} from "./i-stock";
import {MainCategoryInterface} from "./main-category.interface";
import {SubCategoryInterface} from "./sub-category.interface";

export interface ProductInterface {
  id?: string;
  name: string;
  gender: string;
  mainCategory: string;
  subCategory: string;
  description?: string;
  colors: string[],
  // images: { [key: string]: { [index: string]: string } };
  images: ProductImage;
  isActive?: boolean;
  createdAt?: Date;
  totalRating: number;
  ratedBy: number;
  status: ProductStatus;
}


export interface ProductImage {
  model: string;
  thumbnail: string;
  left: string;
  right: string;
}



export interface ProductItem extends ProductInterface {
  stock: {[color: string]: IStock};
  thumbnail: string;
  mainCategoryDetail: MainCategoryInterface,
  subCategoryDetail: SubCategoryInterface,
}


export type ProductStatus = 'active' | 'inactive' | 'dependent inactive';
