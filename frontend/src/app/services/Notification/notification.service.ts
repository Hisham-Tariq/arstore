import {Injectable} from '@angular/core';
import {INotification} from "../../interfaces/i-notification";
import {IEvents} from "../../interfaces/IEvents";
import {Observable, of} from "rxjs";
import {AuthService} from "../Authentication";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  data: Observable<INotification[]>;

  constructor(
    private authService: AuthService,
  ) {
    this.getAll();
  }

  async add(item: INotification, userId: string): Promise<void>{
    try {
      return Promise.resolve();
    } catch (e) {
      console.log(e);
    }
  }

  getAll(): Observable<INotification[]> {
    return of([]);
    // if(this.authService.user == null) return of([]);
    // try {
    //   return this.data;
    // } catch (e) {
    //   return of([]);
    // }
  }

}


