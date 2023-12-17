import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ReflectionUser} from "../../../interfaces";
import {OrderService} from "../../../services/order/order.service";
import {UserService} from "../../../services/Customer/user.service";
import {ICustomers} from "../../../interfaces/i-customers";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICustomers>;
  data: MatTableDataSource<ICustomers>;
  searchKey: string = "";



  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'email', 'phone', 'total_orders'];


  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _customerService: UserService,
  ) {
    this.data = new MatTableDataSource<ICustomers>();
    this._customerService.fetchAllCustomers();
    this._customerService.customers$.subscribe(data => {
      this.data.data = data;
      console.log(data)
    });
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
    this.data.filter = this.searchKey.trim().toLowerCase();
  }

}
