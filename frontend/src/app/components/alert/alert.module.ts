import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReflectionAlertComponent } from './alert.component';

@NgModule({
    declarations: [
        ReflectionAlertComponent
    ],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        ReflectionAlertComponent
    ]
})
export class ReflectionAlertModule
{
}
