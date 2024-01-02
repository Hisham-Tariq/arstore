import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {Product} from "../../interfaces";
import {SubscriberService} from "../../services/Subscribers/subscriber.service";

@Component({
  selector: 'app-client-app-container',
  templateUrl: './client-app-container.component.html',
  styleUrls: ['./client-app-container.component.scss'],
})
export class ClientAppContainerComponent implements OnInit {
  navigationDrawer!: MatDrawer;
  cartProducts!: Product[];

  constructor(private _router: Router) {
    this.cartProducts = [];
  }

  ngOnInit() {
  }

}
