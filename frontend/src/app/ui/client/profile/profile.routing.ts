import { Route } from '@angular/router';
import {AccountComponent} from "./account/account.component";
import {PasswordComponent} from "./password/password.component";
import {BillingComponent} from "./billing/billing.component";
import {OrdersComponent} from "./orders/orders.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {OrdersHistoryComponent} from "../orders-history/orders-history.component";
import {OrderDetailComponent} from "../../admin/orders/order-detail/order-detail.component";
import {ProfileGuard} from "../../../Guards/profile.guard";
import {VerifyEmailComponent} from "./verify-email/verify-email.component";


export const profileRouting: Route[] = [
  {
    path:"",
    redirectTo: "account",
    pathMatch:"full",
  },
  {
    path     : 'account',
    component: AccountComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'password',
    component: PasswordComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'billing',
    component: BillingComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'orders',
    component: OrdersHistoryComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'notifications',
    component: NotificationsComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'invoice/:id',
    component: OrderDetailComponent,
    canActivate: [ProfileGuard],
  },
  {
    path     : 'verify',
    component: VerifyEmailComponent,
  },
];
