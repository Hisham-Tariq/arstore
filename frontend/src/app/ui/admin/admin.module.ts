import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddProductsComponent, ProductsListComponent, UpdateProductComponent} from './products';
import {RouterModule} from '@angular/router';
import {adminRouting} from './admin.routing';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MainCategoryComponent} from './main-category/main-category.component';
import {
  UpdateMainCategoryDialogComponent
} from './main-category/update-main-category-dialog/update-main-category-dialog.component';
import {SubCategoryComponent} from './sub-category/sub-category.component';
import {
  UpdateSubCategoryDialogComponent
} from './sub-category/update-sub-category-dialog/update-sub-category-dialog.component';
import {OrdersComponent} from './orders/orders.component';
import {ReflectionAlertModule} from "../../components/alert";
import {OrderDetailComponent} from './orders/order-detail/order-detail.component';
import {CdkScrollableModule} from "@angular/cdk/scrolling";
import {MatChipsModule} from "@angular/material/chips";
import {NgSelectModule} from "@ng-select/ng-select";
import {ComponentsModule} from "../../components/components.module";
import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {EventsComponent} from './events/events.component';
import {UpdateEventDialogComponent} from './events/update-event-dialog/update-event-dialog.component';
import {CustomersComponent} from './customers/customers.component';
import {AnalyticsComponent} from "./analytics/analytics.component";
//import {NgApexchartsModule} from "ng-apexcharts";
import {CustomersChartComponent} from './analytics/customers-chart/customers-chart.component';
import {ProfitChartComponent} from './analytics/profit-chart/profit-chart.component';
import {OrdersChartComponent} from './analytics/orders-chart/orders-chart.component';
import {ContactusComponent} from "./contactus/contactus.component";
import {FuseScrollbarModule} from "../../directives/scrollbar";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {ManageStockComponent} from './products/manage-stock/manage-stock.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { StockListComponent } from './products/stock-list/stock-list.component';
import { StockHistoryComponent } from './products/stock-history/stock-history.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { VoucherCodeComponent } from './voucher-code/voucher-code.component';
import { UpdateCodeDialogComponent } from './voucher-code/update-code-dialog/update-code-dialog.component';
import { ReviewDetailComponent } from './orders/review-detail/review-detail.component';


@NgModule({
  declarations: [
    AddProductsComponent,
    ProductsListComponent,
    UpdateProductComponent,
    MainCategoryComponent,
    UpdateMainCategoryDialogComponent,
    SubCategoryComponent,
    UpdateSubCategoryDialogComponent,
    OrdersComponent,
    OrderDetailComponent,
    EventsComponent,
    UpdateEventDialogComponent,
    CustomersComponent,
    AnalyticsComponent,
    CustomersChartComponent,
    ProfitChartComponent,
    OrdersChartComponent,
    ContactusComponent,
    ManageStockComponent,
    StockListComponent,
    StockHistoryComponent,
    AdminProfileComponent,
    VoucherCodeComponent,
    UpdateCodeDialogComponent,
    ReviewDetailComponent,
  ],
    imports: [
        RouterModule.forChild(adminRouting),
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatListModule,
        FormsModule,
        ReflectionAlertModule,
        CdkScrollableModule,
        MatChipsModule,
        NgSelectModule,
        ComponentsModule,
        VirtualScrollerModule,
        NgApexchartsModule,
        FuseScrollbarModule,
        PerfectScrollbarModule,
        ColorPickerModule,
        MatProgressSpinnerModule
    ],
    exports: [
        AddProductsComponent,
        ProductsListComponent,
        UpdateProductComponent,
        ManageStockComponent,
        EventsComponent,
        VoucherCodeComponent,
    ],
})
export class AdminModule {
}
