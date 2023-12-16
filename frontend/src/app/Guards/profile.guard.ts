import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/Authentication";

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isVerified = true;
    if(!isVerified){
      this.router.navigate(['/profile/verify']);
      return false;
    }
    return true;
    // return new Observable<boolean>(observer => {
    //   this.auth.onAuthStateChanged(async (user) => {
    //     console.log("User: ", user);
    //     if (user && await this.authService.getCurrentUserType() === 'admin') {
    //       observer.next(true);
    //     } else {
    //       this.router.navigate(['home']);
    //       observer.next(false);
    //     }
    //   });
    // });
  }

}
