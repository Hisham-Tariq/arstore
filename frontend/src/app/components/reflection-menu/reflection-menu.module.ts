import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuButtonDirective } from './menu-button/menu-button.directive';
import { MenuItemsDirective } from './menu-items/menu-items.directive';
import { ReflectionMenuComponent } from './reflection-menu.component';



@NgModule({
  declarations: [
    MenuButtonDirective,
    MenuItemsDirective,
    ReflectionMenuComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MenuButtonDirective,
    MenuItemsDirective,
    ReflectionMenuComponent,
  ]
})
export class ReflectionMenuModule { }
