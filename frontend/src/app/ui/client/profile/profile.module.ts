import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile.component';
import {RouterModule} from "@angular/router";
import {profileRouting} from "./profile.routing";
import {MatIconModule} from "@angular/material/icon";
import { PasswordComponent } from './password/password.component';
import { BillingComponent } from './billing/billing.component';
import { OrdersComponent } from './orders/orders.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {SharedModule} from "../../../shared/shared.module";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    PasswordComponent,
    BillingComponent,
    OrdersComponent,
    NotificationsComponent,
    VerifyEmailComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(profileRouting),
        MatIconModule,
        SharedModule,
        MatProgressSpinnerModule,
    ]
})
export class ProfileModule {

}
