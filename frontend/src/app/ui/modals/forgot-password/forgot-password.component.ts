import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {AuthSignInComponent} from '../sign-in/sign-in.component';
import {ReflectionAlertType} from "../../../components/alert/alert.types";
import {AuthService} from "../../../services/Authentication";

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthForgotPasswordComponent implements OnInit {
  form: FormGroup;
  newPasswordForm: FormGroup;
  isSent = false;
  isLoading = false;
  showAlert: boolean = false;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AuthForgotPasswordComponent>,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.newPasswordForm = this._formBuilder.group({
        obbCode: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.MustMatch('password', 'confirmPassword')
      });
  }

  MustMatch(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[password];
      const confirmPasswordInput = group.controls[confirmPassword];
      if (passwordInput.value !== confirmPasswordInput.value) {
        return {
          mismatch: true
        };
      } else {
        return null;
      }
    };
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  openSignInDialog(): void {
    this.closeDialog();
    setTimeout(() => {
      const dialogRef = this.dialog.open(AuthSignInComponent, {});
      dialogRef.afterClosed().subscribe((_) => {
        console.log('The dialog was closed');
      });
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Create the form
  }

  sendResetLink(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.sendResetPasswordLink(this.email?.value).then(
        () => {
          this.isLoading = false;
          this.isSent = true;
          this.showAlert = true;
          this.alert.type = 'success';
          this.alert.message = 'Reset link sent to your email';
        },
        (err) => {
          this.alert.message = "User with this email doesn't exist";
          this.alert.type = 'error';
          this.showAlert = true;
          this.isLoading = false;
        }
      );
    }
  }

  onBackToSignIn() {
    this.closeDialog();
    // open the sign in dialog
    setTimeout(() => {
      const dialogRef = this.dialog.open(AuthSignInComponent, {});
      dialogRef.afterClosed().subscribe((_) => {
        console.log('The dialog was closed');
      });
    });
  }
}
