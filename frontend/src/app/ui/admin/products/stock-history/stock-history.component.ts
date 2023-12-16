import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { StockHistoryDataSource, StockHistoryItem } from './stock-history-datasource';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {IStockHistory} from "../../../../interfaces/i-stock";
import {StockService} from "../../../../services/Stock/stock.service";

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss']
})
export class StockHistoryComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IStockHistory>;
  dataSource: MatTableDataSource<IStockHistory>;
  parameterSubscription: Subscription

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['sr', 'CPrice', 'RPrice', 'PQuantity', 'NQuantity', 'Date'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private stockService: StockService
  ) {
    this.dataSource = new MatTableDataSource<IStockHistory>();
  }

  ngOnInit(): void{
    this.parameterSubscription = this.activatedRoute.paramMap.subscribe(params => {
      // this.stockService.getStockHistory(params.get('pid') ?? "", `#${params.get('color')}`).subscribe(value => {
      //   this.dataSource.data = value;
      // });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy() {
    this.parameterSubscription.unsubscribe();
  }

  // onBack(): void {
  //
  // }
}
