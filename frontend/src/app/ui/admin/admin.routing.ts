import {Route} from '@angular/router';
import {AddProductsComponent, ProductsListComponent, UpdateProductComponent} from './products';
import {MainCategoryComponent} from './main-category/main-category.component';
import {SubCategoryComponent} from "./sub-category/sub-category.component";
import {OrdersComponent} from "./orders/orders.component";
import {OrderDetailComponent} from "./orders/order-detail/order-detail.component";
import {EventsComponent} from "./events/events.component";
import {CustomersComponent} from "./customers/customers.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {ContactusComponent} from "./contactus/contactus.component";
import {ManageStockComponent} from "./products/manage-stock/manage-stock.component";
import {StockListComponent} from "./products/stock-list/stock-list.component";
import {StockHistoryComponent} from "./products/stock-history/stock-history.component";
import {AdminProfileComponent} from "./admin-profile/admin-profile.component";
import {VoucherCodeComponent} from "./voucher-code/voucher-code.component";
import {ReviewDetailComponent} from "./orders/review-detail/review-detail.component";
export const adminRouting: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: "full"
  },
  {
    path: 'admin-profile',
    component: AdminProfileComponent
  },
  {
    path: 'dashboard',
    component: AnalyticsComponent,
  },
  {
    path: 'add-products',
    component: AddProductsComponent
  },
  {
    path: 'products-list',
    component: ProductsListComponent,
  },
  {
    path: 'update-product/:pid',
    component: UpdateProductComponent,
  },
  {
    path: 'manage-stock',
    component: ManageStockComponent,
  },
  {
    path: 'stock-list',
    component: StockListComponent,
  },
  {
    path: 'stock-history/:pid/:color',
    component: StockHistoryComponent,
  },
  {
    path: 'manage-main-category',
    component: MainCategoryComponent
  },
  {
    path: 'manage-sub-category',
    component: SubCategoryComponent,
  },
  {
    path: 'manage-orders',
    component: OrdersComponent,
  },
  {
    path: 'order-detail/:id',
    component: OrderDetailComponent,
  },
  {
    path: 'review-detail/:id',
    component: ReviewDetailComponent,
  },
  {
    path: 'manage-events',
    component: EventsComponent,
  },
  {
    path: 'voucher-code',
    component: VoucherCodeComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'queries',
    component: ContactusComponent,
  },
];
