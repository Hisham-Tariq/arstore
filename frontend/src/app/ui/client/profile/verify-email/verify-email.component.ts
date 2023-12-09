import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../../services/Authentication";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  isShowingModal: boolean;
  @ViewChild('modal') modal: any;
  @ViewChild('modalTitle') modalTitle: any;
  @ViewChild('modalMessage') modalMessage: any;
  isSending: boolean = false;



  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  onSendVerificationEmail(){
    this.isSending = true;
    this.authService.sendVerificationEmail().then(() => {
      this.modal.nativeElement.classList.remove('hidden');
      this.isShowingModal = true;
      this.modalTitle.nativeElement.innerHTML = 'Verification Email Sent';
      this.modalMessage.nativeElement.innerHTML = 'Please check your email for a verification link.';
    }).catch((reason:Error) => {
      this.modal.nativeElement.classList.remove('hidden');
      this.isShowingModal = true;
      if(reason.message == 'not eligible'){
        this.modalTitle.nativeElement.innerHTML = 'Verification Email Not Sent';
        this.modalMessage.nativeElement.innerHTML = `You are not eligible till ${this.authService.emailVerificationEligibleTime} to send a verification email.`;
      } else {
        this.modalTitle.nativeElement.innerHTML = 'Error Sending Verification Email';
        this.modalMessage.nativeElement.innerHTML = 'There was an error sending the verification email. Please try again later.';
      }
    }).finally(() => {
      this.isSending = false;
    });
  }

  closeModal() {
    this.isShowingModal = false;
    setTimeout(() => {
      this.modal.nativeElement.classList.add('hidden');
    }, 200);
  }

}
