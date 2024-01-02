import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/Product/product.service";
import {Product} from "../../interfaces";

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService
  ) {
    this.productService.getMostSoldProducts.then((products: Product[]) => {
      let prods = products.filter(product => product.status == 'active');
      if(prods.length >= 4) {
        this.products = prods.slice(0, 4);
      } else {
        this.products = prods;
      }
    });
  }

  ngOnInit(): void {
  }

}
