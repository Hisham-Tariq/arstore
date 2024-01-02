import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  localStorage = new LocalStorage();
  sessionStorage = new SessionStorage();
  constructor() {}
}

class LocalStorage {
  key = '15ndlksfsdfdlkjiuw783228';

  constructor() {}

  public getData(key: string) {
    let data = localStorage.getItem(key) || '';
    return this.decrypt(data);
  }

  public setData(key: string, value: string) {
    let encryptedValue = this.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }
}

class SessionStorage {
  key = '15ndlksfsdfdlkjiuw783228';

  constructor() {}

  public getData(key: string) {
    let data = sessionStorage.getItem(key) || '';
    // return this.decrypt(data);
    return data;
  }

  public setData(key: string, value: string) {
    // let encryptedValue = this.encrypt(value);
    // sessionStorage.setItem(key, encryptedValue);
    sessionStorage.setItem(key, value);
  }

  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }
}
