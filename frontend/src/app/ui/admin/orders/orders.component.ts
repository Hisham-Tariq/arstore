import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Order, OrderService} from "../../../services/order/order.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {
  @ViewChild('statusChangeModal') statusChangeModal: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Order>;
  fromDate: any;
  toDate: any;
  _fromDate: Date = new Date((new Date()).setFullYear((new Date()).getFullYear() - 20));
  _toDate: Date = new Date();
  data!: MatTableDataSource<Order>;
  searchKey: string = "";
  allOrders: Order[] = [];


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['orderId', 'name', 'phone', 'odate', 'ddate', 'status', 'bill', 'actions'];
  selectedFilteredOrderStatus: string = "all";
  isAskingForConfirmation: boolean = false;
  private selectedOrder: Order;


  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private orderService: OrderService,
  ) {
    this.data = new MatTableDataSource<Order>();
    this.orderService.getOrders().then(orders => {
      this.data.data = orders;
      this.allOrders = orders
    })
  }

  ngAfterViewInit(): void {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.table.dataSource = this.data;
  }

  clearSearchField(): void {
    this.searchKey = "";
    this.applyFilter();
  }


  applyFilter(): void {
    let data = this.allOrders;
    if (this.selectedFilteredOrderStatus != 'all') {
      data = data.filter(order => order.status == this.selectedFilteredOrderStatus);
    }
    // filter by _fromDate and _toDate
    data = data.filter(order => {
      let orderDate = new Date(order.createdAt);
      return orderDate.getTime() >= this._fromDate.getTime() && orderDate.getTime() <= this._toDate.getTime()
    });
    this.data.data = data;
    this.data.filter = this.searchKey.trim().toLowerCase();
  }

  showOrderDetail(row: any) {
    this._router.navigateByUrl(`/admin/order-detail/${row.id}`, {
      state: {
        order: row
      }
    });
  }

  showReviewDetail(row: any) {
    this._router.navigateByUrl(`/admin/review-detail/${row.id}`, {
      state: {
        order: row
      }
    });
  }

  filterOrderStatusChange() {
    this.applyFilter()
  }

  confirmForDelivery(order: Order) {
    this.selectedOrder = order;
    this.statusChangeModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;
  }

  closeConfirmationModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.statusChangeModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  updateStatus() {
    this.orderService.updateOrderStatus(this.selectedOrder.id,  "delivered").then(() => {
      this.closeConfirmationModal();
    });
  }

  checkFromDateIsValid() {
    // validate the from date
    // parse the date and then validate it
    // if it is not valid show error message
    // if it is valid then set the from date
    if(this.fromDate == ''){
      this._fromDate = new Date((new Date()).setFullYear((new Date()).getFullYear() - 20));
      this.applyFilter();
    }
    let date = new Date(this.fromDate);
    if (date.getTime() > new Date().getTime()) {
      alert("From date cannot be in future");
      this.fromDate = '';
    } else if(date.getTime() > this._toDate.getTime()){
      alert("From date cannot be after to date");
      this.fromDate = '';
    } else {
      this._fromDate = date;
      this.applyFilter();
    }

  }

  checkToDateIsValid() {
    // validate the to date
    // parse the date and then validate it if the to date is not before the from date
    // if it is not valid show error message
    // if it is valid then set the to date
    if(this.toDate == '') {
      this._toDate = new Date();
      this.applyFilter()
    }
    let date = new Date(this.toDate);
    if (date.getTime() > new Date().getTime()) {
      alert("To date cannot be in future");
      this.toDate = '';
    } else if (date.getTime() < this._fromDate.getTime()){
      alert("To date cannot be before from date");
      this.toDate = '';
    } else {
      this._toDate = date;
      this.applyFilter();
    }
  }
}
