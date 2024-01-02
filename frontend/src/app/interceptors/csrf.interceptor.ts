import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/StorageService/Storage.service';

@Injectable()
export class CSRFInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add CSRF token to headers
    const csrfToken = this.storageService.sessionStorage.getData('csrf-token');
    const modifiedReq = req.clone({
      setHeaders: {
        'x-csrf-token': csrfToken,
      },
    });
    return next.handle(modifiedReq);
  }
}
