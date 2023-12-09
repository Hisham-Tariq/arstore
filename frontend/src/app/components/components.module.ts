import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from './product-card/product-card.component';
import {FooterComponent} from './footer/footer.component';
import {ClientAppContainerComponent} from './client-app-container/client-app-container.component';
import {AdminAppContainerComponent} from './admin-app-container/admin-app-container.component';
import {RouterModule} from "@angular/router";
import {NavbarComponent} from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from '@angular/material/sidenav';
import {ReflectionDrawerModule} from "./drawer";
import {BasicHorizontalNavItemComponent, CollapsableHorizontalNavItemComponent} from './navigations/horizontal';
import {BasicVerticalNavItemComponent, CollapsableVerticalNavItemComponent} from "./navigations/vertical";
import {MatMenuModule} from "@angular/material/menu";
import {ImageUploadComponent} from './image-upload/image-upload.component';
import {ReflectionMenuModule} from "./reflection-menu/reflection-menu.module";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import { CartItemCardComponent } from './navbar/cart-item-card/cart-item-card.component';
import {SharedModule} from "../shared/shared.module";
import { TopProductsComponent } from './top-products/top-products.component';
import {BarRatingModule} from "ngx-bar-rating";
import {LazyLoadImageModule} from "ng-lazyload-image";


@NgModule({
  declarations: [
    ProductCardComponent,
    FooterComponent,
    ClientAppContainerComponent,
    AdminAppContainerComponent,
    NavbarComponent,
    BasicVerticalNavItemComponent,
    CollapsableVerticalNavItemComponent,
    CollapsableHorizontalNavItemComponent,
    BasicHorizontalNavItemComponent,
    ImageUploadComponent,
    CartItemCardComponent,
    TopProductsComponent,
  ],
    imports: [
        CommonModule,
        MatMenuModule,
        RouterModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        ReflectionDrawerModule,
        ReflectionMenuModule,
        PerfectScrollbarModule,
        SharedModule,
        BarRatingModule,
        LazyLoadImageModule,
    ],
    exports: [
        ProductCardComponent,
        FooterComponent,
        ClientAppContainerComponent,
        AdminAppContainerComponent,
        NavbarComponent,
        BasicVerticalNavItemComponent,
        CollapsableVerticalNavItemComponent,
        CollapsableHorizontalNavItemComponent,
        BasicHorizontalNavItemComponent,
        ImageUploadComponent,
        ReflectionMenuModule,
        TopProductsComponent,
    ]
})
export class ComponentsModule {
}
