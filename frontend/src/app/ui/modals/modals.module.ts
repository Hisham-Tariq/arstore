import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthSignInComponent} from "./sign-in/sign-in.component";
import {AuthSignUpComponent} from "./sign-up/sign-up.component";
import {AuthForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SharedModule} from "../../shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterModule} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {ReflectionAlertModule} from "../../components/alert/alert.module";
import { TryOnProductComponent } from './try-on-product/try-on-product.component';
import {WebcamModule} from "ngx-webcam";
import { SearchPaletteComponent } from './search-palette/search-palette.component';


@NgModule({
  declarations:[
    AuthSignInComponent,
    AuthSignUpComponent,
    AuthForgotPasswordComponent,
    TryOnProductComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    SharedModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatInputModule,
    ReflectionAlertModule,
    WebcamModule
  ],
    exports: [
      AuthSignInComponent,
      AuthSignUpComponent,
      AuthForgotPasswordComponent,
    ],
})
export class ModalsModule {
}
