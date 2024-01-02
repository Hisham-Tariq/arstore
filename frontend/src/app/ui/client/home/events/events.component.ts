import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../../services/Product/product.service";
import {Product} from "../../../../interfaces";
import {ManageEventService} from "../../../../services/ManageEvent/manage-event.service";
import {combineLatestWith} from "rxjs";
import {IEventWithProducts} from "../../../../interfaces/IEvents";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: IEventWithProducts[] = [];

  constructor(
    private productService: ProductService,
    private eventService: ManageEventService,
  ) {
    // this.eventService.data.pipe(combineLatestWith(this.productService.getAllProductsDetails)).subscribe(([events, products]) => {
    //   this.events = [];
    //   events.map(event => {
    //     let eventProducts:ProductItem[] = products.filter(product => product.eventId === event.id && product.status === 'active');
    //     let eventWithProduct = <IEventWithProducts>{
    //       ...event,
    //       eventProducts,
    //     };
    //     this.events.push(eventWithProduct);
    //   });
    // });
  }

  ngOnInit(): void {
  }
}
