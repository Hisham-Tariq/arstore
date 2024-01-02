import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Product, Variant} from "src/app/interfaces";
import {StockService} from "../Stock/stock.service";
import {MainCategoryService} from "../MainCategory/main-category.service";
import {SubCategoryService} from "../SubCategory/sub-category.service";
import {ApiService} from "../ApiBaseService/api.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = 'products';
  productsSubject = new BehaviorSubject<Product[]>([]);
  data = this.productsSubject.asObservable();

  // queue of product images to upload


  constructor(
    private stockService: StockService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private apiService: ApiService
  ) {
    this.getProducts()
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const variantsImages: VariantImages[] = [];
    productData.variants = productData.variants.map((variant) => {
      // add the variant name to the images object
      // @ts-ignore
      const a = <VariantImages>{
        name: variant.name,
        images: {
          ...variant.images
        }
      }
      variantsImages.push(a)
      variant.images = {}
      return variant;
    })
    console.log(variantsImages)

    const product = await this.apiService.post<Product>(this.endpoint, productData);
    // add the product images
    for (const variant of variantsImages){
      for (const imageType in variant.images) {
        const image = variant.images[imageType as keyof ProductColorImages];
        if (image) {
          await this.uploadProductImage(product.id, variant.name, imageType, image);
        }
      }
    }
    // for (const variantName in variantsImages) {
    //   // @ts-ignore
    //   const variantImages = variantsImages[variantName];
    //
    // }
    this.getProducts();
    return product;
  }

  addVariant(productId: string, variantData: AddVariantData): Promise<Product> {
    return this.apiService.post<Product>(`${this.endpoint}/${productId}/variants`, variantData);
  }

  uploadProductImage(productId: string, variantName: string, imageType: string, file: File): Promise<{
    message: string
  }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.apiService.upload(`${this.endpoint}/${productId}/variants/${variantName}/images/${imageType}`, formData);
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.apiService.get<Product[]>(this.endpoint);
    this.productsSubject.next(products);
    return products;
  }

  getProductById(productId: string): Promise<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${productId}`);
  }

  async updateProduct(productId: string, productData: UpdateProductData): Promise<Product> {
    const product = await this.apiService.put<Product>(`${this.endpoint}/${productId}`, productData);
    const oldProducts = this.productsSubject.value;
    const productIndex = oldProducts.findIndex((value) => value.id == productId);
    oldProducts[productIndex] = product;
    this.productsSubject.next(oldProducts);
    return product;
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const dp = await this.apiService.delete<{ message: string }>(`${this.endpoint}/${productId}`);
    const oldProducts = this.productsSubject.value;
    const productIndex = oldProducts.findIndex((value) => value.id == productId);
    oldProducts.splice(productIndex, 1);
    this.productsSubject.next(oldProducts);
    return dp;
  }

  get getMostSoldProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

  get allProductsOrderByDate(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

}


export interface CreateProductData {
  name: string;
  subCategory: string;
  description: string;
  genders: 'Male' | 'Female' | 'Both';
  variants: AddVariantData[];
}


export interface AddVariantData {
  name: string,
  colorCode: string,
  price: number,
  stock: number,
  images: Partial<ProductColorImages>,
}


export interface ProductColorImages {
  model: File | null;
  thumbnail: File | null;
  left: File | null;
  right: File | null;
}


interface VariantImages {
  name: string,
  images: ProductColorImages
}

export interface UpdateVariantColorImages {
  model: File | String | null;
  thumbnail: File | String | null;
  left: File | String | null;
  right: File | String | null;
}
export interface UpdateVariantData {
  name: string,
  colorCode: string,
  price: number,
  stock: number,
  images: Partial<UpdateVariantColorImages>,
}
export interface UpdateProductData {
  name: string;
  subCategory: string;
  description: string;
  genders: 'Male' | 'Female' | 'Both';
  variants: UpdateVariantData[];
}


