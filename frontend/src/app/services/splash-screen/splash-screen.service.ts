import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import {filter, take} from 'rxjs/operators';

@Injectable()
export class ReflectionSplashScreenService {
  /**
   * Constructor
   */
  isFirstNavigationDone: boolean = false;
  hideOnFirstRouteChange: boolean = false;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _router: Router
  ) {
    // Hide it on the first NavigationEnd event
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        console.log("Something happend")
        if(this.hideOnFirstRouteChange){
          this.hide(true);
        }
        this.isFirstNavigationDone = true;

      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the splash screen
   */
  show(): void {
    this._document.body.classList.remove('reflection-splash-screen-hidden');
  }

  /**
   * Hide the splash screen
   */
  hide(forceHide: boolean = false): void {
    if(forceHide){
      this._document.body.classList.add('reflection-splash-screen-hidden');
      return;
    }
    if (this.isFirstNavigationDone) {
      this._document.body.classList.add('reflection-splash-screen-hidden');
    } else {
      this.hideOnFirstRouteChange = true;
    }
  }
}
