import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../../services/Authentication";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  isShowingModal: boolean;
  @ViewChild('modal') modal: any;
  @ViewChild('modalTitle') modalTitle: any;
  @ViewChild('modalMessage') modalMessage: any;
  @ViewChild('errorIcon') errorIcon: any;
  @ViewChild('successIcon') successIcon: any;
  isSending: boolean = false;


  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  sendChangePasswordLink(){
    this.isSending = true;
    let email = 'User Email';
    // this.authService.sendResetPasswordLink(email!).then(() => {
    //   this.modal.nativeElement.classList.remove('hidden');
    //   this.isShowingModal = true;
    //   this.modalTitle.nativeElement.innerHTML = 'Change Password';
    //   this.modalMessage.nativeElement.innerHTML = 'Please check your email for a changing your password.';
    //   this.errorIcon.nativeElement.classList.add('hidden');
    //   this.successIcon.nativeElement.classList.remove('hidden');
    // }).catch((reason:Error) => {
    //   console.log(reason);
    //   this.modal.nativeElement.classList.remove('hidden');
    //   this.isShowingModal = true;
    //   this.modalTitle.nativeElement.innerHTML = 'Failed';
    //   this.modalMessage.nativeElement.innerHTML = 'There was an error sending the change password email link. Please try again later.';
    //   this.errorIcon.nativeElement.classList.remove('hidden');
    //   this.successIcon.nativeElement.classList.add('hidden');
    // }).finally(() => {
    //   this.isSending = false;
    // });
  }

  closeModal() {
    this.isShowingModal = false;
    setTimeout(() => {
      this.modal.nativeElement.classList.add('hidden');
    }, 200);
  }

}
