import {Component, Inject, OnInit} from '@angular/core';
import {reflectionAnimations} from "../../../../animations";
import {ReflectionAlertType} from "../../../../components/alert";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VoucherCodeService} from "../../../../services/VoucherCode/voucher-code.service";

@Component({
  selector: 'app-update-code-dialog',
  templateUrl: './update-code-dialog.component.html',
  styleUrls: ['./update-code-dialog.component.scss'],
  animations:reflectionAnimations,
})
export class UpdateCodeDialogComponent implements OnInit {
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Code',
  };
  showAlert: boolean = false;
  form!: FormGroup;
  isUpdating: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private voucherCodeService: VoucherCodeService,
  ) {
    let codeData = data['voucherCode'];
    this.form = this.fb.group({
      voucherCode: [codeData.voucherCode, Validators.required],
      discount: [codeData.discount, Validators.required],
    });
  }


  get voucherCode() {
    return this.form.get('voucherCode');
  }

  get discount() {
    return this.form.get('discount');
  }

  ngOnInit(): void {}

  update() {
    if (this.form.valid) {
      this.isUpdating = true;
      const {discount} = this.form.value;
      const voucher = this.data['voucherCode'];
      this.voucherCodeService.update({voucherCode: voucher.voucherCode, discount: discount}).then(() => {
        this.showAlertOfWith("success", "Successfully Updated the Code");
      }).catch(() => {
        this.showAlertOfWith("error", "Failed to Update the Code");
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
}
