import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_MENU_SCROLL_STRATEGY, MatMenuModule} from "@angular/material/menu";
import {ComponentsModule} from "../../components/components.module";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from '@angular/router';
import {ReflectionDrawerModule} from "../../components/drawer";
import {clientRouting} from './client.routing';
import {LandingHomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {HowILookComponent} from "./how-i-look/how-i-look.component";
import {CartComponent} from "./cart/cart.component";
import {CheckOutComponent} from "./check-out/check-out.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {WebcamModule} from 'ngx-webcam';
import { TryOnComponent } from './product-detail/try-on/try-on.component';
import { SuccessOrderComponent } from './success-order/success-order.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { HeroSectionComponent } from './home/hero-section/hero-section.component';
import { DiscountSectionComponent } from './home/discount-section/discount-section.component';
import { TeamSectionComponent } from './home/team-section/team-section.component';
import { ReviewSectionComponent } from './product-detail/review-section/review-section.component';
import { TestimonialComponent } from './home/testimonial/testimonial.component';
import {ReflectionAlertModule} from "../../components/alert";
import { LendingPageComponent } from './home/lending-page/lending-page.component';
import { CartProductCardComponent } from './cart/cart-product-card/cart-product-card.component';
import { ItemCardComponent } from './check-out/item-card/item-card.component';
import { OrderCardComponent } from './orders-history/order-card/order-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewProductCarouselComponent } from './home/new-product-carousel/new-product-carousel.component';
import {DragScrollModule} from "ngx-drag-scroll";
import {BarRatingModule} from "ngx-bar-rating";
import { EventsComponent } from './home/events/events.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import { SubscribeNewsLetterComponent } from './home/subscribe-news-letter/subscribe-news-letter.component';


@NgModule({
  declarations: [
    LandingHomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    CheckOutComponent,
    CartComponent,
    AboutUsComponent,
    ContactUsComponent,
    HowILookComponent,
    TryOnComponent,
    SuccessOrderComponent,
    OrdersHistoryComponent,
    HeroSectionComponent,
    DiscountSectionComponent,
    TeamSectionComponent,
    ReviewSectionComponent,
    TestimonialComponent,
    LendingPageComponent,
    CartProductCardComponent,
    ItemCardComponent,
    OrderCardComponent,
    UserProfileComponent,
    NewProductCarouselComponent,
    EventsComponent,
    SubscribeNewsLetterComponent,
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        SharedModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatMenuModule,
        ComponentsModule,
        ReflectionDrawerModule,
        WebcamModule,

        RouterModule.forChild(clientRouting),
        ReflectionAlertModule,
        DragScrollModule,
        BarRatingModule,
        LazyLoadImageModule,
    ],
  exports: [
    LandingHomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    CheckOutComponent,
    CartComponent,
    AboutUsComponent,
    ContactUsComponent,
    HowILookComponent,
  ],
})
export class ClientModule {
}
