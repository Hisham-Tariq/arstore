import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../../services/Product/product.service";
import {ProductItem} from "../../../../interfaces";

@Component({
  selector: 'home-new-product-carousel',
  templateUrl: './new-product-carousel.component.html',
  styleUrls: ['./new-product-carousel.component.scss']
})
export class NewProductCarouselComponent implements OnInit {
  products: ProductItem[]; // 10 maximum

  constructor(
    private productService: ProductService
  ) {
    this.productService.allProductsOrderByDate.subscribe(value => {
      this.products = value.filter(product => product.status == 'active').slice(0, 10);
    });
  }

  ngOnInit(): void {
  }

  signUpUser(){

  }

}
