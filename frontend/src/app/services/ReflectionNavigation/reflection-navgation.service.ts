import {Injectable} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter, take} from "rxjs/operators";

//------------Not Working right now------------\\
@Injectable()
export class ReflectionNavigationService {
  get navigationData(): object | undefined {
    return this._navigationData;
  }

  set navigationData(value: object | undefined) {
    this._navigationData = value;
  }
  private _navigationData: object | undefined;
    constructor(
        private _router: Router
    ) {
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                console.log('Navigation Done',this._router.url);
            });
    }
}
