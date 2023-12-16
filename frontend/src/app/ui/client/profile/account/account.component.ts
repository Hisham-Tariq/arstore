import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/Authentication";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('verificationEmailSendModal') verificationEmailSendModal: any;
  isUserVerified: boolean = false;
  showEmailHasBeenSent: boolean = false;

  form = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    userName:[null, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    confirmPassword: [null, Validators.required],
  });

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    // this.auth.onAuthStateChanged(user => {
    //   if(user) this.isUserVerified = user.emailVerified
    // });
  }

  ngOnInit(): void {
  }

  verifyUser() {
    // toggle hidden class
    this.verificationEmailSendModal.nativeElement.classList.toggle('hidden');
    // sendEmailVerification(this.auth.currentUser!);
  }

  closeModal() {
    this.showEmailHasBeenSent = false;
    setTimeout(() => {
      this.verificationEmailSendModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

}
