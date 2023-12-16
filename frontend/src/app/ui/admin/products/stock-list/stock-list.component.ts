import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {IStock} from "../../../../interfaces/i-stock";
import {StockService} from "../../../../services/Stock/stock.service";
import {MatDialog} from "@angular/material/dialog";
import {ReflectionAlertType} from "../../../../components/alert";
import {reflectionAnimations} from "../../../../animations";
import {ProductInterface} from "../../../../interfaces";
import {ProductService} from "../../../../services/Product/product.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  animations: reflectionAnimations,
})
export class StockListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StockItem>;
  data: MatTableDataSource<StockItem>;
  searchKey: string = "";
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Stock',
  };
  showAlert: boolean = false;
  activeStockFilter : boolean = false;

  displayedColumns = ['name', 'color', 'CPrice', 'RPrice','Quantity', 'Date', 'actions'];
  itemSelectedForDelete: any;

  allStocks: IStock[] = [];
  allProducts: ProductInterface[] = [];
  allStockItems: StockItem[] = [];
  selectedProducts: string[] = [];
  minCPriceFilter: number = 0;
  maxCPriceFilter: number = 9999999;
  minRPriceFilter: number = 0;
  maxRPriceFilter: number = 9999999;

  constructor(
    private manageStockService: StockService,
    private productService: ProductService,
    private _dialog: MatDialog,
    private route: Router,
  ) {
    this.data = new MatTableDataSource<StockItem>();
    this.manageStockService.observableData.subscribe(data => {
      this.allStocks = data;
      this.generateTableData();
    });
    this.productService.data.subscribe(data => {
      this.allProducts = data;
      this.generateTableData()
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
    let data = this.allStockItems;
    // filter all the items which have stock less than 1
    if (this.activeStockFilter) {
      data = data.filter(item => item.totalQuantity > 0);
    }
    data = data.filter(item => {
      if(this.selectedProducts.length === 0) return true;
      return this.selectedProducts.includes(item.product);
    });

    // if maxPriceFilter or minPriceFilter is not 0, filter products where price minPriceFilter >= product <= maxPriceFilter
    if(this.maxCPriceFilter != 0 || this.minCPriceFilter != 0){
      data = data.filter(item => item.consumerPrice >= this.minCPriceFilter && item.consumerPrice <= this.maxCPriceFilter);
    }

    if(this.maxRPriceFilter != 0 || this.minRPriceFilter != 0){
      data = data.filter(item => item.retailerPrice >= this.minRPriceFilter && item.retailerPrice <= this.maxRPriceFilter);
    }

    this.data.data = data;
    this.data.filter = this.searchKey.trim().toLowerCase();
  }

  generateTableData(){
    let data : StockItem[] = [];
    if(this.allStocks.length && this.allProducts.length){
      // find the product for each stock
      this.allStocks.forEach(stock => {
        let product = this.allProducts.find(product => product.id === stock.product);
        if(product){
          data.push({
            ...stock,
            productData: product
          });
        }
      });
      this.allStockItems = data;
      this.data.data = data;
    }
  }

  openConfirmDeleteDialog(data: any){
    this.itemSelectedForDelete = data;
  }

  hideDeleteDialog(){
    this.itemSelectedForDelete = null;
  }

  delete() {
    // delete the main category by id
    this.showAlertOfWith('success', 'Successfully Deleted the Stock');
    // this.manageStockService.delete(this.itemSelectedForDelete.id).then(() => {
    //   this.showAlertOfWith('success', 'Successfully Deleted the Stock');
    //   this.hideDeleteDialog();
    // }).catch(() => {
    //   this.showAlertOfWith('error', 'Failed to Delete the Stock');
    //   this.hideDeleteDialog();
    // });
  }

  showAlertOfWith(type: ReflectionAlertType, message: string, withTimeout: boolean = true) {
    this.alert.type = type;
    this.alert.message = message;
    this.showAlert = true;
    if (withTimeout) {
      this.startAlertTimeout();
    }
  }

  startAlertTimeout(time: number = 5000) {
    setTimeout(() => {
      this.showAlert = false;
    }, time);
  }

  showStockHistory(item: StockItem) {
    const color = item.color.replace("#", "");
    this.route.navigateByUrl(`/admin/stock-history/${item.product}/${color}`)
  }
}

interface StockItem extends IStock {
  productData: ProductInterface
}
