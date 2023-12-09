import {Directive, ElementRef, HostBinding} from '@angular/core';

@Directive({
  selector: '[reflectionMenuItems]'
})
export class MenuItemsDirective {

  constructor(public host: ElementRef) {
    this.element.classList.add("transition-all");
    this.element.classList.add("duration-1000");
    this.hide();
  }


  get element() {
    return this.host.nativeElement;
  }

  show(){
    this.element.classList.remove("hidden");
    this.element.classList.add("block");
  }

  hide(){
    this.element.classList.add("hidden");
    this.element.classList.remove("block");
  }

}
