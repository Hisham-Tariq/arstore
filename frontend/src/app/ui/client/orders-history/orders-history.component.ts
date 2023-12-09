import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../services/order/order.service";
import {IOrderWithProducts} from "../../../interfaces/i-order";

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {
  allOrders: IOrderWithProducts[] = [];
  filteredOrders: IOrderWithProducts[] = [];
  searchKey: string = '';
  constructor(
    private orderService: OrderService,
  ) {
    this.orderService.observableData.subscribe(data => {
      console.log("Data Changed");
      this.allOrders = data;
      this.applyFilter();
    });
  }


  ngOnInit(): void {
  }

  applyFilter() {
    if(this.searchKey !== "") {
      this.filteredOrders = this.allOrders.filter(order => {
        return order.id!.toLowerCase().includes(this.searchKey.toLowerCase());
      });
    } else {
      this.filteredOrders = this.allOrders;
    }
  }
}
