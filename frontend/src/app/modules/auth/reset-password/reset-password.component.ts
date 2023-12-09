import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthResetPasswordComponent implements OnInit {

  // alert: { type: FuseAlertType; message: string } = {
  //     type   : 'success',
  //     message: ''
  // };
  resetPasswordForm: FormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder
  ) {
    this.resetPasswordForm = this._formBuilder.group({
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required]
      },
    );

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset password
   */
  resetPassword(): void {
  }
}
