import { Component, OnInit } from '@angular/core';
import {INotification} from "../../../../interfaces/i-notification";
import {NotificationService} from "../../../../services/Notification/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  allNotifications: INotification[];

  constructor(
    private notificationsService: NotificationService
  ) {
    this.notificationsService.getAll().subscribe(
      value => {
        this.allNotifications = value;
      }
    )
  }

  ngOnInit(): void {

  }

}
