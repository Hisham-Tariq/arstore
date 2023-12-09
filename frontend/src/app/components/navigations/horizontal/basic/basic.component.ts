import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavItem} from "../../navigation.type";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'basic-horizontal-nav-item',
  templateUrl: './basic.component.html',
  styleUrls: ['../style.scss']
})
export class BasicHorizontalNavItemComponent implements OnInit, OnDestroy {
  @Input() item!: NavItem;
  @ViewChild('navigationItem') navigationItem: ElementRef<HTMLDivElement>;
  urlChangeSubscription: Subscription;

  constructor(
    private router: Router
  ) {
    this.urlChangeSubscription = this.router.events
      .pipe(
        // filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)
      )
      .subscribe((ev) => {
        // console.log(ev instanceof );
        // remove the first / from the url
        const url = this.router.url.substring(1);
        if(this.item.link == url){
          this.navigationItem.nativeElement.classList.add('item-active');
        } else {
          this.navigationItem.nativeElement.classList.remove('item-active');
        }
      });
  }

  ngOnInit(): void {
  }



  onNavigationClick() {
    this.router.navigateByUrl(this.item.link as string);
  }

  ngOnDestroy() {
    this.urlChangeSubscription.unsubscribe();
  }

}
