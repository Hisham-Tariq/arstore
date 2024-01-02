import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UpdateSubCategoryDialogComponent} from "./update-sub-category-dialog/update-sub-category-dialog.component";
import {ReflectionAlertType} from "../../../components/alert";
import {reflectionAnimations} from "../../../animations";
import {SubCategoryService} from 'src/app/services/SubCategory/sub-category.service';
import {MainCategoryService} from 'src/app/services/MainCategory/main-category.service';
import {MainCategoryInterface, SubCategoryInterface} from "../../../interfaces";
import {ProductService} from "../../../services/Product/product.service";

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
  animations: reflectionAnimations,
})
export class SubCategoryComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SubCategory>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;

  showAlert: boolean = false;

  data: MatTableDataSource<SubCategory>;
  searchKey: string = "";

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'main category', 'description', 'actions'];

  form = this.fb.group({
    name: [null, Validators.required],
    mainCategory: [null, Validators.required],
    description: [null, Validators.required],
  });

  itemSelectedForDelete : any | null
  mainCategories: MainCategoryInterface[] = [];
  subCategories: SubCategoryInterface[] = [];

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private mainCategoryService: MainCategoryService,
    private productService: ProductService,
  ) {
    this.mainCategoryService.data.subscribe(data => {
      this.mainCategories = data;
    });
    this.data = new MatTableDataSource<SubCategory>();
    this.subCategoryService.data.subscribe(data => {
      this.subCategories = data;
      this.generateTableData();
    });
    this.mainCategoryService.data.subscribe(res => {
      this.mainCategories = res;
      this.generateTableData();
    });
  }

  private generateTableData() {
    let data: SubCategory[] = [];
    for (const subCategory of this.subCategories) {
      let mainCategory = this.mainCategories.find(value => value.id === subCategory.mainCategoryId);
      if (typeof mainCategory === "undefined") continue;
      data.push({
        id: subCategory.id || "",
        name: subCategory.name,
        description: subCategory.description,
        mainCategory: mainCategory
      });
    }
    this.data.data = data;
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

  add() {
    if (this.form.valid) {
      const {name, description, mainCategory} = this.form.value;
      this.subCategoryService.createSubCategory(name, description, mainCategory).then((res) => {
        this.showAlertOfWith('success', 'Successfully Added the Sub Category');
      })
      //   .then(value => {
      //   this.showAlertOfWith('success', 'Successfully Added the Sub Category');
      // })
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields');
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
    // this.productService.deleteFromSubCategory(this.itemSelectedForDelete.id);
    this.showAlertOfWith('success', 'Successfully Deleted the Sub Category');
    this.subCategoryService.deleteSubCategory(this.itemSelectedForDelete.id).then((res) => {
      this.showAlertOfWith('success', 'Successfully Deleted the Sub Category');
      this.closeDeleteModal();
    })
    //   .then(() => {
    //   this.showAlertOfWith('success', 'Successfully Deleted the Sub Category');
    //   this.closeDeleteModal();
    // }).catch(() => {
    //   this.showAlertOfWith('error', 'Failed to Delete the Sub Category');
    // });
  }

  openUpdateModal(subCategory: any): void {
    this._dialog.open(UpdateSubCategoryDialogComponent, {
      data: {
        subCategory: subCategory,
      },
    });
  }

  onMainCategoryChange() {

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
  confirmForDelete(item: any) {
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


type SubCategory = {
  id: string,
  name: string,
  description: string,
  mainCategory: MainCategoryInterface,
}
