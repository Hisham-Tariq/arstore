import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {UpdateMainCategoryDialogComponent} from "./update-main-category-dialog/update-main-category-dialog.component";
import {FormBuilder, Validators} from "@angular/forms";
import {ReflectionAlertType} from "../../../components/alert";
import {reflectionAnimations} from "../../../animations";
import {MainCategoryInterface} from "src/app/interfaces/main-category.interface";
import {MainCategoryService} from "../../../services/MainCategory/main-category.service";
import {ProductService} from "../../../services/Product/product.service";
import {SubCategoryService} from "../../../services/SubCategory/sub-category.service";

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss'],
  animations: reflectionAnimations,
})
export class MainCategoryComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<MainCategoryInterface>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;

  showAlert: boolean = false;
  data: MatTableDataSource<MainCategoryInterface>;
  searchKey: string = "";

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'description', 'actions'];

  form = this.fb.group({
    name: [null, Validators.required],
    description: [null, Validators.required],
  });

  itemSelectedForDelete: any | null;

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    public mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
  ) {
    this.data = new MatTableDataSource<MainCategoryInterface>();
    this.mainCategoryService.data.subscribe(res => {
      this.data.data = res;
    });
  }


  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
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

  onDismissedChanged(e: any) {
    this.showAlert = !e;
  }

  add() {
    if (this.form.valid) {
      this.showAlert = false;
      const {name, description} = this.form.value;
      this.mainCategoryService.createMainCategory(name, description).then((_) => {
        this.showAlertOfWith('success', 'Successfully Added the Main Category');
        this.form.reset();
      });

      //   .subscribe(() => {
      //   this.showAlertOfWith('success', 'Successfully Added the Main Category');
      //   this.form.reset();
      // }).catch(() => {
      //   this.showAlertOfWith('error', 'Failed to Add the Product');
      //   this.startAlertTimeout();
      // });
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields', false);
    }
  }


  delete() {
    // delete the main category by id
    this.subCategoryService.deleteFromMainCategory(this.itemSelectedForDelete.id);
    // this.productService.deleteFromMainCategory(this.itemSelectedForDelete.id);
    this.mainCategoryService.deleteMainCategory(this.itemSelectedForDelete.id).then((_) => {
      this.showAlertOfWith('success', 'Successfully Deleted the Main Category');
      this.closeDeleteModal();
    })
    //   .catch(() => {
    //   this.showAlertOfWith('error', 'Failed to Delete the Category');
    // });
  }

  openUpdateModal(mainCategory: any): void {
    this._dialog.open(UpdateMainCategoryDialogComponent, {
      data: {
        mainCategory: mainCategory,
      }
    });
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

  confirmForDelete(item:any) {
    this.itemSelectedForDelete = item;
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;
  }

  closeDeleteModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }
}
