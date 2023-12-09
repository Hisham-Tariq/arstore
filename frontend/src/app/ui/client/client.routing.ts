import { Route } from '@angular/router';
import {LandingHomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {HowILookComponent} from "./how-i-look/how-i-look.component";
import {CartComponent} from "./cart/cart.component";
import {CheckOutComponent} from "./check-out/check-out.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {SuccessOrderComponent} from "./success-order/success-order.component";
import {OrdersHistoryComponent} from "./orders-history/orders-history.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {OrderDetailComponent} from "../admin/orders/order-detail/order-detail.component";
import {AdminAppContainerComponent} from "../../components/admin-app-container/admin-app-container.component";
import {ReflectionAuthGuard} from "../../Guards/reflection-auth.guard";
import {ProfileComponent} from "./profile/profile.component";

export const clientRouting: Route[] = [
  {
    path:"",
    redirectTo: "home",
    pathMatch:"full",
  },
  {
    path     : 'home',
    component: LandingHomeComponent,
  },
  {
    path     : 'products',
    component: ProductsComponent,
  },
  {
    path     : 'products/:category',
    component: ProductsComponent,
  },
  {
    path     : 'product-detail/:pid',
    component: ProductDetailComponent,
  },
  {
    path     : 'cart',
    component: CartComponent,
  },
  {
    path     : 'check-out',
    component: CheckOutComponent,
  },
  {
    path     : 'about-us',
    component: AboutUsComponent,
  },{
    path     : 'contact-us',
    component: ContactUsComponent,
  },
  {
    path     : 'how-i-look',
    component: HowILookComponent,
  },
  {
    path     : 'success-order',
    component: SuccessOrderComponent,
  },
  {
    path     : 'orders-history',
    component: OrdersHistoryComponent,
  },
  {
    path     : 'invoice/:id',
    component: OrderDetailComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: '',
        loadChildren: (): any =>
          import('src/app/ui/client/profile/profile.module').then(
            m => m.ProfileModule
          ),
      },
    ],
  },
];
