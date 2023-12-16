import { Injectable } from '@angular/core';
import {CollectionReference, DocumentData} from "firebase/firestore";
import {Observable} from "rxjs";

import {VoucherCodeInterface} from "../../interfaces/voucher-code.interface";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class VoucherCodeService {
  collectionReference: CollectionReference<VoucherCodeInterface>;
  data: Observable<VoucherCodeInterface[]>;
  constructor(
    private authService: AuthService,
  ) {
    this.getAll();
  }

  async add(item: VoucherCodeInterface): Promise<void>{
    return Promise.resolve();
  }
  getAll(): Observable<VoucherCodeInterface[]> {
    return this.data;
  }
  async delete(item: VoucherCodeInterface): Promise<any>{
    return Promise.resolve();
  }
  async update(item: Partial<VoucherCodeInterface>): Promise<any> {
    // update the item by excluding the voucher code
    delete item.voucherCode;
    return  Promise.resolve();
  }

  addUserInVoucherCode(item: VoucherCodeInterface): Promise<any> {
    // const userId = this.authService.user?.id;
    // let itemDoc = doc(this.collectionReference, item.voucherCode);
    // item.users.push(userId!);
    // let updateData = {
    //   users: item.users.join(',')
    // };
    // return updateDoc<any>(itemDoc, updateData);
    return Promise.resolve();
  }

  removeUserInVoucherCode(item: VoucherCodeInterface): Promise<any> {
    // const userId = this.authService.user?.id;
    // let itemDoc = doc(this.collectionReference, item.voucherCode);
    // item.users = item.users.filter(user => user !== userId);
    // let updateData = {
    //   users: item.users.join(',')
    // };
    // return updateDoc<any>(itemDoc, updateData);
    return Promise.resolve()
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
    // let userId = this.authService.user?.id;
    // let data = await getDoc(doc(this.collectionReference, code))
    // if(data.exists()){
    //   // check if user have already applied or not
    //   let voucher = data.data();
    //   if(voucher.users.includes(userId!) || !voucher.isActive){
    //     return {
    //       isValid: false,
    //       message: 'Voucher code is not valid'
    //     }
    //   }
    //   return {
    //     isValid: true,
    //     voucher: voucher,
    //     message: 'Voucher code is valid'
    //   }
    // } else {
    //   return {
    //     isValid: false,
    //     message: 'Voucher code is not valid'
    //   }
    // }
  }
}
