import { Injectable } from '@angular/core';
import {CollectionReference, DocumentData} from "firebase/firestore";
import {Observable} from "rxjs";
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import {VoucherCodeInterface} from "../../interfaces/voucher-code.interface";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class VoucherCodeService {
  collectionReference: CollectionReference<VoucherCodeInterface>;
  data: Observable<VoucherCodeInterface[]>;
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.collectionReference = collection(this.firestore, 'VoucherCode').withConverter(new VoucherCodeInterfaceConverter());
    this.getAll();
  }

  async add(item: VoucherCodeInterface): Promise<void>{
    let itemDoc = doc(this.collectionReference, item.voucherCode);
    await setDoc(itemDoc, item);
  }
  getAll(): Observable<VoucherCodeInterface[]> {
    this.data = collectionData(this.collectionReference);
    return this.data;
  }
  async delete(item: VoucherCodeInterface): Promise<any>{
    await deleteDoc(doc(this.collectionReference, item.voucherCode));
  }
  async update(item: Partial<VoucherCodeInterface>): Promise<any> {
    // update the item by excluding the voucher code
    let itemDoc = doc(this.collectionReference, item.voucherCode);
    delete item.voucherCode;
    return  updateDoc(itemDoc, item);
  }

  addUserInVoucherCode(item: VoucherCodeInterface): Promise<any> {
    const userId = this.authService.user?.id;
    let itemDoc = doc(this.collectionReference, item.voucherCode);
    item.users.push(userId!);
    let updateData = {
      users: item.users.join(',')
    };
    return updateDoc<any>(itemDoc, updateData);
  }

  removeUserInVoucherCode(item: VoucherCodeInterface): Promise<any> {
    const userId = this.authService.user?.id;
    let itemDoc = doc(this.collectionReference, item.voucherCode);
    item.users = item.users.filter(user => user !== userId);
    let updateData = {
      users: item.users.join(',')
    };
    return updateDoc<any>(itemDoc, updateData);
  }

  updateStatus(item: VoucherCodeInterface, checked: boolean) {
    item.isActive = checked;
    // @ts-ignore
    delete item.users;
    return this.update(item);
  }

  async checkCodeIsValid(code: string): Promise<any> {
    if(code == '' || typeof code == 'undefined') return {
      isValid: false,
      message: 'Voucher code is not valid'
    }
    let userId = this.authService.user?.id;
    let data = await getDoc(doc(this.collectionReference, code))
    if(data.exists()){
      // check if user have already applied or not
      let voucher = data.data();
      if(voucher.users.includes(userId!) || !voucher.isActive){
        return {
          isValid: false,
          message: 'Voucher code is not valid'
        }
      }
      return {
        isValid: true,
        voucher: voucher,
        message: 'Voucher code is valid'
      }
    } else {
      return {
        isValid: false,
        message: 'Voucher code is not valid'
      }
    }
  }
}


class VoucherCodeInterfaceConverter implements firebase.firestore.FirestoreDataConverter<VoucherCodeInterface> {
  toFirestore(data: VoucherCodeInterface): DocumentData {
    return {
      discount: data.discount,
      users: '',
      isActive: true,
    }
  }

  fromFirestore(data: DocumentData): VoucherCodeInterface {
    return {
      voucherCode: data['id'],
      discount: data['get']('discount') || 0,
      users: data['get']('users') != '' ? data['get']('users').split(",") : [],
      isActive: data['get']('isActive'),
    }
  }
}

