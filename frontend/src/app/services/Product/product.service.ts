import {Injectable} from '@angular/core';
import {Observable, of, Subscription, zip} from "rxjs";
import {ProductInterface, ProductItem, ProductStatus} from "src/app/interfaces";
import {StockService} from "../Stock/stock.service";
import {map, take} from "rxjs/operators";
import {MainCategoryService} from "../MainCategory/main-category.service";
import {SubCategoryService} from "../SubCategory/sub-category.service";
import {randomId} from "../../utils";
import {IEvents} from "../../interfaces/IEvents";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  data: Observable<ProductInterface[]> = of([]);
  currentProduct: ProductInterface | undefined;
  currentProductSubscription: Subscription;
  // queue of product images to upload


  constructor(
    private stockService: StockService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
  ) {
    this.getAll();
  }

  add(item: ProductInterface, id: string): Promise<void> {
    // this.currentProductSubscription = docSnapshots(itemDoc).subscribe(snapshot => this.currentProduct = snapshot.data());
    return Promise.resolve();
  }

  getAll(): Observable<ProductInterface[]> {
    return this.data;
  }

  get getAllProductsDetails(): Observable<ProductItem[]> {
    return of([]);
    return zip(this.data, this.stockService.observableData, this.mainCategoryService.data, this.subCategoryService.data).pipe(map(([p, s, m, sc]) => {
      let products: ProductItem[] = [];
      if (p.length > 0 && s.length > 0) {
        p.forEach(product => {
          const mainCategory = m.find((value) => value.id == product.mainCategory)!;
          const subCategory = sc.find((value) => value.id == product.subCategory)!;
          let item: ProductItem = {
            ...product,
            stock: {},
            thumbnail: "",
            mainCategoryDetail: mainCategory,
            subCategoryDetail: subCategory,
          };
          // run through all stocks and find the one that matches the product
          s.forEach(stock => {
            if (stock.product === product.id) {
              stock.discountPrice -= stock.discountPrice * (product.discount / 100);
              item.stock[stock.color] = stock;
            }
          });
            let stockColors = Object.keys(item.stock);
            for(let color of stockColors){
              if(!item.colors.includes(color)){
                delete item.stock[color];
              }
            }
          // now sort the colors by checking which stock[color] have lowest price
          item.colors = Object.keys(item.stock).sort((a, b) => {
            return item.stock[a].retailerPrice - item.stock[b].retailerPrice;
          });
          if (Object.keys(item.stock).length > 0) {
            item.thumbnail = this.getFirstColorsThumbnail(item);
            products.push(item);
          }
        });
      }
      return products;
    }))

  }

  async delete(product: ProductInterface): Promise<any> {
    const imageNames = ['left', 'right', 'thumbnail', 'model'];
    // await deleteDoc(doc(this.collectionReference, product.id));
    // access each color in the product
    for (let color of product.colors) {
      // access each image in the color
      for (const imageName of imageNames) {
        // deleteObject(ref(getStorage(), `Products/${product.id}/${color}/${imageName}`));
      }
    }
    return;
  }

  update(item: Partial<ProductInterface>, deleteColors:string[]): Promise<any> {
    let images : any = {};
    for(let color of item.colors!) {
      images[color] = {
        left: item.images![color]['left'],
        right: item.images![color]['right'],
        thumbnail: item.images![color]['thumbnail'],
        model: item.images![color]['model'],
      }
    }
    for(let color of deleteColors){
      // images[color] = deleteField();
    }
    let updateData = {
      subCategory: item.subCategory,
      colors: item.colors?.join(','),
      mainCategory: item.mainCategory,
      name: item.name,
      description: item.description,
      gender: item.gender,
      ...images,
    }
    if(item.status == 'dependent inactive'){
      updateData.status = 'active';
    }
    return Promise.resolve();
    // return updateDoc(doc(this.collectionReference, item.id), {
    //   ...updateData
    // });
  }

  // uploadImage(ProductImage: File | ArrayBuffer, productId: string, color: string, name: string): Observable<any> {
  //   const storageRef = ref(getStorage(), `Products/${productId}/${color}/${randomId()}`);
  //   const uploadTask = uploadBytesResumable(storageRef, ProductImage);
  //   return fromTask(uploadTask);
  // }

  clearCurrentProduct() {
    this.currentProductSubscription.unsubscribe();
    this.currentProduct = undefined;
  }

  addImagesUrls(productImagesDownloadUrls: {}, productId: string) {

  }

  getFirstColorsThumbnail(product: any) {
    if(product.colors.length == 0) return;
    return product.images[product.colors[0] as keyof ProductInterface['images']]['thumbnail'];
  }

  getFirstColorsStockPrice(product: ProductInterface) {
    return product.images[product.colors[0] as keyof ProductInterface['images']]['thumbnail'];
  }

  getProductById(productId: string): Promise<any> {
    return Promise.resolve();
  }

  get allProductsOrderByDate(): Observable<ProductItem[]> {
    // sort by date
    return this.getAllProductsDetails.pipe(map(products => {
      return products.sort((a, b) => {
        return a.createdAt!.getSeconds() - b.createdAt!.getSeconds();
      });
    }));
  }

  get getPopularProducts() {
    return this.getAllProductsDetails.pipe(map(products => {
      return products.sort((a, b) => {
        return a.views - b.views;
      });
    }));
  }

  get getMostSoldProducts() {
    return this.getAllProductsDetails.pipe(map(products => {
      return products.sort((a, b) => {
        // Reduce the stock soldQuantity of each color to a single number
        let aSoldQuantity = 0;
        let bSoldQuantity = 0;
        for (let color of a.colors) aSoldQuantity += a.stock[color].soldQuantity;
        for (let color of b.colors) bSoldQuantity += b.stock[color].soldQuantity;
        return aSoldQuantity - bSoldQuantity;
      });
    }));
  }


  incrementProductView(productId: string) {
  }

  updateProductRating(id: string, rating: number): Promise<void> {
    return Promise.resolve();
  }

  updateProductStatus(id: string, status: ProductStatus, item: any = {}): Promise<void> {
    return Promise.resolve()
  }

  deleteFromMainCategory(mainCategoryId: string) {
    // collectionData(query(this.collectionReference, where('mainCategory', '==', mainCategoryId)))
    //   .subscribe(data => {
    //     data.forEach(item => {
    //       this.updateProductStatus(item.id!, 'dependent inactive', {
    //         mainCategory: '',
    //         subCategory: '',
    //       });
    //     });
    //   });
  }


  deleteFromSubCategory(subCategoryId: string) {
    // collectionData(query(this.collectionReference, where('subCategory', '==', subCategoryId)))
    //   .subscribe(data => {
    //     data.forEach(item => {
    //       this.updateProductStatus(item.id!, 'dependent inactive', {
    //         subCategory: '',
    //       });
    //     });
    //   });
  }
  private setProductDiscount(productId: string, eventId: string, discount:number){
    // let productDoc = doc(this.collectionReference, productId);
    // return updateDoc(productDoc, {discount: discount, eventId: eventId});
  }
  addProductsToEvent(item: IEvents) {
    this.data.pipe(take(1)).subscribe(value => {
      value.forEach(product => {
        if (item.products.includes(product.id!)) {
          this.setProductDiscount(product.id!, item.id!, item.discount);
        }
      });
    });
  }

  removeFromEvents(removeProducts: string[]) {
    this.data.pipe(take(1)).subscribe(value => {
      value.forEach(product => {
        if (removeProducts.includes(product.id!)) {
          this.setProductDiscount(product.id!, '', 0);
        }
      });
    });
  }
}

