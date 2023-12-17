import {Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {reflectionAnimations} from '../../../animations';
import {ReflectionAlertType} from "../../../components/alert";

import {MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {AuthSignUpComponent} from '../sign-up/sign-up.component';
import {AuthForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {AuthService} from "../../../services/Authentication";
import {ReflectionEmailValidator} from "../../../validators/reflection-email.validator";

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: reflectionAnimations,
})
export class AuthSignInComponent implements OnInit {
  isActive: boolean = false;
  isLoading: boolean = false;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  showAlert: boolean = false;
  form: FormGroup;


  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    public readonly authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    public dialogRef: MatDialogRef<AuthSignInComponent>,
    public dialog: MatDialog
  ) {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, ReflectionEmailValidator()]],
      password: ['', Validators.required],
      rememberMe: false,
    });
  }


  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get password(): AbstractControl | null {
    return this.form.get("password");
  }

  get rememberMe(): AbstractControl | null {
    return this.form.get("rememberMe");
  }

  openSignUpDialog(): void {
    // Email Regex Validator

    this.closeDialog();
    setTimeout(() => {
      const dialogRef = this.dialog.open(AuthSignUpComponent, {});
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }, 50);
  }

  openForgotPasswordDialog(): void {
    this.closeDialog();
    const dialogRef = this.dialog.open(AuthForgotPasswordComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The ForgotPasswrod Dialog Was closed');
      // this.animal = result;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void {
    // Create the form
  }

  signIn(): void {
    if (this.form.valid) {
      this.isLoading = true;
      // Register the user using AuthService
      this.authService.login(this.form.value).then((response) => {
        this.alert.type = 'success';
        this.alert.message = 'You have successfully Logged In';
        this.showAlert = true;
        this.isLoading = false;
        setTimeout(() => {
                  this.closeDialog();
                  this._router.navigate(['/']);
                }, 1000);
      });
      // this.authService.login({
      //   email: this.email?.value,
      //   password: this.password?.value,
      // })
      //   .then(() => {
      //     this.alert.type = 'success';
      //     this.alert.message = 'You have successfully Logged In';
      //     this.showAlert = true;
      //     this.isLoading = false;
      //     //check if user email is verified if not show him we have sent a verification email
      //     // We have sent a verification email please verify it
      //     if (!this.authService.isUserVerified) {
      //       this.alert.type = 'warning';
      //       this.alert.message = 'We have sent a verification email please verify your email';
      //       this.showAlert = true;
      //     } else {
      //       this.alert.type = 'success';
      //       this.alert.message = 'You have successfully Logged In';
      //       this.showAlert = true;
      //       this.isLoading = false;
      //       setTimeout(() => {
      //         this.closeDialog();
      //         this._router.navigate(['/']);
      //       }, 1000);
      //     }
      //
      //   })
      //   .catch((error: any) => {
      //     this.isLoading = false;
      //     this.alert.type = 'error';
      //     // if error message contains wrong-password show invalid credentials
      //     // if contains user-not-found show user not found
      //     if (error.message.includes('wrong-password')) {
      //       this.alert.message = 'Invalid Credentials';
      //     } else if (error.message.includes('user-not-found')) {
      //       this.alert.message = 'User Not Found';
      //     } else {
      //       this.alert.message = error.message;
      //     }
      //     this.showAlert = true;
      //   });
    } else {
      this.alert = {
        type: 'error',
        message: 'Please fill all the required fields',
      };
      this.showAlert = true;
    }
  }

}
