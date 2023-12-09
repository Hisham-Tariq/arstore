import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../services/Authentication";
import {Router} from "@angular/router";
import {Auth, sendEmailVerification} from "@angular/fire/auth";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
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
    private auth: Auth,
  ) {
    this.auth.onAuthStateChanged(user => {
      if(user) this.isUserVerified = user.emailVerified
    });
  }

  ngOnInit(): void {
    document.body.classList.add('bg-gray-100');
  }

  goToOrders() {
    this.router.navigateByUrl('/orders-history');
  }

  verifyUser() {
    // toggle hidden class
    this.verificationEmailSendModal.nativeElement.classList.toggle('hidden');
    sendEmailVerification(this.auth.currentUser!);
  }

  closeModal() {
    this.showEmailHasBeenSent = false;
    setTimeout(() => {
      this.verificationEmailSendModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-gray-100');
  }

}
