import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductInterface} from "../../../interfaces";
import {Router} from "@angular/router";

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LandingHomeComponent implements OnInit{
    slider: any;
    defaultTransform: any;
    products: ProductInterface[] = [];

    constructor(
      private _router: Router,
    ) {

    }

    ngOnInit(): void {
        this.slider = document.getElementById('slider');
        this.defaultTransform = 0;
    }

    goNext(): void {
        console.log('Before Default Transform: ', this.defaultTransform);
        this.defaultTransform = this.defaultTransform - 398;
        console.log('After Default Transform: ', this.defaultTransform);
        if (Math.abs(this.defaultTransform) >= this.slider.scrollWidth / 1.7) {
            this.defaultTransform = 0;
        }
        this.slider.style.transform =
            'translateX(' + this.defaultTransform + 'px)';
    }

    goPrev(): void {
        console.log('Before Default Transform: ', this.defaultTransform);
        if (Math.abs(this.defaultTransform) === 0) {
            this.defaultTransform = 0;
        } else {
            this.defaultTransform = this.defaultTransform + 398;
        }
        console.log('After Default Transform: ', this.defaultTransform);
        this.slider.style.transform =
            'translateX(' + this.defaultTransform + 'px)';
    }
  onProductClick(): void {
    this._router.navigateByUrl(`/products/`);
  }

  goToGlasses() {
    this._router.navigateByUrl("products?category=glasses");
  }
  goToLenses(){
    this._router.navigateByUrl("products?category=lenses");
  }
}
