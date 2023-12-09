import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteField, query, where
} from "@angular/fire/firestore";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {Observable, Subscription, zip} from "rxjs";
import {ProductInterface, ProductItem, ProductStatus} from "src/app/interfaces";
import {deleteObject, fromTask, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot,getDownloadURL} from "@angular/fire/storage"
import {DocumentSnapshot} from "@firebase/firestore";
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
  data: Observable<ProductInterface[]>;
  collectionReference: CollectionReference<ProductInterface>;
  currentProduct: ProductInterface | undefined;
  currentProductSubscription: Subscription;
  // queue of product images to upload


  constructor(
    private firestore: Firestore,
    private stockService: StockService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
  ) {
    this.collectionReference = collection(this.firestore, 'Products').withConverter(new ProductInterfaceConverter());
    this.getAll();
  }

  add(item: ProductInterface, id: string): Promise<void> {
    let itemDoc = doc(this.collectionReference, id);
    // this.currentProductSubscription = docSnapshots(itemDoc).subscribe(snapshot => this.currentProduct = snapshot.data());
    return setDoc(itemDoc, item);
  }

  getAll(): Observable<ProductInterface[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }

  get getAllProductsDetails(): Observable<ProductItem[]> {
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
    await deleteDoc(doc(this.collectionReference, product.id));
    // access each color in the product
    for (let color of product.colors) {
      // access each image in the color
      for (const imageName of imageNames) {
        deleteObject(ref(getStorage(), `Products/${product.id}/${color}/${imageName}`));
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
      images[color] = deleteField();
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
    return updateDoc(doc(this.collectionReference, item.id), {
      ...updateData
    });
  }

  uploadImage(ProductImage: File | ArrayBuffer, productId: string, color: string, name: string): Observable<UploadTaskSnapshot> {
    const storageRef = ref(getStorage(), `Products/${productId}/${color}/${randomId()}`);
    const uploadTask = uploadBytesResumable(storageRef, ProductImage);
    return fromTask(uploadTask);
  }

  clearCurrentProduct() {
    this.currentProductSubscription.unsubscribe();
    this.currentProduct = undefined;
  }

  addImagesUrls(productImagesDownloadUrls: {}, productId: string) {
    let productDoc = doc(this.firestore, `Products/${productId}`);
    return updateDoc(productDoc, productImagesDownloadUrls);
  }

  getFirstColorsThumbnail(product: any) {
    if(product.colors.length == 0) return;
    return product.images[product.colors[0] as keyof ProductInterface['images']]['thumbnail'];
  }

  getFirstColorsStockPrice(product: ProductInterface) {
    return product.images[product.colors[0] as keyof ProductInterface['images']]['thumbnail'];
  }

  getProductById(productId: string): Promise<DocumentSnapshot<ProductInterface>> {
    const docRef = doc(this.collectionReference, productId);
    return getDoc(docRef);
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
    let productDoc = doc(this.collectionReference, productId);
    return updateDoc(productDoc, {views: increment(1)});
  }

  updateProductRating(id: string, rating: number): Promise<void> {
    let productDoc = doc(this.collectionReference, id);
    return updateDoc(productDoc, {totalRating: increment(rating), ratedBy: increment(1)});
  }

  updateProductStatus(id: string, status: ProductStatus, item: any = {}): Promise<void> {
    let productDoc = doc(this.collectionReference, id);
    return updateDoc(productDoc, {status: status, ...item});
  }

  deleteFromMainCategory(mainCategoryId: string) {
    collectionData(query(this.collectionReference, where('mainCategory', '==', mainCategoryId)))
      .subscribe(data => {
        data.forEach(item => {
          this.updateProductStatus(item.id!, 'dependent inactive', {
            mainCategory: '',
            subCategory: '',
          });
        });
      });
  }


  deleteFromSubCategory(subCategoryId: string) {
    collectionData(query(this.collectionReference, where('subCategory', '==', subCategoryId)))
      .subscribe(data => {
        data.forEach(item => {
          this.updateProductStatus(item.id!, 'dependent inactive', {
            subCategory: '',
          });
        });
      });
  }
  private setProductDiscount(productId: string, eventId: string, discount:number){
    let productDoc = doc(this.collectionReference, productId);
    return updateDoc(productDoc, {discount: discount, eventId: eventId});
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


class ProductInterfaceConverter implements firebase.firestore.FirestoreDataConverter<ProductInterface> {
  toFirestore(data: ProductInterface): DocumentData {
    return {
      name: data.name,
      gender: data.gender,
      mainCategory: data.mainCategory,
      subCategory: data.subCategory,
      description: data.description,
      colors: data.colors.join(","),
      createdAt: serverTimestamp(),
      views: 0,
      totalRating: 0,
      ratedBy: 0,
      status: 'active',
    }
  }

  fromFirestore(data: DocumentData): ProductInterface {
    // convert the Document Data to Product Interface
    let colors = data['get']('colors').toString().split(",");
    let images: { [key: string]: { [index: string]: string } } = {};
    for (const color of colors) {
      images[color] = {
        left: data['get'](color)['left'] || "",
        right: data['get'](color)['right'] || "",
        model: data['get'](color)['model'] || "",
        thumbnail: data['get'](color)['thumbnail'] || "",
      }
    }
    return {
      id: data['id'],
      name: data['get']('name'),
      description: data['get']('description'),
      gender: data['get']('gender'),
      mainCategory: data['get']('mainCategory'),
      subCategory: data['get']('subCategory'),
      colors: colors,
      images: images,
      createdAt: new Date(data['get']('createdAt').seconds * 1000),
      views: data['get']('views') || 0,
      totalRating: data['get']('totalRating') || 0,
      ratedBy: data['get']('ratedBy') || 0,
      status: data['get']('status') || 'active',
      discount: data['get']('discount') || 0,
      eventId: data['get']('eventId') || null,
    }
  }
}
