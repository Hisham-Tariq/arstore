import { Component, OnInit } from '@angular/core';
import {Product} from "../../../interfaces";

@Component({
  selector: 'app-how-i-look',
  templateUrl: './how-i-look.component.html',
  styleUrls: ['./how-i-look.component.scss']
})
export class HowILookComponent implements OnInit {
  products: Product[] = [];

  constructor() { }

  ngOnInit(): void {}
}
