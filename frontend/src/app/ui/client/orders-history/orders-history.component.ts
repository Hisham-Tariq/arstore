import { Component, OnInit } from '@angular/core';
import {Order, OrderService} from "../../../services/order/order.service";

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  searchKey: string = '';
  constructor(
    private orderService: OrderService,
  ) {
    this.orderService.orders$.subscribe(data => {
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
