import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {AuthConfirmationRequiredComponent} from "./confirmation-required.component";
import {authConfirmationRequiredRoutes} from "./confirmation-required.routing";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
    declarations: [
        AuthConfirmationRequiredComponent
    ],
    exports: [
        AuthConfirmationRequiredComponent
    ],
    imports: [
        RouterModule.forChild(authConfirmationRequiredRoutes),
        MatButtonModule,
        SharedModule
    ]
})
export class AuthConfirmationRequiredModule
{
}
