import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReflectionDrawerComponent } from './drawer.component';

@NgModule({
    declarations: [
        ReflectionDrawerComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        ReflectionDrawerComponent
    ]
})
export class ReflectionDrawerModule
{
}
