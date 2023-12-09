import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {AuthService} from "../../../services/Authentication";
import {OrderService} from "../../../services/order/order.service";
import {OrdersChartComponent} from "./orders-chart/orders-chart.component";
import {ProfitChartComponent} from "./profit-chart/profit-chart.component";
import {CustomersChartComponent} from "./customers-chart/customers-chart.component";
import {UserService} from "../../../services/Customer/user.service";


@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
})
export class AnalyticsComponent implements  AfterViewInit
{
//  totalOrdersThisMonth: number = 0;
//  totalProfitThisMonth: number = 0;
//  currentYearOrders: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
//  currentYearProfit: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
//  currentYearUsers: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
//  @ViewChild('ordersChartComponent') ordersChart: OrdersChartComponent;
//  @ViewChild('profitChartComponent') profitChart: ProfitChartComponent;
//  @ViewChild('customersChartComponent') customerChart: CustomersChartComponent;

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}


  ngAfterViewInit() {
//    this.userService.getAllUsers().subscribe(users => {
//      users.forEach(user => {
//        let createdAt = new Date(user.createdAt.seconds * 1000);
//        this.currentYearUsers[createdAt.getMonth()]++;
//      });
//      this.customerChart.updateSeries();
//    });

//    this.orderService.observableData.subscribe(orders => {
//      this.totalOrdersThisMonth = 0;
//      orders.forEach(order => {
//        const unixTime = order.date.seconds;
//        const date = new Date(unixTime*1000);
//        // check if the order is in the current month
//        this.currentYearOrders[date.getMonth()] += 1;
//        // find profit of the order
//        order.products.forEach(product => {
//          this.currentYearProfit[date.getMonth()] += (product.price - product.consumerPrice) * product.quantity;
//        });
//        if (date.getMonth() === new Date().getMonth()) {
//          this.totalOrdersThisMonth++;
//          order.products.forEach(product => {
//            this.totalProfitThisMonth += (product.price - product.consumerPrice) * product.quantity;
//          });
//        }
//      })
//      // console.log(this.ordersChart)
//      this.ordersChart.updateSeries();
//      this.profitChart.updateSeries();
//    });
  }

}
