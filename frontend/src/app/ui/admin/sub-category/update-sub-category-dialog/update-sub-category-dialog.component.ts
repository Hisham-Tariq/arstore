import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ReflectionAlertType} from "src/app/components/alert";
import {MainCategoryInterface, SubCategoryInterface} from "src/app/interfaces";
import {MainCategoryService} from "src/app/services/MainCategory/main-category.service";
import {SubCategoryService} from "src/app/services/SubCategory/sub-category.service";
import {reflectionAnimations} from "src/app/animations";

@Component({
  selector: 'app-update-sub-category-dialog',
  templateUrl: './update-sub-category-dialog.component.html',
  styleUrls: ['./update-sub-category-dialog.component.scss'],
  animations: reflectionAnimations,
})
export class UpdateSubCategoryDialogComponent implements OnInit {
  form!: FormGroup;

  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };
  showAlert: boolean = false;
  mainCategories: MainCategoryInterface[] = [];
  selectedMainCategory: string;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
  ) {
    this.selectedMainCategory = data['subCategory'].mainCategory.id;
    this.mainCategoryService.data.subscribe(data => {
      this.mainCategories = data;
    });
    this.form = this.fb.group({
      name: [data['subCategory'].name, Validators.required],
      mainCategory: [data['subCategory'].mainCategory.id, Validators.required],
      description: [data['subCategory'].description, Validators.required],
    });
    // this.form.controls['mainCategory'].setValue(this.mainCategories.find(category => category.id === data['subCategory'].mainCategoryId));
  }

  ngOnInit(): void {}

  update(){
    if(this.form.valid){
      const {name, mainCategory, description} = this.form.value;
      const subCategory: SubCategoryInterface = {
        id: this.data['subCategory'].id,
        name,
        description,
        mainCategoryId: mainCategory,
      };
      this.subCategoryService.update(subCategory).then(() => {
        this.showAlertOfWith("success", 'Successfully Updated the Sub Category');
      }).catch(() => {
        this.showAlertOfWith("error", 'Failed to Update the Sub Category');
      });
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields');
    }
  }

  onDismissedChanged(e: boolean) {
    this.showAlert = !e;
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
}
