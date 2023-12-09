import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SubscriberService} from "../../../../services/Subscribers/subscriber.service";


@Component({
  selector: 'app-subscribe-news-letter',
  templateUrl: './subscribe-news-letter.component.html',
  styleUrls: ['./subscribe-news-letter.component.scss']
})
export class SubscribeNewsLetterComponent implements OnInit {
  isSubscribing: boolean = false;
  isShowingLoading: boolean = false;
  @ViewChild('subscribingLoader') subscribingLoader: any;
  @ViewChild('userEmail') emailField: ElementRef;

  constructor(
    private subscribeService: SubscriberService
  ) { }

  ngOnInit(): void {
  }

  async subscribeUser() {
    let email = this.emailField.nativeElement.value;
    console.log(email);
    // validate user email address
    if(!this.validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.subscribingLoader.nativeElement.classList.toggle('hidden');
    this.isSubscribing = true;
    this.isShowingLoading= true;

    await this.subscribeService.addUserToSubscribersList(email);

    this.emailField.nativeElement.value = '';
    this.isSubscribing = false;
  }

  closeLoadingModal() {
    if(this.isSubscribing) return;
    this.isShowingLoading = false;
    setTimeout(() => {
      this.subscribingLoader.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  private validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
