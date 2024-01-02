import {IStock} from "./i-stock";
import {MainCategoryInterface} from "./main-category.interface";
import {SubCategoryInterface} from "./sub-category.interface";
import {IRating} from "./i-rating";
//
// export interface ProductInterface {
//   id?: string;
//   name: string;
//   gender: string;
//   mainCategory: string;
//   subCategory: string;
//   description?: string;
//   colors: string[],
//   // images: { [key: string]: { [index: string]: string } };
//   images: ProductImage;
//   isActive?: boolean;
//   createdAt?: Date;
//   totalRating: number;
//   ratedBy: number;
//   status: ProductStatus;
// }
//
//
// export interface ProductImage {
//   model: string;
//   thumbnail: string;
//   left: string;
//   right: string;
// }
//
//
//
// export interface ProductItem extends ProductInterface {
//   stock: {[color: string]: IStock};
//   thumbnail: string;
//   mainCategoryDetail: MainCategoryInterface,
//   subCategoryDetail: SubCategoryInterface,
// }
//

export type ProductStatus = 'active' | 'inactive' | 'dependent inactive';

interface ProductImages {
  thumbnail: string;
  left: string;
  right: string;
  model: string;
}

export interface Variant {
  name: string;
  colorCode: string;
  price: number;
  stock: number;
  images: Partial<ProductImages>
}

export interface Product {
  id: string;
  name: string;
  mainCategory: MainCategoryInterface;
  subCategory: SubCategoryInterface;
  description: string;
  genders: 'Male' | 'Female' | 'Both';
  isActive: boolean;
  createdAt: Date;
  rating: IRating;
  status: ProductStatus;
  variants: Variant[];
  colors: string[];
  // images field which will have key value pair of color and image key will be with the color name and value will be the ProductImages interface
  images: { [color: string]: Partial<ProductImages> };
}


