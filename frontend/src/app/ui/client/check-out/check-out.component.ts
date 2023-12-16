import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from "../../../services/Cart/cart.service";
import {ICartItemWithDetails} from "../../../interfaces/i-cart-item";
import {AuthService} from "../../../services/Authentication";
import {OrderService} from "../../../services/order/order.service";
import {VoucherCodeService} from "../../../services/VoucherCode/voucher-code.service";
import {VoucherCodeInterface} from "../../../interfaces/voucher-code.interface";


@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent implements OnInit {
  // @ViewChild('checkOutNgForm') checkOutNgForm: NgForm;

  form: FormGroup;
  // TODO: Find some way to fix this
  isScreenSmall: boolean = false;
  cartProducts: ICartItemWithDetails[];
  subTotalPrice: number;
  isPlacingOrder: boolean = false;
  havePlacedOrder: boolean = false;
  isVoucherCodeApplied: boolean = false;
  isCheckingVoucherCode: boolean = false;
  voucherCode: VoucherCodeInterface | null = null;
  @ViewChild('checkoutModal') checkoutModal: any;
  handler: any = null;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private voucherService: VoucherCodeService,
  ) {

    // if (this.authService.user === null) {
    //   this._router.navigate(['/cart']);
    // }


    const user = {};
    this.form = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('03[0-9]{9}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
    this.form.patchValue(user);

    this.cartService.observableDataWithDetails.subscribe(
      (data: ICartItemWithDetails[]) => {
        this.cartProducts = data;
      }
    );

    this.cartService.totalCartPrice().subscribe(value => {
      this.subTotalPrice = value;
    });

  }

  // create getter for form controls
  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get phone() {
    return this.form.get('phone');
  }

  get address() {
    return this.form.get('address');
  }

  get city() {
    return this.form.get('city');
  }

  get state() {
    return this.form.get('state');
  }

  get zip() {
    return this.form.get('zip');
  }

  ngOnInit(): void {
  }

  closeCheckOutModal() {
    if (this.isPlacingOrder) return;
    this.isPlacingOrder = false;
    setTimeout(() => {
      this.checkoutModal.nativeElement.classList.remove('hidden');
    }, 300);
  }

  goToOrders() {
    this._router.navigate(['/orders-history']);
  }

  goToProducts() {
    this._router.navigate(['/products']);
  }

  onConfirmOrder() {
    if (this.form.valid) {
      this.pay();
    } else {
      this.form.markAllAsTouched();
      alert('Please fill out all the fields');
    }
  }

  async checkOutOrder() {
    this.isPlacingOrder = true;
    this.checkoutModal.nativeElement.classList.remove('hidden');
    if(typeof this.voucherCode != 'undefined' && this.voucherCode != null) {
      let res = await this.voucherService.checkCodeIsValid(this.voucherCode?.voucherCode!);
      if (!res.isValid) {
        this.voucherCode = null;
        this.isVoucherCodeApplied = false;
        this.isPlacingOrder = false;
        alert('Voucher code is not valid');
        return;
      }
    }
    this.orderService.add({
      ...this.form.value,
      zipCode: this.zip?.value,
      totalPrice: this.totalPrice,
    }, this.cartProducts).then(
      (data: any) => {
        if (this.isVoucherCodeApplied) {
          this.voucherService.addUserInVoucherCode(this.voucherCode!);
        }
        this.isPlacingOrder = false;
        this.havePlacedOrder = true;
        // this.checkoutModal.nativeElement.classList.add('hidden');
      },
      (error: any) => {
        console.log(error);
        this.isPlacingOrder = false;
        this.havePlacedOrder = true;
        // this.checkoutModal.nativeElement.classList.add('hidden');
      }
    );

  }


  get voucherPrice() {
    if (this.isVoucherCodeApplied) {
      return (this.subTotalPrice * this.voucherCode!.discount) / 100;
    } else {
      return 0;
    }
  }

  get totalPrice() {
    return this.subTotalPrice - this.voucherPrice;
  }

  private applyVoucherCode(voucher: VoucherCodeInterface) {
    this.isVoucherCodeApplied = true;
    this.voucherCode = voucher;
  }

  removeCode() {
    this.isVoucherCodeApplied = false;
    // this.voucherService.removeUserInVoucherCode(this.voucherCode!);
    this.voucherCode = null;
  }

  checkVoucherCode(code: string) {
    if (this.isVoucherCodeApplied) {
      alert('You have already applied a voucher code');
      return;
    }
    this.isCheckingVoucherCode = true;
    this.voucherService.checkCodeIsValid(code).then(
      (data: any) => {
        if (data.isValid) {
          this.voucherCode = data.voucher;
          this.applyVoucherCode(data.voucher)
        } else {
          alert('Voucher code is not valid');
        }
      },
      (error: any) => {
        alert('Voucher code is not valid');
      }
    ).finally(() => {
      this.isCheckingVoucherCode = false;
    });
  }

  pay() {
    let handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51HxRkiCumzEESdU2Z1FzfCVAJyiVHyHifo0GeCMAyzHPFme6v6ahYeYbQPpD9BvXbAacO2yFQ8ETlKjo4pkHSHSh00qKzqUVK9',
      locale: 'auto',
      token: (token: any) => {
        this.checkOutOrder();
        console.log(token)
      }
    });

    handler.open({
      name: 'Reflection Store Payment',
      description: 'Payment for order',
      currency: 'pkr',
      amount: this.totalPrice * 100
    });

  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51HxRkiCumzEESdU2Z1FzfCVAJyiVHyHifo0GeCMAyzHPFme6v6ahYeYbQPpD9BvXbAacO2yFQ8ETlKjo4pkHSHSh00qKzqUVK9',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }

      window.document.body.appendChild(s);
    }
  }

}
