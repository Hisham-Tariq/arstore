import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ReflectionEmailValidator} from "../../../../validators/reflection-email.validator";
import {AuthService} from "../../../../services/Authentication";
import {Router} from "@angular/router";
import {UserService} from "../../../../services/Customer/user.service";
import {OrderService} from "../../../../services/order/order.service";
import {IOrder} from "../../../../interfaces/i-order";


// contains a form with following fields:
// - First Name
// - Last Name
// - Email
// - Phone
// - Address
// - City
// - State
// - Zip
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  isSaving: boolean = false;
  isShowingLoading: boolean = false;
  @ViewChild('savingLoader') savingLoader: any;
  allOrders: IOrder[];


  // all fields are required
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, ReflectionEmailValidator()]],
    phone: ['', [Validators.required, Validators.pattern('03[0-9]{9}$')]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zip: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
  ) {
    this.orderService.getAllCurrentUserOrders().subscribe(
      (orders: IOrder[]) => {
        this.allOrders = orders;
      }
    );

    // if(this.authService.user == null) this.router.navigate(['']);
    // else this.form.patchValue({});

  }

  ngOnInit(): void {
  }


  // all fields getters

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get email() { return this.form.get('email'); }
  get phone() { return this.form.get('phone'); }
  get address() { return this.form.get('address'); }
  get city() { return this.form.get('city'); }
  get state() { return this.form.get('state'); }
  get zip() { return this.form.get('zip'); }


  saveBillingInfo(){
    if(this.form.valid){
      this.savingLoader.nativeElement.classList.toggle('hidden');
      this.isSaving = true;
      this.isShowingLoading= true;
      this.userService.setUserBillingInformation(this.form.value).then(r => {
        this.isSaving = false;
      });
    } else {
      alert("Please fill all the fields correctly");
    }
  }

  closeLoadingModal() {
    if(this.isSaving) return;
    this.isShowingLoading = false;
    setTimeout(() => {
      this.savingLoader.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  showInvoice(orderId: string) {
    this.router.navigateByUrl(`/profile/invoice/${orderId}`);
  }

}

