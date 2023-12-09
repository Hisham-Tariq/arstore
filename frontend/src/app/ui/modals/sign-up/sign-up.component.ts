import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {reflectionAnimations} from '../../../animations';
import {ReflectionAlertType} from "../../../components/alert";
import {MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {AuthSignInComponent} from '../sign-in/sign-in.component';
import {AuthService} from "../../../services/Authentication";
import {ReflectionEmailValidator} from "../../../validators/reflection-email.validator";

// TODO: show Profile rather than logout button and show a dropdown which will contain logout and other options

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: reflectionAnimations,
})
export class AuthSignUpComponent implements OnInit {

  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  form: FormGroup;
  showAlert: boolean = false;
  isRegistering: boolean = false;
  isUserLoggedIn: boolean = false;

  /**
   * Constructor
   */
  constructor(
    // private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AuthSignUpComponent>,
    public readonly authService: AuthService,
  ) {
    this.form = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, ReflectionEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreements: false,
    });
    this.authService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  get firstName(): AbstractControl | null {
    return this.form.get("firstName");
  }

  get lastName(): AbstractControl | null {
    return this.form.get("lastName");
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get password(): AbstractControl | null {
    return this.form.get("password");
  }


  openDialog(): void {
    this.closeDialog();
    setTimeout(() => {
      const dialogRef = this.dialog.open(AuthSignInComponent, {
        // width: '250px',
        // data: { name: this.name, animal: this.animal },
      });

      dialogRef.afterClosed().subscribe((_) => {
        console.log('The dialog was closed');
        // this.animal = result;
      });
    }, 50);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Create the form
  }

  async signUp(): Promise<void> {
    if (this.form.valid) {
      // Register the user using AuthService
      this.isRegistering = true;

      let registerTask = this.authService.register({
        email: this.email?.value,
        password: this.password?.value,
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
      });

      registerTask.then(() => {
        /// show alert with message successfully registered adn we have sent verification email
        this.isRegistering = false;
        this.alert.type = 'success';
        this.alert.message = 'Successfully registered. Please check your email to verify your account.';
        this.showAlert = true;
        // setTimeout(() => {
        //   this.closeDialog();
        //   this._router.navigate(['/']);
        // }, 1000);
      })
        .catch((error) => {
          this.isRegistering = false;
          this.alert.type = 'error';
          // check if email is already in use
          if (error.code === 'auth/email-already-in-use') {
            this.alert.message = 'Email is already in use.';
          } else {
            this.alert.message = error.message;
          }

          this.showAlert = true;
        });

    } else {
      this.alert = {
        type: 'error',
        message: 'Please fill all the required fields',
      };
      this.showAlert = true;
    }
  }
}

