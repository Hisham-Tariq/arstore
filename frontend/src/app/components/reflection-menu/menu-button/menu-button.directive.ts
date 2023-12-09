import {Directive, ElementRef} from '@angular/core';
import {fromEvent} from "rxjs";

@Directive({
  selector: '[reflectionMenuButton]'
})
export class MenuButtonDirective {
  click = fromEvent(this.element, "click");
  constructor(public host: ElementRef) {
  }

  get element() {
    return this.host.nativeElement;
  }

}
