import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SharedModule} from "../../../shared/shared.module";
import {authResetPasswordRoutes} from "./reset-password.routing";
import {AuthResetPasswordComponent} from "./reset-password.component";

@NgModule({
    declarations: [
        AuthResetPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(authResetPasswordRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        SharedModule
    ],
    exports :[
        AuthResetPasswordComponent
    ]
})
export class AuthResetPasswordModule
{
}
