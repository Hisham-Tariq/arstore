import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor() { }

  async addUserToSubscribersList(email: string): Promise<any>{
    return Promise.resolve();
  }

  async getSubscribedUsers(): Promise<string[] | null>{
    return Promise.resolve(null);
  }


}
