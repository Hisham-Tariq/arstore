import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReflectionAlertType} from "../../../../components/alert";
import {reflectionAnimations} from 'src/app/animations'
import {MainCategoryService} from "../../../../services/MainCategory/main-category.service";

@Component({
  selector: 'app-update-main-category-dialog',
  templateUrl: './update-main-category-dialog.component.html',
  styleUrls: ['./update-main-category-dialog.component.scss'],
  animations: reflectionAnimations,
})
export class UpdateMainCategoryDialogComponent implements OnInit {

  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };
  showAlert: boolean = false;

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private mainCategoryService: MainCategoryService,
  ) {
    let mainCategoryData = data['mainCategory'];

    this.form = this.fb.group({
      name: [mainCategoryData.name, Validators.required],
      description: [mainCategoryData.description, Validators.required],
    });
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  ngOnInit(): void {
  }

  update() {
    if (this.form.valid) {
      const {name, description} = this.form.value;
      const {id} = this.data['mainCategory'];
      this.mainCategoryService.updateMainCategory(id, name, description).then((res) => {
        this.showAlertOfWith("success", "Successfully Updated the main category");
      })

      //   .then(() => {
      //   this.showAlertOfWith("success", "Successfully Updated the main category");
      // }).catch(() => {
      //   this.showAlertOfWith("error", "Failed to Update the Main Category");
      // });
    } else {
      this.showAlertOfWith("error", "Please fill all the required fields");
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
