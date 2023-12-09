import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  collectionData,
  deleteDoc,
  updateDoc,
  getDoc, serverTimestamp, query, where, orderBy
} from "@angular/fire/firestore";
import {ProductInterface, SubCategoryInterface} from "src/app/interfaces";
import {CollectionReference, DocumentData} from 'firebase/firestore';
import firebase from "firebase/compat";
import {Observable, zip} from "rxjs";
import {DocumentSnapshot} from "@firebase/firestore";
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
  collectionReference: CollectionReference<IRating>;

  constructor(
    private firestore: Firestore,
    private productService: ProductService,
    private orderService: OrderService,
  ) {
    this.collectionReference = collection(this.firestore, 'Ratings').withConverter(new IRatingConverter());
  }

  async add(item: IRating):Promise<void>{
    let itemDoc = doc(this.collectionReference);
    await setDoc(itemDoc, item);
    await this.orderService.setProductAsReviewed(item.orderProductId, item.rating);
    return this.productService.updateProductRating(item.productId, item.rating);
  }

  getAll(): Observable<IRating[]> {
    this.observableData = collectionData(this.collectionReference)
    return this.observableData;
  }

  getProductRating(productId: string): Observable<IRating[]> {
    return collectionData(query(this.collectionReference, where('productId', '==', productId),orderBy("createdAt", "desc",)))
  }

  getReviewsByOrderId(orderId: string):Observable<IRatingWithProduct[]> {
    let data = collectionData(query
    (this.collectionReference, where('orderId', '==', orderId)
      ,orderBy("createdAt", "desc",))).pipe(take(1))
    return zip(data, this.productService.data).pipe(map(([ratings, products]) => {
      let reviewsData : IRatingWithProduct[] = []
      ratings.forEach((rating) => {
        let product = products.find((product) => product.id == rating.productId)!;
        reviewsData.push({
          ...rating,
          productName: product.name,
        })
      })
      return reviewsData;
    }));
  }
}



class IRatingConverter implements firebase.firestore.FirestoreDataConverter<IRating> {
  toFirestore(data: IRating): DocumentData {
    return {
      productId: data.productId,
      orderId: data.orderId,
      orderProductId: data.orderProductId,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      createdAt: serverTimestamp(),
    }
  }

  fromFirestore(data: DocumentData): IRating {
    return {
      id: data['id'],
      productId: data['get']('productId'),
      orderId: data['get']('orderId'),
      orderProductId: data['get']('orderProductId'),
      userId: data['get']('userId'),
      userName: data['get']('userName'),
      rating: data['get']('rating'),
      comment: data['get']('comment'),
      createdAt: data['get']('createdAt'),

    }
  }
}
