import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/Authentication";
import {Auth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isVerified = this.authService.user != null && this.authService.isUserVerified;
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
