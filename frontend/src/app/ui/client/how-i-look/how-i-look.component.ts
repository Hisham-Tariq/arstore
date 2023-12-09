import { Component, OnInit } from '@angular/core';
import {ProductInterface, ProductItem} from "../../../interfaces";

@Component({
  selector: 'app-how-i-look',
  templateUrl: './how-i-look.component.html',
  styleUrls: ['./how-i-look.component.scss']
})
export class HowILookComponent implements OnInit {
  products: ProductItem[] = [];

  constructor() { }

  ngOnInit(): void {}
}
