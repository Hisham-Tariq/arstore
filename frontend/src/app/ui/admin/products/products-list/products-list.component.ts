import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {ReflectionAlertType} from "../../../../components/alert";
import {reflectionAnimations} from "../../../../animations";
import {Router} from "@angular/router";
import {MainCategoryInterface, ProductInterface, ProductStatus} from "../../../../interfaces";
import {MainCategoryService} from "../../../../services/MainCategory/main-category.service";
import {ProductService} from "../../../../services/Product/product.service";

@Component({
  selector: 'app-update-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: reflectionAnimations,
})
export class ProductsListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductInterface>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;
  currentProductToDelete: ProductInterface;

  showAlert: boolean = false;
  data!: MatTableDataSource<ProductInterface>;
  searchKey: string = "";
  mainCategories: MainCategoryInterface[] = [];
  allProducts: ProductInterface[] = [];

  selectedMainCategory: string = "null";

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['image', 'name', 'status', 'active', 'actions'];
  activeFilter: boolean = true;
  minPriceFilter: number = 0;
  maxPriceFilter: number = 999999;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private mainCategoryService: MainCategoryService,
    private productService: ProductService,
  ) {
    this.data = new MatTableDataSource();
    this.mainCategoryService.data.subscribe(data => {
      this.mainCategories = data;
    });
    this.productService.data.subscribe(data => {
      this.allProducts = data;
      this.applyFilter();
    });
    // this.data.filter = "300";
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


  onUpdateProduct(product: ProductInterface): void{
    this._router.navigateByUrl(`/admin/update-product/${product.id}`, {
      state: {
        product: product,
      }
    });
  }

  applyFilter(): void{
    let products : ProductInterface[] = this.allProducts;
    // filter products which are isActive
    if(this.activeFilter){
      products = products.filter(product => product.status === 'active');
    }
    if(this.selectedMainCategory != 'null'){
      // all products where mainCategory == selectedMainCategory
      products = products.filter(product => product.mainCategory == this.selectedMainCategory);
    }

    this.data.data = products;
    this.data.filter = this.searchKey.trim().toLowerCase();
  }

  getProductFirstColorThumbnail(product: ProductInterface): string{
    if(product.colors.length > 0){
      // @ts-ignore
      return product.images[product.colors[0]]["thumbnail"];
    }
    return "";
  }


  onDeleteProduct() {
    this.productService.delete(this.currentProductToDelete).then(() => {
      this.applyFilter();
      console.log("deleted");
    });
  }
  confirmForDelete(product: ProductInterface) {
    this.currentProductToDelete = product;
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;
  }

  closeDeleteModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  setProductStatus(product: any, value: any) {
    let status: ProductStatus;
    if(value) status = 'active';
    else status = 'inactive';
    this.productService.updateProductStatus(product.id, status).then(() => {

    });
  }
}


