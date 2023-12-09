import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {reflectionAnimations} from "../../../animations";
import {ReflectionAlertType} from "../../../components/alert";
import {MatTableDataSource} from "@angular/material/table";
import {MainCategoryInterface} from "../../../interfaces";
import {ContactusInterface} from "../../../interfaces/contactusInterface";
import {MatDialog} from "@angular/material/dialog";
import {ContactUsService} from "../../../services/ContactUs/contact-us.service";

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    animations: reflectionAnimations,
})
export class ContactUsComponent implements OnInit {
    form: FormGroup;
    isScreenSmall: boolean = false;
    alert: { type: ReflectionAlertType; message: string } = {
      type: 'success',
      message: 'Successfully Added Your Review',
    };
    showAlert: boolean = false;
    data: MatTableDataSource<ContactusInterface>;
    searchKey: string = "";

  constructor(
      private _dialog: MatDialog,
      private fb: FormBuilder,
      public contactUsService: ContactUsService,
    ) {
      this.form = this.fb.group({
        name:['', [Validators.required]],
        email: [
          '',
          [Validators.required, Validators.email],
        ],
        phone: ['', Validators.required],
        message: ['', Validators.required],
      })
    }

  get name(): AbstractControl | null {
    return this.form.get("name");
  }

  get phone(): AbstractControl | null {
    return this.form.get("phone");
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get message(): AbstractControl | null {
    return this.form.get("message");
  }
  onDismissedChanged(e: any) {
    this.showAlert = !e;
  }


  submitContactUsForm() {
    console.log("Button Clicked");
    console.table(this.form.value);
      if (this.form.valid) {
        this.showAlert = false;
        const {name, phone, email, message} = this.form.value;
        this.contactUsService.add({name, phone, email, message}).then(() => {
          this.showAlertOfWith('success', 'Successfully Added your message');
          this.form.reset();
        }).catch(() => {
          this.showAlertOfWith('error', 'Failed to Add the message');
          this.startAlertTimeout();
        });
      } else {
        this.showAlertOfWith('error', 'Please fill all the required fields', false);
      }
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


    ngOnInit(): void {
        // Create the form
    }

}
