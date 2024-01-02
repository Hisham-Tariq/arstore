import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReflectionAlertType} from "../../../../components/alert";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageEventService} from "../../../../services/ManageEvent/manage-event.service";
import {reflectionAnimations} from "../../../../animations";
import {Product} from "../../../../interfaces";
import {ProductService} from "../../../../services/Product/product.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-update-event-dialog',
  templateUrl: './update-event-dialog.component.html',
  styleUrls: ['./update-event-dialog.component.scss'],
  animations:reflectionAnimations,
})
export class UpdateEventDialogComponent implements OnInit {

  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the event',
  };
  showAlert: boolean = false;
  products: Product[] = [];
  form!: FormGroup;
  isUpdating: boolean = false;
  oldProducts: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manageEventsService: ManageEventService,
    private productService: ProductService,
  ) {
    let eventData = data['event'];
    this.oldProducts = eventData.products;
    this.form = this.fb.group({
      name: [eventData.name, Validators.required],
      discount: [eventData.discount, Validators.required],
      products: [null, Validators.required],
      validUpTo: [eventData.validUpTo, Validators.required],
    });
    // this.productService.data.pipe(map(value => {
    //   // return all who have no discount or in the same event
    //   return value.filter(product => {
    //     return product.discount === 0 || product.eventId === eventData.id;
    //   });
    //   // return value.filter(product => product.discount === 0  || product.eventId == eventData.id);
    // })).subscribe(data => {
    //   this.products = data;
    //   this.product?.setValue(eventData.products);
    // });
  }

  get name() {
    return this.form.get('name');
  }

  get discount() {
    return this.form.get('discount');
  }

  get product() {
    return this.form.get('products');
  }

  get validUpTo() {
    return this.form.get('validUpTo');
  }

  ngOnInit(): void {}

  update() {
    if (this.form.valid) {
      this.isUpdating = true;
      // find all the removed products
      let removedProducts = this.oldProducts.filter(product => {
        console.log(product, !this.product!.value.includes(product));
        return !this.product!.value.includes(product);
      });
      const {id} = this.data['event'];
      this.manageEventsService.update({id, ...this.form.value}, removedProducts).then(() => {
        this.showAlertOfWith("success", "Successfully Updated the Event");
      }).catch(() => {
        this.showAlertOfWith("error", "Failed to Update the Event");
      }).finally(() => {
        this.isUpdating = false;
      });
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

  productSelectionChange() {
    console.log(this.product?.value);
  }
}
