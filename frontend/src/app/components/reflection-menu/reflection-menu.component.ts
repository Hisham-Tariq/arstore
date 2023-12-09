import {Component, ContentChild, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {MenuButtonDirective} from "./menu-button/menu-button.directive";
import {MenuItemsDirective} from "./menu-items/menu-items.directive";
import {Subscription} from "rxjs";
import Popper, {Placement} from "popper.js";
import {randomId} from "../../utils";

@Component({
  selector: 'reflection-menu',
  templateUrl: './reflection-menu.component.html',
  styleUrls: ['./reflection-menu.component.scss']
})
export class ReflectionMenuComponent implements OnInit {

  @ContentChild(MenuButtonDirective) menuButton!: MenuButtonDirective;
  @ContentChild(MenuItemsDirective) items!: MenuItemsDirective;
  @Input() placement: Placement = "bottom-start";

  id: string = randomId(10);
  private _isOpen: boolean = false;
  private _menuButtonClickListener!: Subscription;

  constructor(private host: ElementRef) {

  }

  ngOnInit(): void {
    jQuery($ => {
      $(`#menu-button-wrapper-${this.id}`).append(this.menuButton.element)
      $(`#menu-items-wrapper-${this.id}`).append(this.items.element)
    });
  }

  ngAfterContentInit() {
    this._menuButtonClickListener = this.menuButton.click.subscribe(_ => {
      this._isOpen = !this._isOpen;
      if (this._isOpen) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  @HostListener("document:click", ["$event.target"])
  click(target: any) {
    if (!(this.host.nativeElement as HTMLElement).contains(target)) {
      this.close();
    }
  }

  /**
   * Open the menu
   */
  open() {
    this._isOpen = true;
    this.items.show();
  }


  /**
   * close the menu
   */
  close() {
    this._isOpen = false;
    this.items.hide();
  }

  private _toggleDropdown() {
    this._isOpen ? this.items.hide() : this.items.show();
  }

  /**
   * Remove the MenuButton Click Listener
   */
  ngOnDestroy() {
    this._menuButtonClickListener && this._menuButtonClickListener.unsubscribe();
    this.close();
  }


}
