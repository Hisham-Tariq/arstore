import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { reflectionAnimations } from 'src/app/animations';
import { NavItem } from '../../navigation.type';
import * as $ from "jquery";
import {Router} from "@angular/router";

@Component({
  selector: 'collapsable-vertical-nav-item',
  templateUrl: './collapsable.component.html',
  styleUrls: ['../style.scss'],
  animations: reflectionAnimations,
})
export class CollapsableVerticalNavItemComponent implements OnInit {
  @Input() item!: NavItem;
  @Output() onItemClicked = new EventEmitter();

  isCollapsed = true;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {}

  toggleChildren(): void {
    // let item = $('#dropdown-item');
    // item.toggleClass("max-h-0");
    this.isCollapsed = !this.isCollapsed;
  }

  onSubItemsClicked(): void {
    this.isCollapsed = !this.isCollapsed
    this.onItemClicked.emit();
  }

}
